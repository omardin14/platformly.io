# Cookbook: ISSUE — file a GitHub issue

**Goal:** an AI-ready issue an agent can take to PR.

## Steps
1. Decide type: bug or feature.
2. Use the `.github/ISSUE_TEMPLATE/ai-ready.md` shape:
   - **Intent** — what the user can do after this ships (one sentence).
   - **Done when** — observable, verifiable checkboxes.
   - **Constraints** — IPC contract / kube safety / security / perf; off-limits files.
   - **Entry points** — likely modules (or omit; the plan phase discovers them).
   - **Non-goals**.
3. `gh issue create --label ai-ready` with that body. For a bug, link the `.claude/archon/debug/<slug>.md`
   root-cause doc if one exists.

## Output
The issue URL. Suggest `plan` (feature) or `debug` (bug) next.
