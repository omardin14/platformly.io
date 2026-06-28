---
description: Cross-provider review — compares Codex's adversarial review against Claude's /review-pr to surface blind spots. Two-phase human-in-the-loop (the Codex plugin hides its review commands from model invocation by design).
argument-hint: [pr-number]
allowed-tools: ["Bash", "Glob", "Grep", "Read"]
---

# Cross-Provider Review (Claude + Codex)

Claude and GPT were trained on different distributions, so Codex catches things Claude's own
fan-out reviewers miss. The Codex plugin marks `/codex:adversarial-review` with
`disable-model-invocation: true`, so this is a **two-phase human-in-the-loop**: you run Codex's
review in the session, then re-invoke `/cross-review` and I compare.

## Workflow

**Step 1 — Resolve the PR / diff.**
```bash
gh pr view --json number,url,title,headRefName 2>/dev/null || git diff main...HEAD --stat
```

**Step 2 — Verify the Codex plugin is installed.** If no `/codex:*` commands exist (check
`.claude/settings.json` for `enabledPlugins."codex@openai-codex"` and the plugin cache), tell the user:
```
/plugin marketplace add openai/codex-plugin-cc
/plugin install codex@openai-codex
/reload-plugins
/codex:setup
```
Then stop.

**Step 3 — Check for recent `/codex:adversarial-review` output in this session.**

- **If NOT present → PHASE 1 (hand off).** Tell the user verbatim, then stop:
  > Codex's review commands are locked off from model invocation by the plugin
  > (`disable-model-invocation: true`), so run this yourself in this same session:
  >
  > ```
  > /codex:adversarial-review --scope branch --base main
  > ```
  >
  > Once Codex's output is in the conversation, re-run `/cross-review $ARGUMENTS` and I'll compare.

  Do NOT try to invoke it via the Skill/Task tools — it isn't registered for the model; the call fails.

- **If present → PHASE 2 (compare).** Continue.

**Step 4 — Compare.** Put Codex's findings next to Claude's prior `/review-pr` findings in one table:
```
| Source | Severity | File:Line | Issue |
```

**Step 5 — Highlight cross-provider wins.** For each finding Codex flagged that Claude's reviewers
did NOT, draft a one-line candidate `CLAUDE.md` rule so the blind spot becomes a permanent fix.

## Notes
- Keep it terse — surface blind spots, don't re-list agreements (though convergence is itself signal).
- Review only; no fixes. The two-phase shape is a plugin-policy constraint, not a workaround.
