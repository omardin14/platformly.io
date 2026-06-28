# platformly.io — Build Roadmap & TODO

> **The ultimate Kubernetes manager** — multi-cloud cluster management + a CKS-mapped
> Security Command Center + hands-on training + AI. Cross-platform desktop app
> (macOS / Windows / Linux), built in public with **one blog post per day**.

**Full plan:** see the approved design doc for architecture, tech-stack, and reuse rationale.
**Stack:** Tauri 2 + Rust (`kube-rs`) desktop · Bun/Hono `sync-api` (auth/license/sync/AI proxy) ·
Next.js `web` (landing + blog) · pnpm + Cargo monorepo.

---

## How to read this file

- **~110 days, 1 deliverable + 1 post per day.** Each build day = one significant, demoable
  increment (the **daily cadence rule** — no filler days).
- **Content = feature-first reveal:** each post showcases one feature of an **unnamed** tool in
  mixed formats (problem→solution · tutorial · showcase), building to a **brand reveal at 1.0
  launch**. Blog agent emits `blog/NNN-<slug>.md` + `.linkedin.md` (both unnamed pre-reveal).
  See the design doc's "Content strategy" + `blog/CALENDAR.md` + `docs/COMPETITIVE-LANDSCAPE.md`.
- Criticality: 🔴 critical · 🟠 high · 🟡 medium.
- Tag `[port: <project>]` means logic is ported to Rust from an existing `../k8s/` Python tool
  (spec already validated — translate, don't redesign).

### Daily build-in-public workflow (every day)
1. `make wt-open NAME=<feature>` → isolated worktree + ports.
2. Implement the day's item.
3. `/clear` → `/review-pr` (fresh-context fan-out); `/cross-review` (Codex) on security PRs.
4. `/triage-review` → fix must-fixes → `make check` green → merge.
5. `/blog-draft` → rotating format → emit `blog/NNN-<slug>.md` + `.linkedin.md` (unnamed pre-reveal) → publish Medium + post LinkedIn.

---

## Reuse map — existing `../k8s/` projects → platformly (port to Rust)

| `../k8s/` project | Ported into | CKS domain |
|---|---|---|
| `k8s-kube-bench-slack` | CIS scan (Day 42–43) | Cluster Setup/Hardening |
| `k8s-auth-report-slack` | RBAC explorer (Day 44–45) | Cluster Hardening |
| `k8s-kubelet-check-slack` | Kubelet hardening audit (Day 48) | System Hardening |
| `k8s-certs-manager-slack` | Certificate lifecycle (Day 46) | Cluster Setup |
| `k8s-version-manager-slack` | Version skew (Day 16–17) + binary SHA256 integrity (Day 61) | Supply Chain |
| `k8s-oncall-manager-slack` | **Post-1.0** Operations module | Ops (non-CKS) |
| `k8s-dashboard-manager-teleport` | **Post-1.0** Access module | Access (non-CKS) |

**Harvested verbatim (no port):** per-finding AI prompts (`*/utils/ai_analyzer.py`), HTML report
templates (`*/utils/html_report.py`), risk rubrics (`*/analyzer.py`), Helm/RBAC least-privilege manifests.

---

## Phase 0 — Foundation & Build-in-Public Setup (Days 1–7)
> Goal: runnable Tauri shell, dev harness, and the blog pipeline live in week one.

- [x] **Day 1** 🔴 Monorepo scaffold (pnpm + Cargo workspaces); Tauri 2 app boots an empty window. — *Seed post (unnamed): "The CKS exam in plain English: the 6 domains."*
- [ ] **Day 2** 🔴 Dark token design system + app-shell layout (sidebar, command bar, panels) — port `learnthing/docs/DESIGN.md`.
- [x] **Day 3** 🔴 Worktree harness: `scripts/w.sh`, `scripts/lib/ports.sh`, `Makefile` (`wt-open`/`wt-rm`/`wt-list`/`dev`/`dev-api`). Verify `make wt-open NAME=test`. *(done early w/ PR #1)*
- [x] **Day 4** 🔴 `.claude/` agents (code-reviewer, silent-failure-hunter, tauri-ipc-checker, sync-api-contract-checker, rust-safety-auditor, …) + commands `/review-pr`, `/cross-review`, `/triage-review` + `archon-dev` skill + `.archon/` workflows. *(done early w/ PR #1)*
- [~] **Day 5** 🟠 CI: build matrix (mac/win/linux), lint, typecheck; `.github/ISSUE_TEMPLATE/ai-ready.md`. *(partial: issue template done; CI workflows pending)*
- [x] **Day 6** 🔴 **Blog agent**: `.claude/agents/blog-writer.md` + `/blog-draft` → emits unnamed `blog/NNN-<slug>.md` + `.linkedin.md`, rotating `blog/templates/{problem-solution,tutorial,showcase}.md` (+ `reveal.md` via `--reveal`); updates `blog/CALENDAR.md`. *(done early w/ PR #1; seed post 001 drafted)*
- [ ] **Day 7** 🟠 `apps/web` Next.js landing + `/blog` route under a **neutral series brand** (no product name pre-reveal); deploy.

## Phase 1 — Core Cluster Connectivity (Days 8–20)
> Goal: connect to **any** cluster (any cloud, any node type) and see a live overview.

- [ ] **Day 8** 🔴 `kube-rs` integration; parse `~/.kube/config`; list contexts.
- [ ] **Day 9** 🔴 Context switching + multi-cluster session state.
- [ ] **Day 10** 🔴 Connection Manager UI (add / test / remove / health).
- [ ] **Day 11** 🟠 GKE auth via `gke-gcloud-auth-plugin` exec plugin; clear "plugin missing" errors.
- [ ] **Day 12** 🔴 EKS (`aws eks get-token`) + AKS (`kubelogin`) auth. — *Blog: "One tool, every cloud."*
- [ ] **Day 13** 🟠 Cluster-type detection: GKE Standard/**Autopilot**, EKS **EC2 / Fargate / Auto Mode**, AKS, k3s/kind, on-prem → capability flags.
- [ ] **Day 14** 🟠 Node summary + capacity/requests view.
- [ ] **Day 15** 🟠 Control-plane health checks.
- [ ] **Day 16** 🟠 Version-skew detection `[port: k8s-version-manager-slack]` — current vs latest stable from `dl.k8s.io`.
- [ ] **Day 17** 🟡 Component skew + upgrade-gap surfacing.
- [ ] **Day 18** 🟠 Cluster Overview dashboard.
- [ ] **Day 19** 🟡 Reactflow cluster topology.
- [ ] **Day 20** 🟡 ts-rs contract hardening; tauri-ipc-checker green on the kube bridge.

## Phase 2 — Resource Management Core (Days 21–38) — "Lens/Headlamp parity"
> Goal: the baseline every k8s IDE must nail, done well.

- [ ] **Day 21** 🔴 Generic resource explorer (built-in kinds) + virtualized tables.
- [ ] **Day 22** 🔴 CRD discovery via the discovery API.
- [ ] **Day 23** 🟠 Namespace/label filtering + fast search.
- [ ] **Day 24** 🔴 Live **watch** streams (informers) → reactive UI.
- [ ] **Day 25** 🟠 Resource detail (describe).
- [ ] **Day 26** 🟠 Events + owner references.
- [ ] **Day 27** 🟡 Relations graph.
- [ ] **Day 28** 🟠 YAML viewer (read-only, syntax-highlighted).
- [ ] **Day 29** 🔴 YAML editor with server-side **dry-run**.
- [ ] **Day 30** 🔴 Apply with **diff**.
- [ ] **Day 31** 🟡 Create-from-template.
- [ ] **Day 32** 🔴 Logs (multi-container, follow).
- [ ] **Day 33** 🟠 Log search + since/grep.
- [ ] **Day 34** 🔴 Exec terminal (PTY bridge from learnthing).
- [ ] **Day 35** 🟠 Port-forward manager.
- [ ] **Day 36** 🟠 Scale / rollout / restart / delete with confirmations.
- [ ] **Day 37** 🟠 Workloads + Networking (incl. Gateway API) + Config + Storage views.
- [ ] **Day 38** 🟡 Command palette + saved views + multi-cluster resource search.

## Phase 3 — Security Command Center (Days 39–70) — **the differentiator, mapped to CKS**
> Goal: a Security workspace where each panel = a CKS exam domain. The v1 headline.
> *De-risked: 5 panels port validated logic from your `../k8s/` tools.*

### 3a · Cluster Setup & Hardening (CKS 10% + 15%)
- [ ] **Day 39** 🔴 Security workspace shell + Security Score scaffolding. — *Blog: "A Security Command Center mapped to CKS."*
- [ ] **Day 40** 🔴 NetworkPolicy visualizer (Reactflow graph of allowed flows).
- [ ] **Day 41** 🔴 NetworkPolicy editor + "what can reach this pod?".
- [ ] **Day 42** 🔴 CIS Benchmark scan via kube-bench `[port: k8s-kube-bench-slack]` — run + parse.
- [ ] **Day 43** 🟠 CIS remediation tracking + AI analysis + HTML report (harvested).
- [ ] **Day 44** 🔴 RBAC explorer — who-can-do-what matrix `[port: k8s-auth-report-slack]`.
- [ ] **Day 45** 🔴 RBAC `can-i` simulator + over-privileged SA/role detection + cluster-admin/wildcard risk scoring.
- [ ] **Day 46** 🟠 Certificate lifecycle `[port: k8s-certs-manager-slack]` — discovery + expiry/issuer/SAN + alerts.
- [ ] **Day 47** 🟠 API-server access review (anon-auth, insecure ports, admission plugins) + ingress TLS.

### 3a+ · System Hardening (CKS 15%)
- [ ] **Day 48** 🔴 Kubelet hardening audit `[port: k8s-kubelet-check-slack]` — anon-auth, authz `AlwaysAllow`, readonly port 10255, exposed `/metrics`, kubelet CVE; per-node risk + remediation.
- [ ] **Day 49** 🟡 Node OS footprint hints + seccomp/AppArmor presence checks.

### 3b · Minimize Microservice Vulnerabilities (CKS 20%)
- [ ] **Day 50** 🔴 Pod Security Standards / admission audit (privileged, hostPath, hostNetwork, runAsRoot, caps).
- [ ] **Day 51** 🔴 SecurityContext analyzer per workload.
- [ ] **Day 52** 🟠 One-click hardening suggestions. — *Blog: "Pod Security & policy-as-code."*
- [ ] **Day 53** 🔴 Kyverno policy management (browse / author / test).
- [ ] **Day 54** 🔴 OPA/Gatekeeper policy management.
- [ ] **Day 55** 🟠 Policy violation dashboard.
- [ ] **Day 56** 🟠 Secrets handling review + sandboxing detection (gVisor/Kata RuntimeClass).

### 3c · Supply Chain Security (CKS 20%)
- [ ] **Day 57** 🔴 Trivy image scanning (per-workload CVE).
- [ ] **Day 58** 🟠 Severity rollups + fix-version hints.
- [ ] **Day 59** 🔴 cosign/sigstore signature verification.
- [ ] **Day 60** 🟠 Unsigned-image flagging + require-signature policy. — *Blog: "Supply-chain security: Trivy + cosign."*
- [ ] **Day 61** 🔴 Platform binary integrity `[port: k8s-version-manager-slack]` — extract via pod exec, verify **SHA256** vs `dl.k8s.io`.
- [ ] **Day 62** 🟠 SBOM viewer.
- [ ] **Day 63** 🟠 kubesec static manifest analysis.
- [ ] **Day 64** 🟡 checkov + admission-controller-for-images guidance.

### 3d · Monitoring, Logging & Runtime Security (CKS 20%)
- [ ] **Day 65** 🔴 Falco integration (deploy/detect).
- [ ] **Day 66** 🟠 Runtime threat event stream + dashboard.
- [ ] **Day 67** 🟠 Audit log viewer.
- [ ] **Day 68** 🟠 Audit log analyzer (suspicious-verb detection).
- [ ] **Day 69** 🟡 Immutability & drift checks.
- [ ] **Day 70** 🟡 **Security Score** rollup aggregating 3a–3d. — *Blog: "Your cluster's security score."*

## Phase 4 — Training & Upskilling: CKS Practice (Days 71–88)
> Goal: turn the Security Command Center into a learning surface (learnthing model).

- [ ] **Day 71** 🔴 Content schema + Ajv loader + linter (port `learnthing/packages/content`). — *Blog: "Learn CKS by doing, in real clusters."*
- [ ] **Day 72** 🔴 CKS curriculum: Paths/Modules structure — Domain 1 (Cluster Setup).
- [ ] **Day 73** 🟠 Curriculum — Domains 2–3 (Cluster + System Hardening).
- [ ] **Day 74** 🟠 Curriculum — Domains 4–6 (Microservice, Supply Chain, Runtime).
- [ ] **Day 75** 🔴 Embedded local labs — spin up **kind** via PTY.
- [ ] **Day 76** 🟠 k3s lab option + reset/teardown.
- [ ] **Day 77** 🔴 Step validation engine — `end_state` JSONPath assertions.
- [ ] **Day 78** 🔴 Step validation — `output_match` regex.
- [ ] **Day 79** 🟠 Lesson renderer (MDX + Mermaid/Reactflow + code blocks).
- [ ] **Day 80** 🟡 Hints state machine + reveal.
- [ ] **Day 81** 🟠 AI tutor scoped to current lesson + terminal output (Socratic tiered hints).
- [ ] **Day 82** 🟠 Module quizzes + AI grading.
- [ ] **Day 83** 🟠 Gamification — XP + levels.
- [ ] **Day 84** 🟡 Streaks + achievements.
- [ ] **Day 85** 🔴 CKS Exam Simulator — timed, multi-task scenarios.
- [ ] **Day 86** 🟠 Exam grading against a real lab cluster.
- [ ] **Day 87** 🟡 Onboarding (skill/goal selection).
- [ ] **Day 88** 🟡 Progress sync via `sync-api`.

## Phase 5 — AI Features (Days 89–100)
> Goal: planning-platform-grade AI, k8s-focused.

- [ ] **Day 89** 🔴 AI provider layer (Rust + sync-api proxy): role-based routing + **BYOK** (port `ai_provider.py` concept). — *Blog: "An AI that explains your cluster."*
- [ ] **Day 90** 🟠 Failover chains + spend tracking.
- [ ] **Day 91** 🔴 Cluster-scoped AI assistant — RAG over live cluster state.
- [ ] **Day 92** 🟠 Chat grounded in selected resources/namespaces.
- [ ] **Day 93** 🔴 kubectl Copilot — natural language → kubectl/manifest.
- [ ] **Day 94** 🔴 Copilot **dry-run preview** before apply.
- [ ] **Day 95** 🔴 Failure RCA agent — events/logs/probes/resources diagnosis.
- [ ] **Day 96** 🟠 RCA multi-step reasoning + fix suggestions.
- [ ] **Day 97** 🟠 Manifest generator.
- [ ] **Day 98** 🟠 Security remediation agent (Phase-3 findings → PR-ready patches; reuse harvested AI prompts).
- [ ] **Day 99** 🟠 Multi-stage cluster audit agent (fan-out across CKS domains → ranked report).
- [ ] **Day 100** 🟡 Input/output guardrails (injection checks, destructive-action confirmation).

## Phase 6 — Polish, Cross-Platform Release & Launch (Days 101–110)
> Goal: signed, auto-updating 1.0 across all three OSes.

- [ ] **Day 101** 🔴 Release CI — macOS sign + notarize (port `learnthing/.github/workflows/release.yml`).
- [ ] **Day 102** 🔴 Windows signing + installer.
- [ ] **Day 103** 🔴 Linux AppImage + **Tauri auto-updater** manifest.
- [ ] **Day 104** 🔴 E2E (Playwright + `tauri-driver`) — connectivity + resource ops.
- [ ] **Day 105** 🟠 E2E — a security scan + one lab, across mac/win/linux.
- [ ] **Day 106** 🟠 Performance pass (virtualization, watch backpressure) + error/empty states + a11y.
- [ ] **Day 107** 🟠 Licensing/pricing via Stripe + free/pro gating (labs/AI metered).
- [ ] **Day 108** 🟠 Docs site + in-app onboarding + security/privacy statement (BYOK, local-first). — *Blog: retrospective pt.1.*
- [ ] **Day 109** 🟠 Final polish + launch prep. — *Blog: retrospective pt.2.*
- [ ] **Day 110** 🔴 **Public 1.0 launch + THE REVEAL** — *Post (names the product at last): "I've shown you ~100 Kubernetes features. They were all one app."*

---

## Post-1.0 — Deferred modules (from non-CKS `../k8s/` projects)
> Out of the 110-day v1 scope to keep the security-first launch clean.

- [ ] **Operations module** — on-call schedule validation, gap/overlap detection, coverage dashboard + alerts `[port: k8s-oncall-manager-slack]`.
- [ ] **Access module** — Teleport-gated, role-scoped (admin/readonly) access to in-cluster dashboards/apps `[adopt: k8s-dashboard-manager-teleport]`.

---

## Dependency waves (parallelizable via worktrees)
- **Wave A:** Phase 0 → Phase 1 (connectivity blocks everything).
- **Wave B:** Phase 2 ‖ Phase 3a (start in parallel on a worktree after Phase 1).
- **Wave C:** Phase 3b / 3c / 3d are independent panels — ideal for parallel worktrees + `/review-pr` per PR.
- **Wave D:** Phase 4 depends on Phase 3; Phase 5 depends on Phases 1–3.
- **Wave E:** Phase 6 last.

## First PRs (scaffolding to create before Day 1 ends)
- `pnpm-workspace.yaml`, `Cargo.toml`, `Makefile`, `scripts/w.sh`, `scripts/lib/ports.sh`.
- `apps/desktop/src-tauri/src/{kube,cloud,security,pty,commands}/`, `apps/desktop/src/`.
- `apps/sync-api/` (Hono: auth, license, sync, ai-proxy); `apps/web/`.
- `packages/{shared-types,content,k8s-types}/`.
- `.claude/agents/*`, `.claude/commands/*`; `docs/{VISION,DESIGN,SECURITY-CKS-MAP,MVP}.md`.
- `blog/templates/{problem-solution,tutorial,showcase,reveal,linkedin}.md`, `blog/CALENDAR.md`; `docs/COMPETITIVE-LANDSCAPE.md`.
