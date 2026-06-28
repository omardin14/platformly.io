# .claude/archon — development artifacts

Committed artifacts produced by the `archon-dev` skill (and the `.archon/` workflows). They form an
audit trail of how features were researched, planned, built, and reviewed.

| Dir | Holds | Written by |
|---|---|---|
| `research/` | "how does X work" + feasibility findings | research, investigate cookbooks |
| `prds/` | product requirements | prd cookbook |
| `plans/` | implementation plans (`<slug>.plan.md`) | plan cookbook |
| `plans/completed/` | archived plans after merge | implement cookbook (ARCHIVE) |
| `reports/` | post-implementation reports (assessment vs reality) | implement cookbook |
| `reviews/` | captured PR review findings | review cookbook |
| `issues/` | issue investigations | issue cookbook |
| `issues/completed/` | resolved issue notes | — |
| `debug/` | root-cause analyses | debug cookbook |

Plan file shape: **Mandatory Reading · Step-by-Step Tasks (checkboxes) · Validation Commands ·
Acceptance Criteria · Risks**. Validation command for this repo: `make check`.
