# Cookbook: RESEARCH — understand existing code

**Goal:** answer "how does X work / where is Y / trace the flow" with evidence. Document what
exists; do not propose changes.

## Steps
1. Scope the question. If broad, fan out `codebase-explorer` / `codebase-analyst` agents in parallel.
2. Read the actual files. Trace real paths (e.g. `invoke('x')` in `apps/desktop/src` →
   `#[tauri::command] fn x` in `src-tauri` → kube-rs call).
3. Write findings to `.claude/archon/research/<slug>.md`:
   - Overview · Entry points (table, `file:line`) · Implementation flow · Data flow · Open questions.
4. Every claim cites `file:line`. No improvement suggestions (that's `investigate`/`plan`).

## Output
The research doc path + a 3–5 bullet summary. Suggest the next step (usually `plan` or `investigate`).
