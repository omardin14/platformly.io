---
name: archon-dev
description: |
  The PRIMARY development workflow for platformly (Tauri 2 + Rust + kube-rs desktop). Routes any
  dev task to one of 10 cookbooks based on intent:

  RESEARCH    — "how does the kube client work?", "where is context-switching defined?", "trace the IPC flow"
  INVESTIGATE — "should we use kube-rs runtime or raw watches?", "best way to stream logs?", "can we embed kind?"
  PRD         — "write a PRD for the RBAC explorer", "spec the NetworkPolicy graph"
  PLAN        — "plan the cluster-connection manager", "design the security-score rollup", "plan #42"
  IMPLEMENT   — "implement the plan", "execute .claude/archon/plans/rbac.plan.md", "build it"
  REVIEW      — "review PR #123", "review my changes" (delegates to /review-pr)
  DEBUG       — "debug the failing watch test", "why does context switch hang?", "rca the panic"
  COMMIT      — "commit these changes"
  PR          — "create a PR", "open a pull request"
  ISSUE       — "file a gh issue", "report this bug"

  Triggers on ANY dev task: research, investigate, plan, build, review, debug, commit, ship.
  NOT for: running the .archon/ orchestration workflows (those use the Archon CLI directly).
argument-hint: "[cookbook] [task description or issue number]"
---

# archon-dev — platformly development workflow

Match the user's intent to a cookbook and follow it. The cookbooks live in `cookbooks/`.

## Routing

| Intent | Keywords | Cookbook |
|---|---|---|
| Understand existing code | research, how does, what is, where is, trace, find | `cookbooks/research.md` |
| Strategic/library/feasibility research | investigate, should we, can we, compare, evaluate, best way | `cookbooks/investigate.md` |
| Write product requirements | prd, requirements, spec | `cookbooks/prd.md` |
| Create implementation plan | plan, design, architect | `cookbooks/plan.md` |
| Execute a plan | implement, execute, build, path to `.plan.md` | `cookbooks/implement.md` |
| Review code/PR | review, review PR, code review | `cookbooks/review.md` |
| Debug / RCA | debug, rca, root cause, why is, failing | `cookbooks/debug.md` |
| Commit | commit, save changes, stage | `cookbooks/commit.md` |
| Open a PR | pr, pull request, open pr | `cookbooks/pr.md` |
| File a GitHub issue | issue, report to gh, file a bug | `cookbooks/issue.md` |

## Workflow chain
```
research → investigate → prd → plan → implement → commit → pr
                          ▲                 │
            debug ────────┘     review ◄────┘
              └──► issue ──► plan (feature) | debug (bug)
```

## Project facts (this repo)
- **Package managers:** pnpm (JS workspaces) + Cargo (Rust workspace).
- **Validation command:** `make check` (cargo check + cargo test + frontend typecheck). Lint: `cargo clippy`.
- **Artifacts** live in `.claude/archon/` (committed): `prds/ plans/ plans/completed/ reports/ issues/
  issues/completed/ reviews/ debug/ research/`.
- **Plan files:** `.claude/archon/plans/<slug>.plan.md` with: Mandatory Reading · Step-by-Step Tasks
  (checkboxes) · Validation Commands · Acceptance Criteria.

## Rules
1. **Evidence-based** — every claim about the codebase cites `file:line`.
2. **No speculation** — if uncertain, run research/investigate first.
3. **Fail fast** — surface errors; never swallow them.
4. **Respect `CLAUDE.md`** — project conventions override cookbook defaults.
5. **AI attribution REQUIRED** — commits end with `Co-Authored-By: Claude Opus 4.8 (1M context)
   <noreply@anthropic.com>`; PR bodies end with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
   *(This overrides the upstream archon-dev "no attribution" rule — see `CLAUDE.md`.)*
