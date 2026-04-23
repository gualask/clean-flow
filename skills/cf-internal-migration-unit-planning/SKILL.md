---
name: cf-internal-migration-unit-planning
description: Break a hard restructure into bounded migration units. Use after the target direction is aligned and before implementation.
---
Do not implement in this skill.

## Goal

Translate a hard path into reviewable, bounded migration units.

## Preflight

1. If `.cflow/architecture.md` is missing, stop and route to `cf-architecture-map` first.
2. If `.cflow/refactor-brief.md` is missing, stop and route to `cf-start` first.
3. Read `.cflow/architecture.md`.
4. Read `.cflow/refactor-brief.md`.
5. If a hard path is justified but the target direction is not yet aligned, stop and route to `cf-internal-target-shape`.
6. If the current state does not justify hard-path planning at all, stop and route to `cf-start`.
7. Re-check the repository.
8. Treat the repository as the source of truth.

## Rules

- No big-bang rewrite.
- Prefer the smallest first unit that proves the target direction.
- Keep each migration unit behavior-preserving unless a behavior change was explicitly requested.
- Record what is intentionally deferred.
- Choose and record exactly one first migration unit that should prove or de-risk the target direction.
- Mark that first migration unit as the active current work unit only when its goal, dependency order, and immediate next phase are explicit enough to continue without another planning pass.
- If planning stops before activation, leave `current work unit` as `none` and record that first migration unit as `recommended next work unit`.
- Never finish planning with both `current work unit` and `recommended next work unit` unset.

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

- In `Execution state`, set `current work unit` to the active selected migration unit only when that unit is ready to continue without another planning pass.
- Otherwise set `current work unit` to `none` and set `recommended next work unit` to the first migration unit.
