# Cookbook: REVIEW — code/PR review

**Goal:** independent review. Prefer the dedicated command over an inline review.

## Steps
1. **Use `/review-pr`** (fresh-context parallel fan-out of the `.claude/agents/`). The implementer
   session should not review its own code — `/clear` first, or run in a separate session.
2. For security-critical PRs, follow with **`/cross-review`** (layer Codex).
3. Capture the aggregated findings to `.claude/archon/reviews/<slug>-review.md`.
4. Then **`/triage-review`** to validate findings empirically and bucket them (must-fix / hygiene /
   defer / push-back).

## Output
The review doc path + verdict. Suggest applying must-fixes, then `commit`.
