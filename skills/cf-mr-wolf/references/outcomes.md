# cf-mr-wolf Outcomes

## Cflow Handoff Boundary

When the evidence points to behavior-preserving cleanup, refactor, file splitting, cognitive cleanup, local cohesion regrouping, or multiple candidate files, do not jump directly into execution skills such as `cf-split`, `cf-cognitive`, or `cf-cohesion`.
Stop at an evidence-backed handoff:

- summarize the problem frame
- list the evidence gathered and evidence-producing tools used
- name candidate areas or files with short rationale
- separate confirmed, false-positive, and uncertain findings when they materially affect the decision
- avoid recommending implementation for findings that are still `uncertain`
- include the investigation confidence percentage
- recommend whether `cf-start` should own the next work

If the work is multi-file, ordered, risky, or resumable, ask whether to preserve the discovery in `.cflow/refactor-brief.md` and continue through `cf-start`.
`cf-start` owns that brief, work-unit planning, safety net, execution, review, verification, and resume.
When handing off, say that `cf-start` should read `.cflow/mr-wolf-notes.md` as discovery input; do not imply that `.cflow/refactor-brief.md` will be written here.
Use `cf-split`, `cf-cognitive`, or `cf-cohesion` directly only when the current request is one explicit local action and no broader Cflow planning or resume state is needed.
When the notes contain a slice map, do not produce the final broad-request handoff while any in-scope slice is still `pending` or `in-progress`.
When the evidence points to an unclear multi-step path, ordering risk, state gap, or workflow flaw but not yet to a specific refactor, recommend `cf-trace`.
When the notes show that architecture context blocks slice mapping, entrypoint discovery, ownership, or boundary interpretation, recommend `cf-architecture` before evidence or implementation.
When the notes show unresolved `trace-needed` slices, recommend `cf-trace` for the concrete slice that blocks confirmation.
When a follow-up skill owns required artifact writes or execution, hand off instead of doing that work here; if the current request continues into that skill and it needs subagent authorization, ask first.

## Decision and Options

When enough context exists, propose the smallest useful decision.
If multiple credible directions remain, present 2-3 real options:

- recommendation first
- when each option fits
- trade-offs
- risks
- expected effort

Do not fake balance.
For a completed handoff, make `Next step` a short recommendation with a reason, and name a specialized available skill when it clearly owns the best follow-up.
