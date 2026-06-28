# platformly — dev loop + parallel-worktree harness.
# `make help` lists every callable target.

SHELL := /bin/bash
.DEFAULT_GOAL := help

# Source per-worktree port derivation so every target sees VITE_PORT / WEB_PORT /
# SYNC_API_PORT for the current working directory (main or worktree).
PORTS_LIB := scripts/lib/ports.sh
WITH_PORTS = source $(PORTS_LIB) && derive_ports "$$PWD" &&

# ───────────────────────────────────────────────────────────────── worktrees ──

wt-open: ### Create+provision worktree + open VS Code (NAME=feat-foo required)
	@if [ -z "$(NAME)" ]; then echo "usage: make wt-open NAME=<slug>"; exit 2; fi
	@bash scripts/w.sh "$(NAME)" open

wt-rm: ### Remove worktree dir + branch + free ports (NAME=feat-foo required)
	@if [ -z "$(NAME)" ]; then echo "usage: make wt-rm NAME=<slug>"; exit 2; fi
	@bash scripts/w.sh "$(NAME)" rm

wt-list: ### List every worktree with derived ports + live/idle status
	@bash scripts/wt-list.sh

ports: ### Print derived VITE/WEB/SYNC_API ports for the current dir
	@bash $(PORTS_LIB)

# ─────────────────────────────────────────────────────────────────────── dev ──

dev: ### Run the Tauri desktop app (derives VITE_PORT for the current worktree)
	@$(WITH_PORTS) echo "[dev] VITE_PORT=$$VITE_PORT" && \
	  VITE_PORT=$$VITE_PORT pnpm --filter @platformly/desktop dev

front: ### Desktop frontend only, in a browser — no Rust (derives VITE_PORT)
	@$(WITH_PORTS) echo "[front] VITE_PORT=$$VITE_PORT" && \
	  VITE_PORT=$$VITE_PORT pnpm --filter @platformly/desktop vite:dev

web: ### Run the Next.js marketing site (apps/web)
	@pnpm --filter @platformly/web dev

dev-api: ### Run the sync-api (Bun/Hono) — forward-looking; exists from Phase 5
	@$(WITH_PORTS) if [ -d apps/sync-api ]; then \
	  echo "[dev-api] SYNC_API_PORT=$$SYNC_API_PORT" && \
	  PORT=$$SYNC_API_PORT pnpm --filter @platformly/sync-api dev; \
	else echo "[dev-api] apps/sync-api does not exist yet (Phase 5)"; fi

build-front: ### Typecheck + build the desktop frontend bundle (no Rust required)
	@pnpm --filter @platformly/desktop vite:build

build-web: ### Build the Next.js marketing site
	@pnpm --filter @platformly/web build

icons: ### Generate app icons from a 1024x1024 source PNG (ARG=path/to.png)
	@if [ -z "$(ARG)" ]; then echo "usage: make icons ARG=path/to/source-1024.png"; exit 2; fi
	@pnpm --filter @platformly/desktop exec tauri icon "$(ARG)"

# ─────────────────────────────────────────────────────────────────── quality ──

install: ### Install workspace deps (installs pnpm via corepack if missing)
	@if ! command -v pnpm >/dev/null 2>&1; then corepack enable && corepack prepare pnpm@11.5.2 --activate; fi
	@pnpm install
	@echo "[install] done. Next: 'make dev' (needs Rust — see README)."

typecheck: ### Typecheck all workspace packages
	@pnpm -r --if-present typecheck

check: ### Full gate: cargo check + cargo test + frontend typecheck
	@echo "[check] cargo check…"   && cargo check --manifest-path apps/desktop/src-tauri/Cargo.toml
	@echo "[check] cargo test…"    && cargo test  --manifest-path apps/desktop/src-tauri/Cargo.toml
	@echo "[check] frontend typecheck…" && pnpm -r --if-present typecheck
	@echo "[check] OK"

help: ### Show callable targets
	@awk 'BEGIN {FS = ":.*?### "} /^[a-zA-Z_-]+:.*?### / { printf "  \033[1m%-12s\033[0m  %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@echo ""
	@echo "  Per-worktree ports: see \`make ports\`. Override with VITE_PORT/WEB_PORT/SYNC_API_PORT."

.PHONY: wt-open wt-rm wt-list ports dev front web dev-api build-front build-web icons install typecheck check help
