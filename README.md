# platformly.io

**The ultimate Kubernetes manager** — multi-cloud cluster management, a CKS-mapped
**Security Command Center**, hands-on training, and AI. A cross-platform desktop app
(macOS / Windows / Linux) built in public, one blog post per day.

> 🛠️ **Status: Phase 0 (foundation)** — monorepo, Tauri desktop shell + app UI, AI dev harness,
> CI, and this marketing site. Roadmap in [`TODO.md`](./TODO.md).

## Stack
- **Desktop:** Tauri 2 + Rust (`apps/desktop/src-tauri`) — the `kube-rs` / cloud / security
  engine lands in later phases.
- **Frontend:** Vite + React 18 + TypeScript (`apps/desktop/src`).
- **Monorepo:** pnpm workspaces (`apps/*`, `packages/*`) + Cargo workspace.

## Prerequisites
- **Node ≥ 20** and **pnpm** (`corepack enable` handles pnpm).
- **Rust (stable)** — required to run/build the desktop app. Install:
  ```sh
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```
- Platform deps for Tauri 2: see https://tauri.app/start/prerequisites/
  (macOS needs Xcode Command Line Tools).

## Run
```sh
make install      # install JS deps
make front        # desktop frontend only, in a browser (no Rust) — http://localhost:1420
make web          # the Next.js marketing site (apps/web) — http://localhost:3000
make dev          # full desktop app (needs Rust + Tauri prerequisites)
```

### App icons
Tauri needs generated icons before `make dev`/`build`. From a 1024×1024 PNG:
```sh
make icons ARG=path/to/source-1024.png   # writes apps/desktop/src-tauri/icons/*
```

## Layout
```
apps/desktop/        Tauri shell (src = React frontend, src-tauri = Rust backend)
apps/web/            Next.js marketing site + build log (neutral brand pre-reveal)
packages/            shared-types, content (CKS curriculum), k8s-types  (later phases)
blog/                feature drafts (gitignored) + templates            (continuous)
docs/                VISION, DESIGN, SECURITY-CKS-MAP, COMPETITIVE-LANDSCAPE
scripts/             worktree harness
```
