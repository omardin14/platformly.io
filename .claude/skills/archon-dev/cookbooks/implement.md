# Cookbook: IMPLEMENT — execute a plan

**Goal:** turn a `.plan.md` into working code, task-by-task, with validation gates.

## Phases
0. **DETECT** — confirm stack (pnpm + cargo), validation command (`make check`), and read `CLAUDE.md`.
1. **LOAD** — read the plan at `.claude/archon/plans/<slug>.plan.md` + its Mandatory Reading.
2. **PREFLIGHT** — ensure you're on a feature branch (not `main`); `git status` clean-ish.
3. **EXECUTE** — for each unchecked task, in order:
   - Implement the smallest correct change. Reuse existing patterns (cite `file:line`).
   - For IPC work: add the `#[tauri::command]`, register it in `generate_handler!`, add the `invoke`
     call site, and the ts-rs type — all in the same task.
   - Validate incrementally: `cargo check` / targeted test / `pnpm typecheck`. Fix before moving on.
   - Check the task box in the plan.
4. **VALIDATE** — run the full `make check` + `cargo clippy`. Everything green.
5. **REPORT** — write `.claude/archon/reports/<slug>-report.md`: Assessment vs Reality · Deviations ·
   Validation results · Follow-ups.
6. **ARCHIVE** — move the plan to `.claude/archon/plans/completed/`; update the PRD status if any.

## Rules
- One task at a time; never batch past a failing gate.
- Destructive kube ops get a confirmation + dry-run path (see `rust-safety-auditor`).
- Surface errors; never swallow them.

## Output
Report path + a summary. Suggest `/clear` then `/review-pr`, then `commit`.
