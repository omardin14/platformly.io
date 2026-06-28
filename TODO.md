# platformly.io — Build Roadmap & TODO

> **The ultimate Kubernetes manager** — multi-cloud cluster management + a CKS-mapped
> Security Command Center + hands-on training + AI. Cross-platform desktop app
> (macOS / Windows / Linux), built in public with a feature-first, delayed-reveal blog.

**Stack:** Tauri 2 + Rust (`kube-rs`) desktop · Bun/Hono `sync-api` (auth/license/sync/AI proxy) ·
Next.js `web` (landing + blog) · pnpm + Cargo monorepo.

---

## How to read this file

Organized by **phase** (`P0`–`P6` + Post-1.0), not by calendar days. Each task has a stable **ID** so
dependencies can reference it.

- **Status:** `[ ]` todo · `[~]` partial · `[x]` done. **Criticality:** 🔴 critical · 🟠 high · 🟡 medium.
- **Task IDs:** `P<phase><track-letter?>-<n>` — e.g. `P1-2`, `P3b-1`. Stable handles for `deps:`.
- **`deps:`** = prerequisite IDs/phases that must land first. No `deps:` → ready once the phase is unblocked.
- **Tracks:** within a phase, each lettered **track** is independent and meant for its **own worktree**;
  tracks in the same phase run **‖ in parallel**. Sequential steps inside a track use `deps:`.
