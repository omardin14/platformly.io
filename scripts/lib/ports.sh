#!/usr/bin/env bash
# scripts/lib/ports.sh — deterministic, collision-free port triple per worktree.
#
# Pure shell, no Node dependency. md5(worktree path) % 100 picks a slot in three
# disjoint ranges so main + every worktree get unique ports.
#
# Rules:
#   - Main checkout       -> VITE_PORT=1420 WEB_PORT=3000 SYNC_API_PORT=8787
#       (1420 matches apps/desktop/src-tauri/tauri.conf.json devUrl; main works verbatim.)
#   - Any linked worktree -> VITE_PORT=1500+slot WEB_PORT=3100+slot SYNC_API_PORT=8800+slot
#       slot = md5(absolute worktree path) % 100. Ranges are pairwise disjoint.
#   - $VITE_PORT / $WEB_PORT / $SYNC_API_PORT in the environment override everything.
#       (web + sync-api are forward-looking; only the desktop app exists today.)
#
# Usage:
#   source scripts/lib/ports.sh && derive_ports [path]   # sets+exports VITE_PORT/WEB_PORT/SYNC_API_PORT/WT_NAME
#   bash scripts/lib/ports.sh [path]                      # prints "vite=<p> web=<p> sync_api=<p>"

set -euo pipefail

VITE_BASE_MAIN=1420
WEB_BASE_MAIN=3000
SYNC_API_BASE_MAIN=8787

VITE_BASE_WT=1500
WEB_BASE_WT=3100
SYNC_API_BASE_WT=8800

WT_RANGE=100

# md5 of a string -> first 8 hex chars (portable: macOS `md5`, Linux `md5sum`).
_ports_md5_hex8() {
  local s="$1"
  if command -v md5 >/dev/null 2>&1; then
    md5 -q -s "$s" | cut -c1-8
  else
    printf '%s' "$s" | md5sum | cut -c1-8
  fi
}

derive_ports() {
  local start_path="${1:-$PWD}"

  local top
  top="$(git -C "$start_path" rev-parse --show-toplevel 2>/dev/null || (cd "$start_path" && pwd))"

  # First entry of `git worktree list --porcelain` is always the MAIN worktree.
  local main_root
  main_root="$(git -C "$top" worktree list --porcelain 2>/dev/null \
                | awk '/^worktree /{print $2; exit}')"
  main_root="${main_root:-$top}"

  WT_NAME="$(basename "$top")"

  if [ "$top" = "$main_root" ]; then
    VITE_PORT="${VITE_PORT:-$VITE_BASE_MAIN}"
    WEB_PORT="${WEB_PORT:-$WEB_BASE_MAIN}"
    SYNC_API_PORT="${SYNC_API_PORT:-$SYNC_API_BASE_MAIN}"
  else
    local slot
    slot=$(( 0x$(_ports_md5_hex8 "$top") % WT_RANGE ))
    VITE_PORT="${VITE_PORT:-$(( VITE_BASE_WT + slot ))}"
    WEB_PORT="${WEB_PORT:-$(( WEB_BASE_WT + slot ))}"
    SYNC_API_PORT="${SYNC_API_PORT:-$(( SYNC_API_BASE_WT + slot ))}"
  fi

  export VITE_PORT WEB_PORT SYNC_API_PORT WT_NAME
}

# Direct invocation: print the derived ports.
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
  derive_ports "${1:-$PWD}"
  echo "vite=${VITE_PORT} web=${WEB_PORT} sync_api=${SYNC_API_PORT} worktree=${WT_NAME}"
fi
