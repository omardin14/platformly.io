---
description: Triage a PR review's findings — validate each empirically, categorize into 4 buckets, propose fix commits.
argument-hint: [paste-review-text-OR-leave-blank]
allowed-tools: ["Bash", "Glob", "Grep", "Read", "Edit", "Task"]
---

# Triage a PR review

Turn review feedback (from `/review-pr`, `/cross-review`, a human, or pasted text) into a concrete
action plan — without trusting any claim until you've verified it.

**Review text** (if supplied inline): "$ARGUMENTS" — if blank, ask the user to paste it.

## Workflow

1. **Inventory** every distinct finding: claimed severity, claimed `file:line`, one-line summary.
   If the review is long, confirm the count with the user first.

2. **Validate each finding EMPIRICALLY** before trusting it:
   - Cites `file:line`? `Read` it and confirm the issue is real.
   - Cites behavior? Reproduce: grep the pattern, trace the call chain (e.g. command → kube-rs call).
   - Watch for false positives: **severity inflation** (only reachable under un-shipped config),
     **already-mitigated** (a guard/confirmation/dry-run already covers it), **scope drift** (real but
     belongs to a future TODO item), **stale checkout** (already fixed on a later commit).

3. **Categorize** each validated finding:

| Bucket | Criteria | Action |
|---|---|---|
| **Must-fix in this PR** | silent-failure bug, unguarded destructive kube op, security guardrail, high-signal correctness gap | fix in the must-fix commit |
| **Hygiene on this branch** | cheap correctness/consistency, not merge-blocking | second hygiene commit |
| **Defer to backlog** | real gap, separate scope | add a `TODO.md`/issue entry; link from PR |
| **Push back** | inflated, already mitigated, or wrong | don't act; explain with evidence |

4. **Propose commits** — two messages (must-fix, hygiene) with the exact `file:line` each touches.
   Don't write code yet — wait for "go". Remember the required commit footer
   (`Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`).

5. **Output**: findings inventory table → validation table (Confirmed/Pushed-back + evidence) →
   buckets → proposed commits.

## Key Principles
- Empirical validation is the whole point — a reviewer claim is a hypothesis, not a fact.
- Push back has the same evidentiary bar as accept.
- Keep the must-fix surface tight for fast re-review.
