# cf-mr-wolf Derisk

## Controller Contract

- Treat this as a packaged custom agent.
- Do not read or paste the TOML instructions or full report format.
- Keep the model and reasoning effort declared by the TOML.
- Use this phase for every candidate finding that influences final output.
- Prefer `cflow_finding_derisk_recon`; use local de-risk only when the agent is unavailable or the user explicitly chooses a degraded local pass.

## Agent Input

Pass repository path, problem frame, `.cflow/mr-wolf-notes.md` path or compact notes summary, assigned candidate findings, selected context slice, and explicit exclusions.
For large candidate sets, pass the smallest decision-blocking subset first.
Keep unchecked candidates as `candidates to verify`, not confirmed findings.
Start another sequential pass only when unchecked candidates can change the final output.
For each candidate, include slice id, evidence class, suspected impact, and the signal that created it, so the de-risk pass can test the signal against real behavior.

## Confirmation Gate

A candidate cannot become `confirmed` from a suspicious pattern or local absence alone.
Do not use an aggregate de-risk summary as proof.
Existing notes can be passed as input, but they do not replace the current de-risk pass.
Before confirmation, record a per-candidate gate result for:

- Reachability: the affected behavior can actually occur in the stated context.
- Counter-evidence: nearby paths, abstractions, generated sources, runtime wiring, or documented constraints do not already handle it.
- Scope fit: the candidate matches the requested problem class and severity.
- Fix-fit: the likely fix does not fight current ownership, invariants, constraints, or user-visible behavior.

Each candidate that influences final output must have:

- candidate id
- slice id
- evidence class
- status: `confirmed`, `false-positive`, `uncertain`, or `reduced`
- reachability result and evidence
- counter-evidence result and evidence
- scope-fit result
- fix-fit result
- final classification reason

Classification must preserve evidence class.
Detector output, lint/static-rule matches, style preferences, and process gaps cannot be confirmed as app defects unless behavioral reachability and user-visible impact are proven.
If the evidence only proves that a detector fired or a convention is missing, classify the candidate as detector/static/process scope, reduced severity, or uncertain rather than behavioral confirmed.

## Expected Output

- **Verification Scope**
- **Finding Classification**
- **Fix-Fit Risks**
- **Evidence**
- **Unknowns**

## Controller Handling

- Update notes with the per-candidate de-risk matrix, confirmed candidates, candidates to verify, and excluded false positives.
- Preserve slice id and evidence class when updating notes.
- If a candidate lacks any gate result, keep it in `candidates to verify` or `uncertain`; do not include it as confirmed.
- Do not recommend implementation for `uncertain` findings unless the next step is verification.
