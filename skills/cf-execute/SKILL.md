---
name: cf-execute
description: "Plan and implement an approved spec — a structural change from cf-architecture or a feature from cf-brainstorm — as ordered work units, with safety net, verification, review, and `.cflow` resume. Use when the user asks to plan, execute, continue, or check work on an approved spec or an accepted execution plan. Do not use to assess or design architecture (cf-architecture), to design a feature (cf-brainstorm), or for a bounded local edit (cf-cognitive, cf-split, cf-cohesion)."
---

Operate as the execution controller. Three rules hold in every phase. Pick one phase, run its references, then stop at its checkpoint.

## Rules

1. **The spec is the authority.** The approved spec lives under `.cflow/specs/` and belongs to the skill that wrote it: read it, never edit it. Do not assess or redesign under this skill: do not narrow or relabel the spec's target, and do not add a target or product behavior it does not state. When code, the request, or user steering contradicts a spec decision or reopens target, ownership, boundaries, or product behavior, name the concrete conflict and ask; revising the spec belongs to its owning skill. Each reference says where to record the conflict.
2. **Execute only on an explicit request for one accepted unit.** Execute when the user asks to execute an accepted unit, or asks to continue and the plan names a `current work unit`; a continue request executes only that unit. A `recommended next work unit` is not accepted: name it and ask before executing it. Never chain planning into execution. Execute at most one unit per invocation unless asked otherwise.
3. **Scope is the spec's or the unit's.** Inspect only the spec's scope or the accepted unit's touched scope; do not inventory the repository. Trust repository state over artifacts, never rely on a stored map, and treat recorded completion as a claim to verify.

## Artifacts

- Owns `.cflow/execution-plan.md`: the accepted plan and resume state for one approved spec. Use references/artifacts.md.
- A plan is live only when the user references it, the last accepted checkpoint used it, or the user asks to resume; file existence alone is not resume. Read it only when it is live.
- Before creating `.cflow/*`, create `.cflow/` if needed and write `.cflow/.gitignore` containing a single `*` line if missing; never edit the repository `.gitignore`.

## Spec Gate

Plan only from an approved spec or an accepted execution plan. Look for them with `ls -a .cflow .cflow/specs`: the directory is git-ignored, so search tools such as `rg` skip it. `.cflow/specs/draft.md` is not approved, even after the user says to proceed: hand it to the skill named as its `owner` and follow that skill, which promotes it. When neither exists, do not plan: hand the request to the skill that designs it and follow that skill instead:

- `cf-architecture`: the structure, ownership, or boundaries of the change are not decided.
- `cf-brainstorm`: a feature or product idea is not designed yet.
- `cf-cognitive`, `cf-split`, `cf-cohesion`: the request is a bounded local edit in that lens.

## Phases

Choose the first matching phase. Do not mirror the plan in user output.

### Planning

Use for an approved spec without a live plan, or a live plan whose units need reordering.

- a structural spec with a target and moves: references/migration-unit-planning.md
- any other spec: references/work-unit-planning.md

A small spec can be one unit. Do not run tests, lint, typecheck, builds, or `git diff --check` to make a plan look safer, unless the user asks for health verification or names a concrete runtime risk. Stop with one checkpoint question.

### Resume

Use when the user asks to resume, continue, proceed with, or inspect existing Cflow work. Check the plan's claims in the touched scope, then:

- stale or unreliable plan: re-plan from the spec
- multiple candidates or ordering needed: Planning
- a unit authorized by rule 2: Unit Execution
- completed work challenged or ready to check: Review Or Verify

### Unit Execution

Use for a unit authorized by rule 2.

- `split` or `consolidate` unit:
  - map: references/concentration-map.md for split, references/fragmentation-map.md for consolidation
  - lock behavior: references/safety-net.md
  - execute: references/split-execution.md or references/consolidation-execution.md
  - close: references/structural-closure.md
- `feature` unit:
  - lock the behavior that must not change: references/safety-net.md
  - implement what the unit and the spec describe, with tests for the behavior it introduces
  - close: references/structural-closure.md
- optional touched-area cleanup: references/local-simplify.md

### Review Or Verify

- closure judgment: references/review.md
- factual checks: references/verify.md

## Language rules

Write `.cflow/execution-plan.md` in the repository's dominant documentation language; if none exists, use the current conversation language.
