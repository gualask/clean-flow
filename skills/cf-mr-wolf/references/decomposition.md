# cf-mr-wolf Work Decomposition

## Purpose

After framing, decide whether the bounded request is ready for direct evidence collection or needs a slice map first.
Use this phase to avoid treating broad audits as one undifferentiated evidence pass.

## Direct Evidence Gate

Continue directly to evidence when the framed request is already one concrete unit:

- one path, workflow, command, screen, API, component, module, file cluster, or candidate finding
- one explicit quality question with a narrow target
- one local action that can be checked with cheap focused evidence

Record in notes why decomposition was skipped.

## Slice Map Gate

Create a bounded slice map before evidence when the framed request spans multiple:

- entrypoints, user flows, commands, screens, modules, or boundaries
- state transitions, persistence points, background work, or failure/resume paths
- quality lenses such as accessibility, reliability, cohesion, performance, security, or testability
- candidate areas where one evidence pass would mix unrelated findings

The slice map is not an execution plan.
It is an evidence routing map that keeps later checks small and comparable.

For broad quality audits, separate behavioral slices from signal-only slices.
Do not mix detector output, lint/static-rule matches, style preferences, or suspicious code shapes into the same slice as user-visible behavior unless the evidence question explicitly connects them.
Create a dedicated `static-signals` or equivalent slice when those signals are in scope, and give that slice a de-risk condition that requires behavioral proof before any app-defect confirmation.

For each slice, record:

- slice id and short name
- status: `pending`, `in-progress`, `done`, `blocked`, `deferred`, `out-of-scope`, or `routed`
- boundary or entrypoint, if known
- evidence question
- evidence class: `behavioral`, `static-signal`, `detector`, `process`, or `mixed`
- why it belongs in scope
- required source of truth or missing context
- whether `cf-architecture`, `cf-trace`, local evidence, or a specialist skill is the best next lens
- de-risk condition for turning findings from candidate to confirmed
- explicit exclusions

Keep the map compact.
Prefer 3-7 slices; group or defer lower-value areas when the map grows larger.
Avoid `mixed` evidence class unless the slice intentionally compares static signals against behavior; otherwise split it.

## Architecture Routing

Use `.cflow/architecture.md` as input when it exists and can clarify entrypoints, boundaries, ownership, or invariants.
If the slice map depends on repository entrypoints, ownership, or boundary shape and architecture is missing, stale, or materially incomplete, route to `cf-architecture` before evidence.
Do not reconstruct full repository architecture inside `cf-mr-wolf`.

## Trace Routing

Use existing `.cflow/trace.md` as input when it matches the current slice or path.
Mark a slice as `trace-needed` when the evidence question depends on ordered behavior, state, resume, failure modes, external effects, or workflow ownership.
Recommend `cf-trace` for those slices before confirming workflow findings.
Do not use `cf-trace` for a generic repository map; use it only for concrete paths or workflows identified by the slice map.

## Slice Loop

When a slice map exists, analyze slices sequentially unless the user explicitly authorized broader agent use and the runtime supports it.
For each in-scope slice:

1. Mark the slice `in-progress`.
2. Run evidence only for that slice or a deliberately recorded slice group.
3. Run de-risk for candidate findings from that slice that can affect final output.
4. Update findings with the slice id.
5. Mark the slice `done`, `blocked`, `deferred`, `out-of-scope`, or `routed`.
6. Select the next highest-value `pending` slice and repeat.

Do not produce a final completed handoff for the broad request while in-scope slices remain `pending` or `in-progress`.
If a slice is skipped, record whether it is `deferred`, `out-of-scope`, or `routed`, with the reason.
If a slice is `blocked`, record the smallest next question, source, or specialist route needed to unblock it.

## Notes Update

Update `.cflow/mr-wolf-notes.md` before evidence with:

- whether decomposition was skipped or used
- slice map, when used
- architecture or trace dependencies
- selected first slice or next required route
- deferred or excluded slices and why
- slice status after each evidence/de-risk pass

If decomposition shows that the request is still too broad to cover credibly, ask one focused scoping question or recommend the next mapping skill instead of starting evidence.
