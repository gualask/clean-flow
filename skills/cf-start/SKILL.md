---
name: cf-start
description: Control Cflow cleanup/refactor workflows: assess architecture, decide target shape, plan units, execute one accepted unit, review, verify, or resume. Use for repository-level structure, ownership, dependency direction, migration order, and `.cflow` resume; route unclear framing to `cf-mr-wolf` and stale maps to `cf-architecture`.
---

Operate as the workflow controller. Pick one phase, run its reference, then stop at its gate.

Clean target first: domain and ownership clarity, no false owners, no global glue. Treat current folders as evidence, not constraints. Prefer the cleanest proportionate target; use churn only to stage migration. Preserve behavior unless the user asks for behavior change.

## Artifacts

- `.cflow/architecture.md`: input only; owned by `cf-architecture`.
- `.cflow/refactor-brief.md`: accepted plan/resume state only. Use [artifacts.md](references/artifacts.md). Never use it as assessment notes.

Before creating `.cflow/*`, create `.cflow/` if needed and add `.cflow/` to `.gitignore`.

## Preflight

Before running any phase reference, unless the reference says otherwise:

1. Require current `.cflow/architecture.md` for workflow phases; route to `cf-architecture` when it is missing, stale, or materially incomplete.
2. Ignore `.cflow/refactor-brief.md` in fresh assessment or fresh target-shape work unless the user asks to resume.
3. Read `.cflow/refactor-brief.md` only for live resume, execution, review/verify, or accepted artifact-backed planning.
4. Trust repository state over artifacts.
5. If required state or scope is missing, route back to the right planning phase.
6. Treat recorded completion as a claim to verify, not a conclusion.

## Flow Selection

Choose the first matching flow. Do not mirror the brief in user output.

### Gates

Approval is phase-scoped.

- After assessment: next analysis/planning phase only. No brief, no work units, no code.
- After target-shape: work-unit planning only. No execution.
- After work-unit planning: execute only if the user asks to execute the accepted unit.
- Execution needs an explicit execute request, or a live resume unit plus a continue request.
- Do not chain assessment -> target-shape -> planning -> execution unless the user asked for that full chain after seeing the plan.
- If user steering reopens domain, ownership, boundary, target-shape, or risk, reassess instead of narrowing to a local step.

### Handoff

Use before Cflow workflow work. Do not touch `.cflow/refactor-brief.md`.

- `cf-mr-wolf`: problem, goal, success criteria, scope boundary, or explicit non-goals are not clear enough for repository-level intervention framing.
- `cf-simplify`: overengineering or simplification review comes first.
- `cf-trace`: the user asks only to reconstruct or audit a path.
- `cf-cognitive`, `cf-split`, `cf-cohesion`: the request is local and bounded to that lens.
- `cf-architecture`: `.cflow/architecture.md` is missing, stale, or materially incomplete.

### Fresh Assessment

Use for clear repository/subsystem cleanup, structure, ownership, dependency, or migration questions.

Run [assessment.md](references/assessment.md). Stop with one checkpoint question.

### Resume

Use only when the user asks to resume, continue, proceed with, or inspect existing Cflow work.

A brief is live only when the user references it, the last accepted checkpoint used it, or the user asks to resume. File existence alone is not resume.

- stale or unreliable brief: reassess
- unresolved hard target: target-shape
- multiple candidates or ordering needed: work-unit planning
- accepted unit plus execute/continue request: structural unit
- completed work challenged or ready to check: review/verify

Do not switch live direction until the user accepts the change. Execute at most one unit per invocation unless asked otherwise.

### Soft Refactor

Use after accepted soft-split, soft-consolidate, or soft-mixed direction.

- use [work-unit-planning.md](references/work-unit-planning.md) for multiple candidates, ordering, cross-boundary scope, or resumable work
- `soft-mixed` is not executable; each unit is `split` or `consolidate`
- use structural unit directly only for one explicit accepted local unit

### Hard Restructure

Use when assessment/resume points to hard restructure.

- first use [target-shape.md](references/target-shape.md)
- after user approval, use [migration-unit-planning.md](references/migration-unit-planning.md)
- never execute before target and migration units are clear

### Structural Unit

Use only for an accepted unit with an execute request, or an explicit local behavior-preserving edit.

- map: [concentration-map.md](references/concentration-map.md) for split, [fragmentation-map.md](references/fragmentation-map.md) for consolidation
- lock behavior: [safety-net.md](references/safety-net.md)
- execute: [split-execution.md](references/split-execution.md) or [consolidation-execution.md](references/consolidation-execution.md)
- close: [structural-closure.md](references/structural-closure.md)
- optional touched-area cleanup: [local-simplify.md](references/local-simplify.md)

### Review Or Verify

Use [review.md](references/review.md) for closure judgment and [verify.md](references/verify.md) for factual checks. Do not answer closure challenges with generic reassessment.

## Language rules

Write `.cflow/refactor-brief.md` in the repository's dominant documentation language; if none exists, use the current conversation language.
