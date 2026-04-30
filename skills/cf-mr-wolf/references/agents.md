# cf-mr-wolf Agents

Read when DOT reaches `context_heavy`, `candidate_agent`, `has_candidates`, or `derisk_findings`.

## Agent Use

If the runtime requires explicit subagent authorization, ask before starting it.
Run at most one custom agent at a time; wait for its report before starting another.
Start each custom agent with only the inputs named in the owning section; do not paste the agent TOML.
While waiting, do not duplicate the delegated discovery or verification.
Use each report as primary evidence: spot-check only gaps, contradictions, or unsupported claims; final judgment, notes, routing, and user-facing output remain yours.

## Candidate Finding Agent

When bounded evidence plus the selected context slice is context-heavy, use the `cflow_candidate_finding_recon` custom agent to propose candidate findings.
Start it with only the repository path, problem frame, success criteria, non-goals, bounded evidence path/summary, selected context slice, and explicit exclusions.
Expect the subagent report to contain these sections: **Discovery Scope**, **Candidate Findings**, **Grouped Or Deferred Observations**, **Evidence**, **Unknowns**.
Do not cap candidate findings at three.
Carry forward all materially relevant candidates, grouping equivalent findings and explicitly naming minor, deferred, out-of-scope, or non-actionable observations when they affect the decision.

## Finding De-risk Agent

Use the `cflow_finding_derisk_recon` custom agent to verify selected candidate findings before recommending a fix, route, or completed handoff.
When the selected candidate set is too large for one useful pass, choose the smallest decision-blocking subset first, wait for the report, then decide whether a later sequential pass is needed.
Start it with only the repository path, problem frame, assigned candidate findings, selected context slice, and explicit exclusions.
Expect the subagent report to contain these sections: **Verification Scope**, **Finding Classification**, **Fix-Fit Risks**, **Evidence**, **Unknowns**.
