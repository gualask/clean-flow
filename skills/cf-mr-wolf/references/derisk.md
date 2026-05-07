# cf-mr-wolf Derisk

De-risk only candidate findings that affect the final answer or next route.
The goal is to avoid promoting suspicious patterns into confirmed problems too early.

Prefer the packaged `cflow_finding_derisk_recon` agent when it is available and allowed.
Use a local bounded pass when the agent is unavailable or the current request chooses a degraded local pass.

## Gate

Before a candidate becomes confirmed, check enough of:

- Reachability: can the affected behavior actually occur?
- Counter-evidence: do nearby paths, abstractions, generated sources, runtime wiring, or documented constraints already handle it?
- Scope fit: does it match the requested problem class and severity?
- Fix fit: would the likely fix fit current ownership, invariants, constraints, and user-visible behavior?
- Scenario fit: can one concrete code-grounded scenario show what is impacted, and one relevant nearby flow show what is not impacted or why the boundary is safe?

Classify each decision-relevant candidate as:

- `confirmed`
- `false-positive`
- `uncertain`
- `reduced`

Preserve the evidence class.
Detector/static/process observations should stay labeled that way unless behavioral reachability and user-visible or requested-scope impact are proven.

If a candidate is about runtime behavior, user/system impact, or cross-flow risk, do not treat de-risk as complete until `cf-scenario` has been used or explicitly recommended as the next check.

Do not recommend implementation for `uncertain` findings unless the next step is verification.
