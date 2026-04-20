---
name: cf-phase-target-shape
description: Define the target direction for a hard restructure when soft intervention is not enough. Use only after assessment and alignment clearly justify a broader change.
---
Do not implement in this skill.

## Goal

Define a bounded, repository-fitting target shape for a hard restructure.

## Preflight

1. If `.cflow/architecture.md` or `.cflow/refactor-brief.md` is missing, stop and route to `cf-start` first.
2. Read `.cflow/architecture.md`.
3. Read `.cflow/refactor-brief.md`.
4. If hard restructure is not already justified, stop and route to `cf-start` or `cf-phase-brainstorming`.
5. Re-check the repository.
6. Treat the repository as the source of truth.

## Rules

- Do not invent an ideal architecture detached from the repository.
- Respect product type, domain gravity, external boundaries, and team cost.
- Prefer the smallest target shape that actually removes the recurring friction.
- Distinguish:
  - boundary model
  - packaging model
  - migration constraints

## Output format

Provide exactly these sections:

1. **Hard-path rationale**
2. **Target boundary model**
3. **Target packaging direction**
4. **Migration constraints**
5. **Artifacts updated**
6. **Recommended next action**

## Artifact updates

Update:

- `Assessment summary`
- `Target direction`
- `Constraints`
- `Alignment notes`
- `Execution state`
