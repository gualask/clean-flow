---
name: cf-phase-migration-units
description: Break a hard refactor into bounded work units. Use after the target direction is stable and before applying structural changes.
---

Do not implement code in this skill.

## Goal

Turn the hard path into **bounded migration units** that are reviewable and resumable.

## Preflight

- Read `architecture.md`.
- Read `refactor-brief.md` if it exists.
- Re-check the repository.
- Treat the repository as the source of truth.

## Build migration units

Each work unit should be:

- behavior-preserving
- locally reviewable
- small enough for one bounded pass
- tied to a real pressure seam
- clear about risk and validation

For each unit, capture only:

- title
- intent
- main risk
- expected validation

Do not write pseudo-code.
Do not freeze a detailed file list unless the repository already makes it obvious.

## Rules

- Prefer carving out the first seam that reduces risk or clarifies boundaries.
- Do not spread one unit across unrelated areas.
- Stop before the work units become miniature implementation specs.
- Keep the next one or two units most explicit. Later units can stay lighter.

## Output format

Provide exactly these sections:

1. **Hard-path migration posture**
2. **Bounded work units**
3. **First recommended work unit**
4. **Validation posture**
5. **Recommended next action**

## Artifact updates

If a brief exists or is created, update:

- `Work units`
- `Execution state`
- `Handoff notes`
- `Unknowns to re-check`

If `architecture.md` guidance changed materially, update it too.
