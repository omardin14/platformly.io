# .archon — autonomous orchestration workflows

These workflows drive multi-agent, plan-gated feature builds (idea → plan → implement → review → PR).

> **Prerequisite:** running these requires the **Archon CLI / Pi tooling** (the `archon` runner +
> the `plannotator` plan-review extension). Without it, the YAML here is inert. The standalone
> `.claude/skills/archon-dev` skill does NOT need Archon — it's just cookbooks the main agent follows,
> and is the recommended path until the Archon CLI is set up.

Adapted from the GitHubIssueTriager workflows, with platformly differences:
- **No database** — the Neon branch-per-run pre/post hooks were removed (platformly is local-first, no DB).
- **Validation command** is `make check` (cargo check + cargo test + frontend typecheck).
- **Reviewers** map to platformly's `.claude/agents/` (code-reviewer, silent-failure-hunter,
  rust-safety-auditor, tauri-ipc-checker, pr-test-analyzer).
- **Commits/PRs require the AI-attribution footer** (see `CLAUDE.md`).

## Workflows
- `workflows/platformly-plannotator-piv.yaml` — plan-gated build: clarify → plan (HTTP review gate) →
  verify-plan → implement (fresh context per task) → final-review.
- `workflows/platformly-idea-to-pr.yaml` — full idea → PR with a parallel 5-reviewer fan-out + synthesis.

## Config
`config.yaml` enables the Pi assistant with the plannotator extension (plan review UI on 127.0.0.1:19432).
