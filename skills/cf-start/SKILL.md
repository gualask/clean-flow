---
name: cf-start
description: "Assess and plan repository-level refactors: architecture, structure, ownership, dependency direction, target shape, migration order, execution, review, verification, and `.cflow` resume. Use after the diagnostic frame is confirmed; use `cf-mr-wolf` first when framing is unclear or unconfirmed, and `cf-architecture` when architecture context is missing or stale."
---

Operate as the workflow controller. Pick one phase, run its reference, then stop at its gate.

For repository-level structure decisions, route through assessment or target-shape before planning or execution; the selected reference owns the phase-specific decision rules.

## Artifacts

- `.cflow/architecture.md`: input only; owned by `cf-architecture`.
- `.cflow/refactor-brief.md`: accepted plan/resume state only. Use references/artifacts.md. Never use it as assessment notes.

Before creating `.cflow/*`, create `.cflow/` if needed and write `.cflow/.gitignore` containing a single `*` line if missing; never edit the repository `.gitignore`.

## Frame Gate

Before any tool call, preflight, repository inventory, or phase reference, stop when the request asks for broad diagnostic work and the assessment frame has not already been confirmed in this conversation.
In that case, answer only with one question asking which concern or lens should drive the check, plus 2-4 options with one recommended default. Do not inspect the repository, read `.cflow`, read specialist references, or infer the frame from code.

## Verification Gate

Run tests, lint, typecheck, format checks, build commands, or `git diff --check` only in execution, review, verify, or closure phases, or when the user explicitly asks for health verification or names a concrete runtime risk. Do not run them during framing, assessment, target-shape, or planning just to make a diagnostic answer look safer.

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

- `cf-simplify`: overengineering or simplification review comes first.
- `cf-cognitive`, `cf-split`, `cf-cohesion`: the request is local and bounded to that lens.
- `cf-architecture`: `.cflow/architecture.md` is missing, stale, or materially incomplete.

### Target Shape

Use when the open decision is the clean structural end state for a repository or subsystem, not whether intervention is justified. Choose this phase when ownership model, boundary model, dependency direction, organizing axis, or packaging direction must be selected or revised before work can be planned.

Also use this phase when user feedback shows a previous structural recommendation may have preserved accidental structure or solved only a local symptom.

Run references/target-shape.md. Stop with one checkpoint question.

### Fresh Assessment

Use when the open decision is whether repository/subsystem intervention is justified, which intervention frame fits, or whether target-shape work is needed at all.

Run references/assessment.md. Stop with one checkpoint question.

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

- use references/work-unit-planning.md for multiple candidates, ordering, cross-boundary scope, or resumable work
- `soft-mixed` is not executable; each unit is `split` or `consolidate`
- use structural unit directly only for one explicit accepted local unit

### Hard Restructure

Use when assessment/resume points to hard restructure.

- first use references/target-shape.md
- after user approval, use references/migration-unit-planning.md
- never execute before target and migration units are clear

### Structural Unit

Use only for an accepted unit with an execute request, or an explicit local behavior-preserving edit.

- map: references/concentration-map.md for split, references/fragmentation-map.md for consolidation
- lock behavior: references/safety-net.md
- execute: references/split-execution.md or references/consolidation-execution.md
- close: references/structural-closure.md
- optional touched-area cleanup: references/local-simplify.md

### Review Or Verify

Use references/review.md for closure judgment and references/verify.md for factual checks. Do not answer closure challenges with generic reassessment.

## Language rules

Write `.cflow/refactor-brief.md` in the repository's dominant documentation language; if none exists, use the current conversation language.
