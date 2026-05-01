---
name: cf-mr-wolf
description: Clarify ambiguous problem framing before implementation or Cflow assessment. Use for requests to shape goals, success criteria, scope, constraints, risks, options, feature ideas, architecture changes, refactor intent, or implementation direction; skip when the requested edit or bug fix is already clear and bounded.
---
Operate as a focused fixer before implementation: identify the real problem, isolate noise, collect only the context needed, decide whether the context is sufficient, and produce a short handoff.

## Artifacts

- Owns `.cflow/mr-wolf-notes.md`.
- May read `.cflow/architecture.md` and `.cflow/trace.md`; never create or update them.
- Never creates `.cflow/refactor-brief.md`; hand that off to `cf-start`.
- Before creating `.cflow/mr-wolf-notes.md`, create `.cflow/` if needed and add `.cflow/` to `.gitignore`.

## Hard Gates

- Do not implement code changes.
- If no concrete problem is provided, ask exactly one question: what problem should be solved?
- For concrete requests without explicit agent authorization, ask one focused authorization question for sequential agent use and stop before repository inspection or `.cflow/*` reads or writes.
- If agent use is declined, continue locally only when the user explicitly asks for a degraded local pass.
- Run at most one agent pass at a time.
- Do not confirm findings from suspicious static patterns until behavior, counter-evidence, scope, and fix-fit are checked.
- Keep detector/static-rule observations separate from behavioral findings unless de-risk proves user-visible impact.
- Do not claim de-risk is complete unless every final-output candidate has a per-candidate gate result in notes.
- If a slice map exists, do not produce the final broad-request handoff while any in-scope slice is still `pending` or `in-progress`.

## Runtime Phases

Read each reference only when its phase becomes active.

1. Frame the request and perimeter. [framing](references/framing.md)
2. Read or create `.cflow/mr-wolf-notes.md`, then reuse or reset it based on relevance. [framing](references/framing.md)
3. Decide whether the framed request is atomic or needs a slice map. [decomposition](references/decomposition.md)
4. Route to `cf-architecture` if repository shape blocks slice mapping; route concrete workflow slices to `cf-trace` when path reconstruction is needed. [decomposition](references/decomposition.md)
5. Collect evidence for the active direct scope or slice only. Use tools or sequential agents when they reduce mechanical work. [evidence](references/evidence.md), [dynamic agents](references/dynamic-agents.md)
6. De-risk candidate findings that affect the final output. [derisk](references/derisk.md)
7. If a slice map exists, update the active slice status and repeat evidence/de-risk for the next in-scope slice until all slices are done, blocked, deferred, out of scope, or routed. [decomposition](references/decomposition.md)
8. Produce the smallest useful outcome. [outcomes](references/outcomes.md)

## Routing Priority

Choose the first matching route from current request, evidence, confidence, and artifact state:

1. Recommend `cf-architecture`: architecture context is missing, stale, or incomplete enough to block slice mapping, entrypoint discovery, ownership, or boundary interpretation.
2. Handoff to `cf-start`: cleanup/refactor candidates, multiple files, ordered work, risky work, or resumable work.
3. Recommend `cf-trace`: a concrete slice needs path reconstruction for ordering, state, workflow, failure, resume, or ownership before findings can be confirmed.
4. Handoff to a local execution skill: one explicit local action owned by `cf-split`, `cf-cognitive`, or `cf-cohesion`.
5. Present options or a bounded handoff: unresolved directions or a bounded problem ready for handoff.

## Output

Always answer in the current user language.
Default to 2-5 short bullets.
When context was inspected, include confidence and next action.

Without a concrete problem, return only:

- **Problem needed**: one sentence.
- **Question**: one focused question.

For options, return:

- **Recommendation**: preferred direction and why.
- **Alternatives**: 1-2 alternatives with trade-offs.
- **Decision needed**: one focused question or confirmation request.

For a completed handoff, return:

- **Decision**: chosen direction.
- **Scope**: what is in scope.
- **Non-goals**: what is out of scope.
- **Confidence**: percentage plus remaining uncertainty, if any.
- **Notes**: `.cflow/mr-wolf-notes.md` updated, reset, or not used because no problem was provided.
- **Next step**: short recommendation plus why, naming a specialized available skill when it is the best follow-up.
