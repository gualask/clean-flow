---
name: cf-phase-migration-units
description: Break a hard restructure into bounded migration units. Use after the target direction is aligned and before implementation.
---
Do not implement in this skill.

## Goal

Translate a hard path into reviewable, bounded migration units.

## Preflight

1. If `.cflow/architecture.md` or `.cflow/refactor-brief.md` is missing, stop and route to `cf-start` first.
2. Read `.cflow/architecture.md`.
3. Read `.cflow/refactor-brief.md`.
4. If the target direction is not already aligned, stop and route to `cf-start` or `cf-phase-target-shape`.
5. Re-check the repository.
6. Treat the repository as the source of truth.

## Rules

- No big-bang rewrite.
- Prefer the smallest first unit that proves the target direction.
- Keep each migration unit behavior-preserving unless a behavior change was explicitly requested.
- Record what is intentionally deferred.

## Output format

Provide exactly these sections:

1. **Migration strategy**
2. **Migration units**
3. **What stays unchanged for now**
4. **Artifacts updated**
5. **Recommended next action**

## Artifact updates

Update:

- `Work units`
- `Constraints`
- `Execution state`
- `Handoff notes`
- `Unknowns to re-check`
