#!/usr/bin/env bash
# w <name> [open|rm] — full git-worktree lifecycle for parallel Claude sessions.
# Worktrees live under .claude/worktrees/<name> (Claude Code's native -w
# convention) so `claude -w <name>` and this script resolve the same path.
#
#   bash scripts/w.sh feat-foo          -> create .claude/worktrees/feat-foo + provision
#   bash scripts/w.sh feat-foo open     -> create (if needed) + open VS Code (claude auto-launches)
#   bash scripts/w.sh feat-foo rm       -> remove worktree dir + branch + free ports

set -euo pipefail

NAME="${1:?usage: w <name> [open|rm]}"
ACTION="${2:-create}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
# Always operate against the MAIN worktree, even if invoked from inside one.
ROOT="$(git -C "$ROOT" worktree list --porcelain | awk '/^worktree /{print $2; exit}')"
TARGET="$ROOT/.claude/worktrees/$NAME"

if [ "$ACTION" = "rm" ]; then
  bash "$ROOT/scripts/worktree-teardown.sh" "$TARGET" || true
  # Don't swallow a real failure silently — warn, then fall back to forced cleanup.
  if git -C "$ROOT" worktree remove --force "$TARGET"; then
    removed=1
  else
    removed=0
    [ -e "$TARGET" ] && echo "[w] warning: 'git worktree remove' failed for $TARGET — forcing cleanup" >&2
  fi
  rm -rf "$TARGET"
  git -C "$ROOT" worktree prune
  git -C "$ROOT" branch -D "$NAME" 2>/dev/null || true
  if [ "$removed" = 1 ]; then
    echo "[w] removed worktree '$NAME' (dir + branch + ports freed)"
  else
    echo "[w] force-cleaned worktree '$NAME' ('git worktree remove' had failed — see warning above)"
  fi
  exit 0
fi

if [ ! -d "$TARGET" ]; then
  mkdir -p "$ROOT/.claude/worktrees"
  # New branch by default; reuse the branch if it already exists.
  if git -C "$ROOT" show-ref --verify --quiet "refs/heads/$NAME"; then
    git -C "$ROOT" worktree add "$TARGET" "$NAME"
  else
    git -C "$ROOT" worktree add "$TARGET" -b "$NAME"
  fi

  bash "$ROOT/scripts/worktree-setup.sh" "$TARGET"

  echo "[w] installing workspace deps (pnpm install)…"
  ( cd "$TARGET" && pnpm install --prefer-offline )
fi

echo "[w] worktree ready: $TARGET"
echo "[w] start it with:  cd '$TARGET' && make dev"

if [ "$ACTION" = "open" ]; then
  if command -v code >/dev/null 2>&1; then
    code "$TARGET"
    echo "[w] opened VS Code window for $NAME (claude auto-launches via .vscode/tasks.json)"
  else
    echo "[w] 'code' CLI not found — open manually or run: cd '$TARGET' && claude"
  fi
fi
