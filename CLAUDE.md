# CLAUDE.md

Conventions for working in the platformly monorepo. Read this before editing.

## What this is
A cross-platform **desktop** Kubernetes manager (Tauri 2 + Rust). Three pillars: multi-cloud
cluster management, a CKS-mapped Security Command Center, and CKS training — plus an AI layer.
Roadmap in `TODO.md`. Built in public with an **unnamed feature-first blog** (see "Content").

## Stack
- **Desktop:** Tauri 2 + Rust (`apps/desktop/src-tauri`) — the Kubernetes engine (`kube-rs`),
  cloud auth, and security scanners run natively in Rust. `ts-rs` generates TS types from Rust.
- **Frontend:** Vite + React 18 + TypeScript (`apps/desktop/src`).
- **sync-api** *(future, Phase 5–6):* Bun + Hono — auth (Clerk), licensing (Stripe), cloud sync,
  AI proxy (Anthropic, BYOK). Does not exist yet.
- **web** *(future):* Next.js landing + blog.
- **Monorepo:** pnpm workspaces (`apps/*`, `packages/*`) + Cargo workspace.

## Run
```sh
make install      # JS deps (pnpm via corepack if missing)
make front        # desktop frontend only, in a browser — no Rust (http://localhost:$VITE_PORT)
make web          # the Next.js marketing site (apps/web)
make dev          # full Tauri desktop app (needs Rust + Tauri prerequisites)
make build-front  # typecheck + build the desktop frontend bundle
make check        # full gate: cargo check + cargo test + pnpm typecheck   (run before commits)
```
Rust is required for the desktop app. Tauri prerequisites: https://tauri.app/start/prerequisites/

## Worktree workflow (parallel agent sessions)
```sh
make wt-open NAME=feat-foo   # create .claude/worktrees/feat-foo + provision + open
make wt-list                 # every worktree with derived ports + live/idle
make wt-rm NAME=feat-foo      # remove worktree + branch + free ports
make ports                   # print this dir's derived port triple
```
Ports are **deterministic per worktree** (`scripts/lib/ports.sh`, md5(path)%100):
- main → desktop **1420** / web 3000 / sync-api 8787 (1420 matches `tauri.conf.json` devUrl)
- worktree → 1500+slot / 3100+slot / 8800+slot. Override with `VITE_PORT=…`.

## Where things live
- `apps/desktop/src-tauri/src/` — Rust backend. `lib.rs` registers commands via
  `tauri::generate_handler!`; future modules: `kube/ cloud/ security/ pty/ commands/`.
- `apps/desktop/src/` — React frontend; `App.tsx` calls Rust over `invoke()`.
- `packages/shared-types/` *(future)* — the source of truth for cross-boundary types (ts-rs + hand).
- `blog/` — gitignored feature drafts (`NNN-<slug>.md` + `.linkedin.md`) + `templates/` + `CALENDAR.md`.
- `docs/` — VISION, DESIGN, SECURITY-CKS-MAP, MVP, COMPETITIVE-LANDSCAPE.

## IPC contract rules (the Rust↔TS boundary)
- Every `#[tauri::command]` must be registered in `generate_handler![]` **and** match its
  `invoke<T>('command_name', args)` call site by name, arg shape (camelCase JS → snake_case Rust),
  and return type (`Result<T,E>` ↔ `Promise<T>`). Drift is invisible to `tsc`/`cargo check` — the
  `tauri-ipc-checker` agent exists to catch it.
- New cross-boundary types live in `packages/shared-types` (once it exists), generated via `ts-rs`.
- Never loosen CSP in `tauri.conf.json` without calling it out. Never put secrets in `VITE_*` vars.

## Error handling (Rust + TS)
- No swallowed errors. In Rust: avoid `unwrap()`/`expect()`/`panic!` outside tests and `main` setup;
  propagate with `?` and log context (`tracing`). In TS: no empty `catch {}`; surface actionable errors.
- **Destructive Kubernetes operations** (delete, apply, scale-to-zero, cordon/drain) must go through a
  confirmation and prefer a server-side **dry-run** preview first. The `rust-safety-auditor` enforces this.

## Review workflow (separate implementer from reviewer)
The session that wrote the code should not review it. After implementing on a branch:
1. `/clear` then `/review-pr` — fresh-context parallel fan-out of the `.claude/agents/`.
2. `/cross-review` — layer Codex (GPT) on security-critical PRs (different model, different blind spots).
3. `/triage-review` — validate findings empirically → must-fix / hygiene / defer / push-back.
4. `make check` green → merge.

## Commits & PRs
- Branch off `main`; never commit straight to `main`. Conventional messages (`feat:`, `fix:`, `chore:`).
- **AI attribution is REQUIRED here.** End every commit message with:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
  End every PR body with: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`
  (This overrides the upstream archon-dev "no attribution" default.)
- Only commit/push when asked.

## Content (build-in-public)
The blog is **feature-first with a delayed reveal**: posts showcase one feature of an **unnamed**
tool until the 1.0 launch reveal. Pre-reveal, **never** write the product name in a post and crop it
from demos. The `blog-writer` agent + `/blog-draft` rotate `blog/templates/*` and update `blog/CALENDAR.md`.

## Non-obvious
- `blog/` is gitignored (drafts stay local); `docs/` is tracked.
- `apps/sync-api` and `apps/web` don't exist yet — the `sync-api-contract-checker` agent and the
  `dev-api`/web worktree wiring are inert until those land (Phase 5–6).
- The frontend builds without Rust (`make web` / `make build-web`); the desktop window needs Rust.
