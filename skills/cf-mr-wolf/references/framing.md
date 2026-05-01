# cf-mr-wolf Framing

## Notes Preflight

Use `.cflow/mr-wolf-notes.md` as the compact investigation source of truth for this pass.

For every concrete problem:

1. Read existing notes if they exist.
2. Decide whether they still match the current request and repository state.
3. Reuse and update relevant notes.
4. Overwrite stale or unrelated notes with a fresh investigation from the template.

Keep notes focused on investigation state; do not turn them into an execution plan, refactor backlog, handoff, or next-skill decision.

## Request and Scope Loop

First clarify the request, then reduce the perimeter.

Request clarity:

- If no concrete request is present, ask what problem should be solved before repository inspection.
- If the request can be interpreted materially differently, ask exactly one focused clarifying question.
- Continue only when confidence in the intended request is about 90%, or when the user explicitly accepts the remaining ambiguity.
- State the problem, success criteria, constraints, explicit non-goals, and current uncertainty in one or two sentences.

Perimeter clarity:

- After request clarity, check whether the work area can be reduced before broad context gathering.
- Ask exactly one focused scoping question when the answer can reduce candidate areas, priority, success criteria, constraints, risk, or validation.
- Continue only when confidence that the perimeter is clear and not usefully reducible is about 90%, or when the user explicitly asks to proceed despite the broader scope.
- Skip the question when the target is already bounded or a cheap narrow pass can identify the slice.

Treat context as noise when it cannot affect problem definition, success criteria, scope, constraints, risk, validation, or implementation handoff.
Do not do whole-repository reconnaissance before the request and perimeter are clear enough.
For code repositories, derive the initial context slice from the clarified request and perimeter:

- documentation restructure: docs, README, install guides, docs tests, and doc references
- public API change: exported types, entrypoints, tests, and caller examples
- refactor request: touched subsystem, call sites, tests, and architecture artifacts if relevant
- bug with clear area: failing path, relevant tests, logs, and local implementation only
