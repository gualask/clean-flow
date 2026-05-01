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

- After request clarity, aggressively reduce the work area before broad context gathering.
- Walk the decision tree one branch at a time: target area, user flow, quality lens, severity threshold, exclusions, validation, and acceptable risk.
- Ask exactly one focused scoping question when the answer can reduce candidate areas, priority, success criteria, constraints, risk, or validation.
- For each scoping question, provide the recommended answer first, then 1-2 alternatives with trade-offs when useful.
- If the answer can be discovered from existing notes or allowed repository inspection, inspect that source instead of asking.
- Continue until no remaining question can materially reduce the perimeter, or until the user explicitly chooses to proceed with the broader scope.
- Skip the question only when the target is already bounded, the next reduction would risk excluding relevant work, or a cheap narrow pass can identify the slice.

Question format:

- Recommendation: preferred narrowing and why.
- Alternatives: 1-2 other viable scopes, only when real.
- Question: one decision for the user.

Treat context as noise when it cannot affect problem definition, success criteria, scope, constraints, risk, validation, or implementation handoff.
Do not do whole-repository reconnaissance before the request and perimeter are clear enough.
For code repositories, derive the initial context slice from the clarified request and perimeter:

- documentation restructure: docs, README, install guides, docs tests, and doc references
- public API change: exported types, entrypoints, tests, and caller examples
- refactor request: touched subsystem, call sites, tests, and architecture artifacts if relevant
- bug with clear area: failing path, relevant tests, logs, and local implementation only
