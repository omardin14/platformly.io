---
description: Fresh-context PR review — fans out parallel specialized subagents on the current branch diff.
argument-hint: [review-aspects]
allowed-tools: ["Bash", "Glob", "Grep", "Read", "Task"]
---

# Fresh-Context PR Review

Review the current branch (or uncommitted working tree if on `main`) by fanning out specialized
subagents **in parallel**.

**Principle:** The session that wrote the code should NOT review it. Run this in a fresh `claude`
session so reviewers aren't primed by the implementer's reasoning. Fresh context, no sycophancy.

**Review aspects (optional):** "$ARGUMENTS" — if blank, run every applicable reviewer.

## Workflow

1. **Identify the diff.**
   - `git diff main...HEAD` plus `git status` for uncommitted work. If on `main`, fall back to
     unstaged `git diff` and note it.
   - Read `CLAUDE.md` for project context before fanning out.

2. **Decide which reviewers apply** (file-pattern trigger gates — when in doubt, include):
   - **Always**: `code-reviewer` (general quality + CLAUDE.md compliance).
   - **If error handling / try-catch / `.catch` / Rust `Result` changed**: `silent-failure-hunter`.
   - **If diff touches `apps/desktop/src-tauri/**/*.rs`**: `rust-safety-auditor` (panics, blocking-in-async,
     unguarded destructive kube ops).
   - **If diff touches `src-tauri/**/*.rs` commands OR `apps/desktop/src/**` invoke call sites OR
     `tauri.conf.json` / `src-tauri/capabilities/**`**: `tauri-ipc-checker`.
   - **If diff touches `apps/sync-api/**` OR client `*/api.ts` OR `packages/shared-types/**`**:
     `sync-api-contract-checker` (no-op if sync-api absent).
   - **If tests added/modified**: `pr-test-analyzer`.
   - **After the above**: `code-simplifier` (polish pass — non-blocking).

3. **Fan out in parallel.** Launch all applicable subagents in a **single message** (one `Task` call
   per reviewer, same batch → concurrent). Each receives: the changed-file list, a one-paragraph PR
   intent (derive from `git log main..HEAD --oneline`), an instruction to focus on the diff, and a
   reminder that findings must cite `file:line`.

4. **Validation gate.** Run the project's checks; fold *new* failures into the summary as Critical:
   - `cargo check --manifest-path apps/desktop/src-tauri/Cargo.toml`
   - `pnpm -r --if-present typecheck`
   - (skip the full `make check` if slow — note the skip)

5. **Aggregate** into one summary:
   ```markdown
   # PR Review — <one-line summary>
   ## Critical (must fix before merge)
   - [reviewer] <issue> — `file:42`
   ## Important (should fix)
   ## Suggestions
   ## Strengths
   ## Verdict
   APPROVE / APPROVE_WITH_CHANGES / REQUEST_CHANGES
   ```

6. **Do not apply fixes automatically.** Purpose is independent review. For fixes, run `/triage-review`.

## Notes
- Parallel is the default — sequential is the same signal, slower.
- Reviewers live in `.claude/agents/`. Keep findings actionable: `file:line` + one sentence + fix.
- Trivial diff (docs-only, one-liner) → return APPROVE with zero findings, don't fabricate issues.
