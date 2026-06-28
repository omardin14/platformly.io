#!/usr/bin/env bash
# scripts/wt-list.sh — list every git worktree with its derived (vite, web,
# sync-api) endpoints as clickable URLs plus a live/idle indicator. Backs `make wt-list`.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/lib/ports.sh
source "$SCRIPT_DIR/lib/ports.sh"

if [ -t 1 ]; then
  GREEN=$'\033[32m'; DIM=$'\033[2m'; BOLD=$'\033[1m'; RESET=$'\033[0m'
else
  GREEN=""; DIM=""; BOLD=""; RESET=""
fi

port_state() {
  if command -v lsof >/dev/null 2>&1 && lsof -ti "tcp:$1" >/dev/null 2>&1; then
    printf "live"
  else
    printf "idle"
  fi
}

fmt_endpoint() {
  local port="$1" state="$2" color="$DIM"
  [ "$state" = "live" ] && color="$GREEN"
  printf "%s%-23s %s%s" "$color" "http://localhost:$port" "$state" "$RESET"
}

printf "%s%-14s  %-28s  %-28s  %-28s  %s%s\n" \
  "$BOLD" "BRANCH" "VITE (desktop)" "WEB (next)" "SYNC-API" "PATH" "$RESET"
printf "%s%-14s  %-28s  %-28s  %-28s  %s%s\n" \
  "$DIM" "------" "--------------" "----------" "--------" "----" "$RESET"

git worktree list --porcelain | awk '
  /^worktree /  { wt=$2 }
  /^branch /    { print wt "\t" $2 }
  /^detached$/  { print wt "\t(detached)" }
' | while IFS=$'\t' read -r wt branch; do
  unset VITE_PORT WEB_PORT SYNC_API_PORT WT_NAME
  derive_ports "$wt" >/dev/null || { VITE_PORT="?"; WEB_PORT="?"; SYNC_API_PORT="?"; }
  v_state="$(port_state "$VITE_PORT")"
  w_state="$(port_state "$WEB_PORT")"
  s_state="$(port_state "$SYNC_API_PORT")"
  short_branch="${branch#refs/heads/}"
  v_cell="$(fmt_endpoint "$VITE_PORT" "$v_state")"
  w_cell="$(fmt_endpoint "$WEB_PORT" "$w_state")"
  s_cell="$(fmt_endpoint "$SYNC_API_PORT" "$s_state")"
  printf "%-14s  %s  %s  %s  %s\n" "$short_branch" "$v_cell" "$w_cell" "$s_cell" "$wt"
done

if [ -t 1 ]; then
  printf "\n%s  cmd-click any URL to open it; paths are clickable too in most terminals.%s\n" \
    "$DIM" "$RESET"
fi