- **`[port: …]`** = port validated Rust logic from an existing `../k8s/` tool (translate, don't redesign).
- The **content/blog** track and the per-task **review workflow** are *continuous* — they run parallel to
  every phase (see "Continuous tracks" at the bottom).

---

## Dependency & parallelism map

**Critical path:** `P0 → P1 → { P2 ‖ P3 } → { P4 , P5 } → P6`

```
P0 Foundation ─┬─ P0-6 design shell ─────────────┐ (soft dep for all UI)
               └─ P1 Connectivity ──┬─ P2 Resources ──────────────┐
                                    ├─ P3 Security (3a‖3b‖3c‖3d) ──┼─ P4 Training ─┐
                                    └─ P5-1 AI infra (early) ──────┴─ P5 AI ───────┴─ P6 Release → 1.0 + REVEAL
```

- **Start anytime (no kube deps):** `P0-5` CI · `P0-6` design system · `P0-7` web · the **content track**.
- **Unblocked once P1 lands:** `P2` (resources) **‖** `P3a` (security base).
- **Big fan-out:** `P3b ‖ P3c ‖ P3d` are mutually independent → up to **3 simultaneous worktrees**.
  `P5-1` (AI provider infra) is also independent — start it early once P1 exists.
- **Late / gated:** `P4` needs `P3` · `P5` features need `P1–P3` · `P6` needs everything.

### Spin up now (parallel worktrees you can open today)
| Track | Suggested worktree | Blocked by |
|---|---|---|
| `P0-6` design system + app shell | `feat/app-shell` | nothing (PR-ready) |
| `P0-5` CI workflows | `chore/ci` | nothing |
| `P0-7` web landing + blog | `feat/web-landing` | nothing |
| `P1-1` kube-rs client (the spine) | `feat/kube-core` | nothing |

> Everything in P2–P5 is gated on `P1-1`/`P1-2` (the kube client). Land that first; then the fan-out opens up.

---

## Reuse map — existing `../k8s/` projects → platformly (port to Rust)

| `../k8s/` project | Ported into | CKS domain |
|---|---|---|
| `k8s-kube-bench-slack` | CIS scan (`P3a-4`) | Cluster Setup/Hardening |
| `k8s-auth-report-slack` | RBAC explorer (`P3a-5`) | Cluster Hardening |
| `k8s-kubelet-check-slack` | Kubelet hardening audit (`P3a-8`) | System Hardening |
| `k8s-certs-manager-slack` | Certificate lifecycle (`P3a-6`) | Cluster Setup |
| `k8s-version-manager-slack` | Version skew (`P1-6`) + binary SHA256 integrity (`P3c-5`) | Supply Chain |
| `k8s-oncall-manager-slack` | **Post-1.0** Operations module | Ops (non-CKS) |
| `k8s-dashboard-manager-teleport` | **Post-1.0** Access module | Access (non-CKS) |

**Harvested verbatim (no port):** per-finding AI prompts (`*/utils/ai_analyzer.py`), HTML report
templates (`*/utils/html_report.py`), risk rubrics (`*/analyzer.py`), Helm/RBAC least-privilege manifests.

---

## Phase 0 — Foundation & Harness
> Goal: runnable Tauri shell, the dev harness, the blog pipeline, and the app-shell UI.
> `deps: none`. All P0 tasks are independent of the kube work — any can be a parallel worktree.

- [x] **P0-1** 🔴 Monorepo (pnpm + Cargo); Tauri 2 app boots; Rust↔TS IPC bridge proven. *(PR #1)*
- [x] **P0-2** 🔴 Worktree harness: `scripts/w.sh`, `scripts/lib/ports.sh`, Makefile (`wt-open`/`wt-rm`/`wt-list`). *(PR #1)*
- [x] **P0-3** 🔴 `.claude/` agents + `/review-pr` `/cross-review` `/triage-review` + `archon-dev` skill + `.archon/` workflows. *(PR #1)*
- [x] **P0-4** 🔴 Blog agent (`blog-writer` + `/blog-draft`) + `blog/templates/*` + `CALENDAR.md`. *(PR #1; seed post 001 drafted)*
- [x] **P0-5** 🟠 CI: build matrix (mac/win/linux), lint, typecheck; `.github/ISSUE_TEMPLATE/ai-ready.md`. *(`.github/workflows/ci.yml`: fmt + clippy + cargo test + frontend build across all 3 OSes)*
- [x] **P0-6** 🔴 Dark token design system + app-shell layout (sidebar, command bar, panels). *(token system in `src/styles/`; AppShell + Sidebar/TopBar/StatusBar/CommandPalette/EmptyState; ⌘K palette)*
- [x] **P0-7** 🟠 `apps/web` Next.js landing + `/blog` route under a **neutral series brand** (no product name pre-reveal). *(landing + build-log index; `make web`; deploy is a manual step)*

## Phase 1 — Core Cluster Connectivity
> Goal: connect to **any** cluster (any cloud, any node type) and see a live overview. **`deps: P0-1`.**
> The kube client is the spine the whole app builds on — land Track 1A first, then 1B/1C fan out.

**Track 1A — kube core** (worktree `feat/kube-core`)
- [ ] **P1-1** 🔴 `kube-rs` integration; parse `~/.kube/config`; list contexts.
- [ ] **P1-2** 🔴 Context switching + multi-cluster session state. `deps: P1-1`
- [ ] **P1-3** 🔴 Connection Manager UI (add/test/remove/health). `deps: P1-2` (UI needs `P0-6`)

**Track 1B — cloud auth** (worktree `feat/cloud-auth`, parallel after `P1-1`) — `deps: P1-1`
- [ ] **P1-4** 🟠 Cloud auth exec plugins: GKE (`gke-gcloud-auth-plugin`), EKS (`aws eks get-token`), AKS (`kubelogin`).
- [ ] **P1-5** 🟠 Cluster-type detection: GKE Standard/**Autopilot**, EKS **EC2/Fargate/Auto Mode**, AKS, k3s/kind. `deps: P1-4`

**Track 1C — read-only views** (worktree `feat/cluster-overview`, parallel after `P1-1`/`P1-2`)
- [ ] **P1-6** 🟠 Version-skew detection `[port: version-manager]` — current vs latest stable. `deps: P1-1`
- [ ] **P1-7** 🟠 Cluster Overview dashboard + Reactflow topology. `deps: P1-2`
- [ ] **P1-8** 🟡 ts-rs contract hardening; `tauri-ipc-checker` green on the kube bridge. `deps: P1-2`

## Phase 2 — Resource Management Core ("Lens/Headlamp parity")
> Goal: the baseline every k8s IDE must nail, done well. **`deps: P1-1, P1-2`.** Runs **‖ with P3a**.
> Four internal tracks, parallelizable across worktrees.

**Track 2A — explorer/watch**
- [ ] **P2-1** 🔴 Generic resource explorer (built-in kinds) + virtualized tables.
- [ ] **P2-2** 🔴 CRD discovery via the discovery API.
- [ ] **P2-3** 🔴 Live **watch** streams (informers) → reactive UI. `deps: P2-1`

**Track 2B — detail / edit**
- [ ] **P2-4** 🟠 Resource detail (describe), events, owner refs, relations graph.
- [ ] **P2-5** 🔴 YAML editor with server-side **dry-run**.
- [ ] **P2-6** 🔴 Apply with **diff** + create-from-template. `deps: P2-5`

**Track 2C — logs / exec / forward**
- [ ] **P2-7** 🔴 Logs (multi-container, follow, search, since/grep).
- [ ] **P2-8** 🔴 Exec terminal (PTY bridge from learnthing).
- [ ] **P2-9** 🟠 Port-forward manager.

**Track 2D — actions / views**
- [ ] **P2-10** 🟠 Scale / rollout / restart / **delete** — guarded (confirmation; dry-run where possible).
- [ ] **P2-11** 🟠 Workloads + Networking (incl. Gateway API) + Config + Storage views.
- [ ] **P2-12** 🟡 Command palette + saved views + multi-cluster search.

## Phase 3 — Security Command Center — **the differentiator, mapped to CKS**
> Goal: a Security workspace where each panel = a CKS exam domain. **`deps: P1`** (3a also reuses P2's
> resource layer). Runs as **four ‖ tracks** — ideal for 3+ simultaneous worktrees + `/review-pr` per PR.

**Track 3a — Cluster + System Hardening** (worktree `feat/sec-hardening`) — `deps: P1`
- [ ] **P3a-1** 🔴 Security workspace shell + Security Score scaffolding. *(needs `P0-6`)*
- [ ] **P3a-2** 🔴 NetworkPolicy visualizer (Reactflow graph).
- [ ] **P3a-3** 🔴 NetworkPolicy editor + "what can reach this pod?". `deps: P3a-2`
- [ ] **P3a-4** 🔴 CIS Benchmark scan `[port: kube-bench]` — run + parse + remediation tracking.
- [ ] **P3a-5** 🔴 RBAC explorer `[port: auth-report]` — who-can-do-what + `can-i` + risk scoring.
- [ ] **P3a-6** 🟠 Certificate lifecycle `[port: certs-manager]` — expiry/issuer/SAN + alerts.
- [ ] **P3a-7** 🟠 API-server access review (anon-auth, insecure ports, admission plugins) + ingress TLS.
- [ ] **P3a-8** 🔴 Kubelet hardening audit `[port: kubelet-check]` — anon-auth, authz mode, readonly 10255, /metrics, CVE.
- [ ] **P3a-9** 🟡 Node OS footprint + seccomp/AppArmor presence checks.

**Track 3b — Minimize Microservice Vulnerabilities** (worktree `feat/sec-microservice`) — `deps: P1`
- [ ] **P3b-1** 🔴 Pod Security Standards / admission audit.
- [ ] **P3b-2** 🔴 SecurityContext analyzer + one-click hardening.
- [ ] **P3b-3** 🔴 Kyverno policy management (browse/author/test).
- [ ] **P3b-4** 🔴 OPA/Gatekeeper policy management.
- [ ] **P3b-5** 🟠 Policy violation dashboard.
- [ ] **P3b-6** 🟠 Secrets handling review + sandboxing detection (gVisor/Kata).

**Track 3c — Supply Chain Security** (worktree `feat/sec-supplychain`) — `deps: P1`
- [ ] **P3c-1** 🔴 Trivy image scanning (per-workload CVE).
- [ ] **P3c-2** 🟠 Severity rollups + fix-version hints.
- [ ] **P3c-3** 🔴 cosign/sigstore signature verification.
- [ ] **P3c-4** 🟠 Unsigned-image flagging + require-signature policy. `deps: P3c-3`
- [ ] **P3c-5** 🔴 Platform binary integrity `[port: version-manager]` — pod-exec extract + SHA256 vs `dl.k8s.io`.
- [ ] **P3c-6** 🟠 SBOM viewer.
- [ ] **P3c-7** 🟡 kubesec + checkov static manifest analysis.

**Track 3d — Monitoring, Logging & Runtime Security** (worktree `feat/sec-runtime`) — `deps: P1`
- [ ] **P3d-1** 🔴 Falco integration (deploy/detect).
- [ ] **P3d-2** 🟠 Runtime threat event stream + dashboard. `deps: P3d-1`
- [ ] **P3d-3** 🟠 Audit log viewer.
- [ ] **P3d-4** 🟠 Audit log analyzer (suspicious-verb detection). `deps: P3d-3`
- [ ] **P3d-5** 🟡 Immutability & drift checks.

**Join**
- [ ] **P3-SCORE** 🟡 Per-cluster **Security Score** rollup aggregating 3a–3d. `deps: P3a, P3b, P3c, P3d` *(the one cross-track join)*

## Phase 4 — Training & Upskilling: CKS Practice
> Goal: turn the Security Command Center into a learning surface (learnthing model). **`deps: P3`** (+ `P1` local clusters).

**Track 4A — content** (low dep — authoring can start early; parallelizable per CKS domain)
- [ ] **P4-1** 🔴 Content schema + Ajv loader + linter (port `learnthing/packages/content`).
- [ ] **P4-2** 🟠 CKS curriculum (Paths→Modules→Steps→Quiz), all 6 domains. `deps: P4-1`

**Track 4B — lab engine** — `deps: P1`
- [ ] **P4-3** 🔴 Embedded local labs — spin up **kind/k3s** via PTY (reset/teardown).
- [ ] **P4-4** 🔴 Step validation engine — `end_state` JSONPath + `output_match` regex. `deps: P4-3`
- [ ] **P4-5** 🟠 Lesson renderer (MDX + Mermaid/Reactflow + code blocks).

**Track 4C — engagement**
- [ ] **P4-6** 🟠 AI tutor scoped to lesson + terminal output. *(soft dep `P5-1`)*
- [ ] **P4-7** 🟠 Module quizzes + AI grading.
- [ ] **P4-8** 🟠 Gamification — XP, levels, streaks, achievements.
- [ ] **P4-9** 🔴 CKS Exam Simulator — timed scenarios graded against a live cluster. `deps: P4-4`
- [ ] **P4-10** 🟡 Onboarding (skill/goal) + progress sync via `sync-api`.

## Phase 5 — AI Features
> Goal: planning-platform-grade AI, k8s-focused. **`deps: P1–P3`** (feature tracks need `5A`).

**Track 5A — AI infra** (worktree `feat/ai-provider`, **start early after P1**)
- [ ] **P5-1** 🔴 AI provider layer (Rust + sync-api proxy): role-based routing + **BYOK** `[port: ai_provider]`.
- [ ] **P5-2** 🟠 Failover chains + spend tracking. `deps: P5-1`

**Track 5B — assistant** — `deps: P5-1, P1, P2`
- [ ] **P5-3** 🔴 Cluster-scoped AI assistant — RAG over live cluster state.
- [ ] **P5-4** 🟠 Chat grounded in selected resources/namespaces. `deps: P5-3`

**Track 5C — copilot** — `deps: P5-1`
- [ ] **P5-5** 🔴 kubectl Copilot — natural language → kubectl/manifest.
- [ ] **P5-6** 🔴 Copilot **dry-run preview** before apply. `deps: P5-5`

**Track 5D — agents** — `deps: P5-1`
- [ ] **P5-7** 🔴 Failure RCA agent — events/logs/probes/resources diagnosis.
- [ ] **P5-8** 🟠 RCA multi-step reasoning + fix suggestions. `deps: P5-7`
- [ ] **P5-9** 🟠 Manifest generator.
- [ ] **P5-10** 🟠 Security remediation agent (Phase-3 findings → PR-ready patches; reuse harvested prompts). `deps: P3`
- [ ] **P5-11** 🟠 Multi-stage cluster audit agent (fan-out across CKS domains → ranked report). `deps: P3`
- [ ] **P5-12** 🟡 Input/output guardrails (injection checks, destructive-action confirmation).

## Phase 6 — Polish, Cross-Platform Release & Launch
> Goal: signed, auto-updating 1.0 across all three OSes. **`deps: ALL`.** Mostly sequential; signing tasks run ‖.

- [ ] **P6-1** 🔴 Release CI — macOS sign + notarize. *(‖ with P6-2/P6-3)*
- [ ] **P6-2** 🔴 Windows signing + installer. *(‖)*
- [ ] **P6-3** 🔴 Linux AppImage + **Tauri auto-updater** manifest. *(‖)*
- [ ] **P6-4** 🔴 E2E (Playwright + `tauri-driver`) — connectivity + resource ops.
- [ ] **P6-5** 🟠 E2E — a security scan + one lab, across mac/win/linux. `deps: P6-4`
- [ ] **P6-6** 🟠 Performance pass (virtualization, watch backpressure) + error/empty states + a11y.
- [ ] **P6-7** 🟠 Licensing/pricing via Stripe + free/pro gating (labs/AI metered).
- [ ] **P6-8** 🟠 Docs site + in-app onboarding + security/privacy statement (BYOK, local-first).
- [ ] **P6-9** 🔴 **Public 1.0 launch + THE REVEAL** — *"I've shown you ~100 Kubernetes features. They were all one app."* `deps: P6-1..P6-8`

---

## Post-1.0 — Deferred modules (from non-CKS `../k8s/` projects)
> Out of the v1 scope to keep the security-first launch clean.

- [ ] **POST-1** Operations module — on-call schedule validation, gap/overlap detection, coverage dashboard `[port: oncall-manager]`.
- [ ] **POST-2** Access module — Teleport-gated, role-scoped access to in-cluster dashboards `[adopt: dashboard-manager-teleport]`.

---

## Continuous tracks (run parallel to ALL phases)
- **Content / blog:** one **unnamed** feature post/day via `/blog-draft` (rotating formats), building to the
  1.0 **reveal**. Decoupled from build phases — see the design doc's "Content strategy" + `blog/CALENDAR.md`.
- **Dev workflow (every task):** `make wt-open NAME=<track>` → implement → `/clear` → `/review-pr`
  (+ `/cross-review` on security PRs) → `/triage-review` → `make check` green → merge.

## Verification by phase
- **P0:** `make wt-open NAME=test` provisions a worktree; `make dev` boots the shell; `/blog-draft` emits an **unnamed** post.
- **P1:** connect to a real kind cluster **and** one cloud cluster; context switch works; cluster-type badge correct (Fargate vs Auto Mode).
- **P2:** create/edit/apply a Deployment via the YAML editor (dry-run diff shown), stream logs, exec, port-forward — against kind.
- **P3:** against a deliberately-insecure kind cluster, the ported scanners reproduce the original tools' findings (CIS, RBAC over-priv, kubelet, expiring cert, binary-hash mismatch) + Trivy CVE + cosign unsigned + Kyverno violation; Security Score aggregates.
- **P4:** complete one CKS lab module end-to-end; step validation passes against the lab cluster; quiz + XP recorded.
- **P5:** AI assistant RCAs a CrashLooping pod and generates a remediation patch from a P3 finding; dry-run preview before apply.
- **P6:** CI produces signed mac/win/linux artifacts + updater manifest; Playwright E2E green on all three OSes; Stripe upgrade works; 1.0 tag published.
- **Throughout:** every PR passes `/review-pr` (+ `/cross-review` on security PRs); `make check` green before merge.
