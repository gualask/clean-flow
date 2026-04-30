# cf-mr-wolf Agents

Read when DOT reaches `specialist_match`, `specialist_agent`, `merge_specialist_report`, `context_heavy`, `candidate_agent`, `has_candidates`, or `derisk_findings`.

## Agent Use

If the runtime requires explicit subagent authorization, ask before starting it.
Run at most one agent at a time; wait for its report before starting another.
Start each agent with only the inputs named in the owning section; do not paste custom-agent TOML into prompts.
While waiting, do not duplicate the delegated discovery or verification.
Use each report as primary evidence: spot-check only gaps, contradictions, or unsupported claims; final judgment, notes, routing, and user-facing output remain yours.

Prefer a clearly matching specialist skill before generic candidate finding or model-only review.
Specialist delegation is read-only by default: do not let the agent edit code, create product docs, or write `.cflow/*` artifacts.
If the matching skill's normal path requires artifact writes or execution, hand off instead unless the current request explicitly asks to run that path.

## Dynamic Specialist Model Selection

When the runtime allows model selection for a dynamic specialist agent:

- use `gpt-5.4-mini` with medium reasoning for mechanical checks, deterministic scans, inventory, straightforward lint/test/result interpretation, or narrow file classification
- use `gpt-5.5` with high reasoning for ambiguous diagnosis, product or architecture judgment, UX critique, multi-file trade-offs, root-cause analysis, false-positive evaluation, or recommendations that require weighing evidence

If the task mixes mechanical collection and judgment, prefer `gpt-5.5` with high reasoning unless the bounded context is small and the decision is obvious.
Do not override the model declared by packaged custom agents such as `cflow_candidate_finding_recon` or `cflow_finding_derisk_recon`.

## Specialist Skill Agent

After the problem frame and selected context slice are bounded, inspect available skill names and descriptions.
If one skill clearly matches the needed analysis, start one dynamic specialist agent before generic candidate discovery.

Start it with only:

- repository path
- problem frame, success criteria, and non-goals
- selected context slice, files, and exclusions
- compact evidence summary from the bounded pass
- exact specialist skill name, with instruction to read and use that skill as the mandatory analysis lens

Require a read-only report with: **Specialist Skill**, **Scope**, **Findings**, **False Positives Or Non-Issues**, **Unknowns**, **Evidence**, **Recommended Next Step**.

After the report, merge its evidence into notes.
If it contains candidate findings, continue to `has_candidates`.
If it shows required context is still missing, continue to `next_context_or_question`.
If it resolves the bounded question without candidates, continue to `sufficiency`.
If no skill clearly matches, record that and continue to `context_heavy`.

## Candidate Finding Agent

When no specialist skill clearly matches, or the specialist report still leaves broad candidate discovery that the specialist did not cover, use the `cflow_candidate_finding_recon` custom agent to propose candidate findings.
Start it with only the repository path, problem frame, success criteria, non-goals, bounded evidence path/summary, selected context slice, and explicit exclusions.
Expect the subagent report to contain these sections: **Discovery Scope**, **Candidate Findings**, **Grouped Or Deferred Observations**, **Evidence**, **Unknowns**.
Do not cap candidate findings at three.
Carry forward all materially relevant candidates, grouping equivalent findings and explicitly naming minor, deferred, out-of-scope, or non-actionable observations when they affect the decision.

## Finding De-risk Agent

Use the `cflow_finding_derisk_recon` custom agent to verify selected candidate findings before recommending a fix, route, or completed handoff.
When the selected candidate set is too large for one useful pass, choose the smallest decision-blocking subset first, wait for the report, then decide whether a later sequential pass is needed.
Start it with only the repository path, problem frame, assigned candidate findings, selected context slice, and explicit exclusions.
Expect the subagent report to contain these sections: **Verification Scope**, **Finding Classification**, **Fix-Fit Risks**, **Evidence**, **Unknowns**.
