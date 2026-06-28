#!/usr/bin/env bash
# scripts/worktree-teardown.sh — best-effort cleanup before a worktree is removed.
# Frees any dev server still bound to this worktree's derived ports. Always
# non-fatal — `scripts/w.sh rm` proceeds regardless.
#
# Usage: scripts/worktree-teardown.sh <worktree_path>

set -uo pipefail

WT_DIR="${1:-}"
[ -n "$WT_DIR" ] && [ -d "$WT_DIR" ] || exit 0
WT_DIR="$(cd "$WT_DIR" && pwd)"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/lib/ports.sh
source "$SCRIPT_DIR/lib/ports.sh"

unset VITE_PORT WEB_PORT SYNC_API_PORT
derive_ports "$WT_DIR" || exit 0

for port in "$VITE_PORT" "$WEB_PORT" "$SYNC_API_PORT"; do
  pids="$(lsof -ti tcp:"$port" 2>/dev/null || true)"
  if [ -n "$pids" ]; then
    echo "[worktree-teardown] freeing port $port (pids: $pids)"
    # shellcheck disable=SC2086
    kill $pids 2>/dev/null || true
  fi
done

echo "[worktree-teardown] $WT_NAME: kill attempted on ports $VITE_PORT/$WEB_PORT/$SYNC_API_PORT"
