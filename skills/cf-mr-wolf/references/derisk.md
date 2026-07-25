# cf-mr-wolf Derisk

De-risk only candidate findings that affect the final answer or next route.
The goal is to avoid promoting suspicious patterns into confirmed problems too early.

Prefer a terminal read-only agent when subagents are available and allowed: dispatch one by filling the template in references/derisk-agent-brief.md, which hunts counter-evidence and reports `refuted`, `narrowed`, or `no counter-evidence found`, never a confirmation.
Use a local bounded pass when subagents are unavailable or the current request asks to keep the pass local.
When the agent returns nothing within the wait the current request allows, treat every candidate it was given as unchecked: no counter-evidence was gathered, so no candidate becomes `confirmed` on that pass.

## Gate

Assign the class yourself from the evidence; a report supplies gate slots, never the class.
Where a report leaves a gate unchecked, fill it locally or classify the candidate `uncertain`.

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
