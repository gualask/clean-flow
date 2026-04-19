---
name: cf-phase-migration-units
description: Break a hard restructure into bounded migration units. Use after the target direction is aligned and before implementation.
---

Do not implement in this skill.

## Goal

Translate a hard path into reviewable, bounded migration units.

## Preflight

1. Read `architecture.md`.
2. Read `refactor-brief.md`.
3. Re-check the repository.
4. Treat the repository as the source of truth.

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
