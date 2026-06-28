# Cookbook: PR — open a pull request

**Goal:** a reviewable PR with clear intent.

## Steps
1. Push the feature branch. Confirm it's not `main`.
2. `gh pr create` with:
   - **Title** — conventional, one line.
   - **Body** — Intent (one sentence) · What changed · How to verify (commands, e.g. against a kind
     cluster) · Risks · linked issue (`Closes #N`).
3. **REQUIRED footer** in the PR body (this repo mandates it):
   ```
   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   ```
4. Only open a PR when the user asked.

## Output
The PR URL. Suggest `/clear` then `/review-pr` (fresh context), then `/cross-review` if security-critical.
