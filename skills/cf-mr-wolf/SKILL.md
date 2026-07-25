---
name: cf-mr-wolf
description: "Frame, plan, or judge work before implementation. Use when a request is ambiguous, the user is undecided, has doubts, is unconvinced by the current direction, asks for alternatives or an approach, or questions whether something is worth building, keeping, or removing. Do not use for bounded edits or bug fixes; route repository refactors to cf-start and overengineering to cf-simplify."
---
Operate as the decisional entrypoint before implementation: frame unclear work, plan framed work, or judge whether work is worth doing.
Identify the real problem, calibrate scope to the current request's goal and risk appetite, collect only decision-relevant context, and recommend a credible next step, plan, or verdict.

Do not implement code changes.

## Flow Selection

Choose exactly one flow from the current request:

### Evaluation Flow

Use when the current request asks whether something should exist, be built, kept, exposed, or removed — a value judgment, not a method question.
Read references/evaluation.md.
Route judgments about code structure, overengineering, or file necessity to `cf-simplify`.

### Planning Flow

Use when the problem is already clear or framed in this conversation and the current request asks for an implementation plan, an approach decision, or an executable handoff.
Read references/planning.md.
Route repository-level refactor planning — structure, ownership, migration order, resumable multi-step refactor work — to `cf-start`.

### Framing Flow

Use when the request is ambiguous, the problem is unconfirmed, or a diagnostic lens must be selected. This is the default when neither flow above clearly fits.
Follow the workflow below.

Flows may chain within one invocation: when framing concludes and the current request asks for a plan or verdict, continue into that flow with the confirmed frame instead of re-asking.

## Hard Stop

Before any tool call, file read, repository inspection, or specialist skill read, check whether the request is broad diagnostic work whose evaluation lens has not been confirmed in this conversation.
If so, the entire response must be only one question asking which concern or lens should drive the check, plus 2-4 options with one recommended default.
Do not announce an inspection plan, infer the frame from repository state, or continue after the question.

## Artifacts

- Owns `.cflow/mr-wolf-notes.md` only when evidence or decisions need durable handoff; do not create or update it for a first-pass evaluation answer.
- May read `.cflow/architecture.md` and `.cflow/trace.md`; never create or update them.
- Do not read, create, or update `.cflow/refactor-brief.md` during first-pass evaluation; `cf-start` owns planning state.
- Before creating `.cflow/mr-wolf-notes.md`, create `.cflow/` if needed and write `.cflow/.gitignore` containing a single `*` line if missing; never edit the repository `.gitignore`.

## Core Rules

- If no concrete problem is provided, ask exactly one question: what problem should be solved? If the request is materially ambiguous, ask one focused question with a recommended default.
- For broad diagnostic work whose outcome depends on selected evaluation criteria, ask which concern or lens should drive the check before proposing a full assessment frame, routing to a specialist lens, reading specialist skills, or starting broad inspection.
- When asking for that lens, offer 2-4 plausible options inferred from the request and mark the recommended default; wait for the user's answer.
- Inspect only the context needed to reduce uncertainty or support the handoff.
- Do not run tests, lint, typecheck, format checks, or build commands during framing unless the user explicitly asks for health verification or names a concrete runtime risk to verify.
- When the request belongs to a specialist Cflow lens, stop at a compact handoff that preserves the user's problem, scope, constraints, risk appetite, and unresolved decisions; do not answer from general technical judgment or carry specialist architecture, simplification, trace, scenario, split, cohesion, or cognitive rules here.
- Do not turn framing into implementation or specialist assessment; produce plans only in the planning flow, and leave target-shape and work-unit planning to `cf-start`.

## Framing Workflow

Read reference files only when their phase becomes active.

1. Frame the request and perimeter. references/framing.md
2. Read or update `.cflow/mr-wolf-notes.md` when context, evidence, or a handoff should be retained. references/framing.md
3. If the framed request is broad, split it into a small evidence slice map. references/decomposition.md
4. Gather focused evidence for the active scope or slice. references/evidence.md, references/dynamic-agents.md
5. De-risk candidate findings that affect the final answer. references/derisk.md
6. Recommend the most scope-appropriate route or decision. references/outcomes.md

## Routing

Choose the first route that fits current evidence and uncertainty:

1. `cf-brainstorm`: the user explicitly asks to brainstorm, explore, or co-design a new feature or idea into a design spec.
2. `cf-architecture`: `.cflow/architecture.md` is missing, stale, or materially incomplete enough to block routing or handoff.
3. `cf-simplify`: the current request asks whether an area has too many files, unnecessary complexity, overengineering, duplicated or parallel near-identical flows, or whether changing behavior or interface contracts could enable a cleaner simplification.
4. `cf-start`: the current request asks for cleanup/refactor architecture, structure, target direction, ownership, dependency direction, migration order, repository-level assessment, multi-step refactor work, risky or ordered work, or resumable work.
5. `cf-scenario`: one or two concrete code-grounded scenarios would clarify real impact or compare similar flows.
6. `cf-split`, `cf-cognitive`, or `cf-cohesion`: one bounded local cleanup action clearly belongs to that skill.
7. Direct bounded handoff or options: the problem is clear enough and no specialized route owns the decision lens.

## Output

For a plan or a value verdict, use the output contract in the active flow's reference.

For framing, default to 2-5 short bullets.

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
