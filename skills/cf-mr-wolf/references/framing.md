# cf-mr-wolf Framing

## Notes

Use `.cflow/mr-wolf-notes.md` only when the pass gathers evidence, records a slice map, or needs durable handoff context.

When using notes:

- Reuse them only if they still match the current request and repository state.
- Reset stale notes instead of accumulating unrelated history.
- Keep them as investigation state, not an execution plan.

## Request and Scope

First make the request understandable, then reduce the perimeter.

- If no concrete request is present, ask what problem should be solved.
- If the request has materially different interpretations, ask one focused clarifying question.
- State the problem, success criteria, constraints, non-goals, and remaining uncertainty in one or two sentences when helpful.
- Narrow by target area, user flow, quality lens, severity, exclusions, validation, or acceptable risk.
- Ask one scoping question only when the answer can materially reduce work or risk.
- Give the recommended answer first when asking a scoping question.
- If cheap local inspection can answer the question, inspect instead of asking.
- When the frame is still abstract but a concrete example would clarify impact, use `cf-scenario` for one or two code-grounded scenarios.

Avoid broad repository reconnaissance before the request and perimeter are clear enough.

Useful first context slices:

- docs change: docs, README, install guides, docs tests, references
- public API change: exported types, entrypoints, tests, caller examples
- refactor request: target subsystem, call sites, tests, architecture artifacts if relevant
- bug with clear area: failing path, relevant tests, logs, local implementation
