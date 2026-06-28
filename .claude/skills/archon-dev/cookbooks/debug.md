# Cookbook: DEBUG — root cause analysis

**Goal:** find the actual root cause before changing anything.

## Steps
1. Reproduce. Capture the exact error/stack/log. For Rust panics, note the message + the command path.
2. Form hypotheses; rank by likelihood. Trace each with evidence (`file:line`, logs, a failing test).
   Common platformly culprits: IPC contract drift, blocking-in-async stalling the runtime, watch-stream
   leaks, a swallowed `Err`, kubeconfig/auth-plugin failures surfaced as opaque errors.
3. Confirm the root cause with a minimal reproduction (ideally a failing test).
4. Write `.claude/archon/debug/<slug>.md`: symptom · reproduction · root cause (with evidence) · fix
   options · chosen fix.
5. Add a regression test where feasible.

## Output
The debug doc + root cause. Suggest `plan`/`implement` for the fix, or `issue` if deferring.
