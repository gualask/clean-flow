---
name: cf-mr-wolf
description: "Frame ambiguous work before implementation or assessment: clarify problem, goals, success criteria, scope, constraints, risks, options, feature ideas, architecture changes, refactor intent, implementation direction, and diagnostic evaluation frames. Use before broad diagnostic work when the evaluation frame is unconfirmed; skip clear bounded edits or bug fixes."
---
Operate as a lightweight technical framing skill before implementation.
Identify the real problem, calibrate scope to the current request's goal and risk appetite, collect only decision-relevant context, and recommend a credible next step.

Do not implement code changes.

## Hard Stop

Before any tool call, file read, repository inspection, or specialist skill read, check whether the request is broad diagnostic work whose evaluation lens has not been confirmed in this conversation.
If so, the entire response must be only one question asking which concern or lens should drive the check, plus 2-4 options with one recommended default.
Do not announce an inspection plan, infer the frame from repository state, or continue after the question.

## Artifacts

- Owns `.cflow/mr-wolf-notes.md` only when evidence or decisions need durable handoff; do not create or update it for a first-pass evaluation answer.
- May read `.cflow/architecture.md` and `.cflow/trace.md`; never create or update them.
- Do not read, create, or update `.cflow/refactor-brief.md` during first-pass evaluation; `cf-start` owns planning state.
- Before creating `.cflow/mr-wolf-notes.md`, create `.cflow/` if needed and add `.cflow/` to `.gitignore`.

## Core Rules

- If no concrete problem is provided, ask exactly one question: what problem should be solved? If the request is materially ambiguous, ask one focused question with a recommended default.
- For broad diagnostic work whose outcome depends on selected evaluation criteria, ask which concern or lens should drive the check before proposing a full assessment frame, routing to a specialist lens, reading specialist skills, or starting broad inspection.
- When asking for that lens, offer 2-4 plausible options inferred from the request and mark the recommended default; wait for the user's answer.
- Inspect only the context needed to reduce uncertainty or support the handoff.
- Do not run tests, lint, typecheck, format checks, or build commands during framing unless the user explicitly asks for health verification or names a concrete runtime risk to verify.
- When the request belongs to a specialist Cflow lens, stop at a compact handoff that preserves the user's problem, scope, constraints, risk appetite, and unresolved decisions; do not answer from general technical judgment or carry specialist architecture, simplification, trace, scenario, split, cohesion, or cognitive rules here.
- Do not turn framing into implementation, specialist assessment, target-shape planning, or work-unit planning.

## Workflow

Read reference files only when their phase becomes active.

1. Frame the request and perimeter. [framing](references/framing.md)
2. Read or update `.cflow/mr-wolf-notes.md` when context, evidence, or a handoff should be retained. [framing](references/framing.md)
3. If the framed request is broad, split it into a small evidence slice map. [decomposition](references/decomposition.md)
4. Gather focused evidence for the active scope or slice. [evidence](references/evidence.md), [dynamic agents](references/dynamic-agents.md)
5. De-risk candidate findings that affect the final answer. [derisk](references/derisk.md)
6. Recommend the most scope-appropriate route or decision. [outcomes](references/outcomes.md)

## Routing

Choose the first route that fits current evidence and uncertainty:

1. `cf-architecture`: `.cflow/architecture.md` is missing, stale, or materially incomplete enough to block routing or handoff.
2. `cf-simplify`: the current request asks whether an area has too many files, unnecessary complexity, overengineering, or whether changing behavior or interface contracts could enable a cleaner simplification.
3. `cf-start`: the current request asks for cleanup/refactor architecture, structure, target direction, ownership, dependency direction, migration order, repository-level assessment, multi-step refactor work, risky or ordered work, or resumable work.
4. `cf-scenario`: one or two concrete code-grounded scenarios would clarify real impact or compare similar flows.
5. `cf-trace`: one concrete workflow/path needs ordered reconstruction for state, failure, resume, or ownership.
6. `cf-split`, `cf-cognitive`, or `cf-cohesion`: one bounded local cleanup action clearly belongs to that skill.
7. Direct bounded handoff or options: the problem is clear enough and no specialized route owns the decision lens.

## Output

Default to 2-5 short bullets.

For missing problem context, return only:

- **Problem needed**: one sentence.
- **Question**: one focused question.

For options, return:

- **Recommendation**: preferred direction and why.
- **Alternatives**: 1-2 alternatives with trade-offs.
- **Decision needed**: one focused question or confirmation request.

For unconfirmed diagnostic frames, return only:

- **Question**: which concern or lens should drive the check?
- **Options**: 2-4 plausible lenses with one recommended default.

For a completed handoff, keep it compact:

- **Decision**: chosen direction.
- **Scope**: what is in scope and what is not.
- **Evidence**: what was checked, if anything.
- **Confidence**: rough confidence plus the main remaining uncertainty.
- **Next step**: recommended route or action.
