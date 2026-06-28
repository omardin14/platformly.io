# Cookbook: PRD — product requirements

**Goal:** a crisp spec an engineer (or agent) can plan from.

## Steps
1. Clarify the user-facing outcome (one sentence). If unclear, ask 1–3 targeted questions.
2. Write `.claude/archon/prds/<slug>.prd.md`:
   - **Intent** — what the user can do after this ships.
   - **User stories** — "As a … I can … so that …".
   - **Acceptance criteria** — observable, verifiable bullets (≥2, include an edge case).
   - **Constraints** — IPC contract, kube safety (destructive ops need a guard + dry-run), security, perf.
   - **Non-goals** — explicitly out of scope.
   - **CKS mapping** (if a security feature) — which exam domain it serves.
3. Keep it implementation-light — the `plan` cookbook decides the how.

## Output
The PRD path + summary. Suggest `plan` next.
