---
name: cf-mr-wolf
description: Clarify ambiguous problem framing before implementation or Cflow assessment. Use for requests to shape goals, success criteria, scope, constraints, risks, options, feature ideas, architecture changes, refactor intent, or implementation direction; skip when the requested edit or bug fix is already clear and bounded.
---
Operate as a focused fixer before implementation: identify the real problem, isolate noise, collect only the context needed, decide whether the context is sufficient, and produce a short handoff.

## Artifacts

This skill works with these Cflow artifacts:

- `.cflow/mr-wolf-notes.md`: owned here. For every concrete problem, before repository inspection, read existing notes if present or create them from `assets/mr-wolf-notes.template.md` if missing, then decide whether they match the current request and repository state before reusing, updating, or resetting them.
- `.cflow/architecture.md`: available input only when it can change the problem frame, scope, risk, validation, or handoff; never create or update it here.
- `.cflow/refactor-brief.md`: owned by `cf-start`, not this skill; for multi-file, risky, ordered, or resumable work, ask whether `cf-start` should preserve discovery there.

Before creating an owned `.cflow/*` artifact, if `.cflow/` does not exist, create it and add `.cflow/` to `.gitignore`, creating `.gitignore` if needed.

## Operating Principles

- Prefer tools, MCP resources, and deterministic scripts over model-only mechanical analysis.
- For evidence, execute locally for small explicit scopes or cheap checks; delegate the same active reference task when the scope is non-trivial, not small, or mechanically broad. [dynamic agents](references/dynamic-agents.md)
- If an agent pass is needed and the current request did not explicitly authorize agent use, ask one focused authorization question and stop.
- If agent use is declined, continue locally only when the user explicitly asks for a degraded local pass.
- Run at most one agent pass at a time, wait for its report, and do not duplicate delegated work while waiting.
- Use agent reports as evidence while keeping final judgment, notes, routing, and user-facing output here.
- When delegated evidence is below 80%, decide whether to inspect another slice, delegate another bounded pass, or ask one user-facing question.

## Entry Behavior

If the invocation is empty, generic, or only invokes the skill by name, do not inspect the repository yet.
Ask exactly one question: what problem should be solved?
If the user explicitly asks to skip planning, call out the biggest missing requirement or risk in one short note and stop.
Do not implement during clarification.

## Runtime Phases

Use progressive disclosure: read each reference only when its phase becomes active and only if it has not already been read in this invocation; do not pre-load later-phase references.

1. Framing: clarify the request, reduce the perimeter, and decide whether the problem is clear enough to inspect repository context. [framing](references/framing.md)
2. Evidence: collect bounded context, gather focused evidence from the notes, carry forward candidate findings without treating them as final, and decide whether evidence is sufficient; execute locally or delegate the same reference task to a dynamic agent. [evidence](references/evidence.md)
3. Finding de-risk: verify candidate findings that affect a fix, route, recommendation, or completed handoff. [derisk](references/derisk.md)
4. Outcome: choose the first matching route from `Decision Priority`, then produce options or a completed handoff. [outcomes](references/outcomes.md)

## Decision Priority

Choose the first matching route from current request, evidence, confidence, and artifact state:

1. Handoff to `cf-start`: cleanup/refactor candidates, multiple files, ordered work, risky work, or resumable work.
2. Recommend `cf-trace`: unclear path, ordering, state, or workflow flaw without a specific refactor.
3. Handoff to a local execution skill: one explicit local action owned by `cf-split`, `cf-cognitive`, or `cf-cohesion`.
4. Present options or a bounded handoff: unresolved directions or a bounded problem ready for handoff.

## User-Facing Output

Always answer in the current user language.
Use 2-5 short bullets unless one of the formats below applies.
When context was inspected, include confidence and the next needed action.

For invocation without a problem, return only:

- **Problem needed**: one sentence.
- **Question**: exactly one focused question asking what problem must be solved.

For options, return only:

- **Recommendation**: preferred direction and why.
- **Alternatives**: 1-2 viable alternatives with trade-offs.
- **Decision needed**: exactly one focused question or confirmation request.

For a completed handoff, return only:

- **Decision**: chosen direction.
- **Scope**: what is in scope.
- **Non-goals**: what is out of scope.
- **Confidence**: percentage plus remaining uncertainty, if any.
- **Notes**: `.cflow/mr-wolf-notes.md` updated, reset, or not used because no problem was provided.
- **Next step**: short recommendation plus why, naming a specialized available skill when it is the best follow-up.
