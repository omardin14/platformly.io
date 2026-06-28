# Cookbook: PLAN — implementation plan

**Goal:** a step-by-step plan with validation gates that `implement` can execute task-by-task.

## Steps
1. Read `CLAUDE.md`, the PRD (if any), and research findings. Read the critical files you'll touch.
2. Write `.claude/archon/plans/<slug>.plan.md`:
   - **Mandatory Reading** — the files/agents to read first (with paths).
   - **Step-by-Step Tasks** — ordered checkboxes; each task small + independently verifiable. Note the
     Rust↔TS boundary explicitly (new `#[tauri::command]` + its `invoke` call site + ts-rs type).
   - **Validation Commands** — `make check`, `cargo clippy`, specific tests per task.
   - **Acceptance Criteria** — from the PRD; how to verify end-to-end (e.g. against a kind cluster).
   - **Risks** — destructive-kube guards, watch-stream leaks, contract drift.
3. Prefer reusing existing utilities/patterns (cite `file:line`) over new code.

## Output
The plan path. Suggest `implement` next (and `/review-pr` after).
