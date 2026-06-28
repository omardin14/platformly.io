# Cookbook: COMMIT

**Goal:** a clean, conventional commit that explains *why*.

## Steps
1. `git status` + `git diff` — confirm what's staged is intentional and scoped. Never commit secrets
   (`.env`), and never commit `blog/` (gitignored).
2. Ensure you're on a feature branch, not `main`. Branch first if needed.
3. Run `make check` — commit only green code (unless the user explicitly accepts a WIP commit).
4. Write a conventional message: `type(scope): summary` (feat/fix/chore/docs/refactor/test). Body
   explains the *why*, not the *what*.
5. **REQUIRED footer** (this repo mandates AI attribution — overrides upstream archon-dev):
   ```
   Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
   ```
6. Only commit when the user asked. Show the message for confirmation on anything non-trivial.

## Output
The commit hash + message. Suggest `pr` next.
