# Cookbook: INVESTIGATE — feasibility / library / approach research

**Goal:** answer "should we use X / what's the best way to Y / can we Z" with a recommendation.

## Steps
1. Frame the decision and the constraints (from `CLAUDE.md` + the task).
2. Gather evidence:
   - Internal: how the codebase does related things (cite `file:line`).
   - External: launch `web-researcher` for current docs/crate versions/best practices (cite URLs + dates).
3. Compare 2–3 options in a table: effort · risk · fit with the Tauri/Rust/kube-rs stack · reversibility.
4. Write `.claude/archon/research/<slug>-investigation.md`: question · options table · **recommendation**
   + rationale · risks.

## Output
The doc path + a clear recommendation. Suggest `prd` or `plan` next.
