---
name: cf-phase-target-shape
description: Define the target direction for a hard refactor. Use only after discovery or brainstorming established that the repository shape itself needs structural correction.
---

Do not implement code in this skill.

## Goal

Define the **target direction** for the hard path without turning it into a big design document.

## Preflight

- Read `architecture.md`.
- Read `refactor-brief.md` if it exists.
- Re-check the repository and the premise for the hard path.
- Treat the repository as the source of truth.

## Determine

Separate these decisions clearly:

- boundary model direction
- packaging direction
- what stays stable
- what must move
- what is explicitly out of scope for the first migration wave

Possible boundary directions include:

- layered
- use-case oriented
- hexagonal-ish / ports-and-adapters-ish
- modular monolith
- DDD-ish
- mixed but clarified

Possible packaging directions include:

- by layer
- by feature
- by workflow
- hybrid

## Rules

- Do not claim an ideal architecture in the abstract.
- The target direction must fit this repository's product shape and domain gravity.
- Prefer the smallest target shift that removes the recurring friction.
- Hard path still requires bounded migration, not a big-bang rewrite.

## Output format

Provide exactly these sections:

1. **Hard-path premise**
2. **Boundary direction**
3. **Packaging direction**
4. **What stays stable**
5. **What must move**
6. **Out-of-scope for the first migration wave**
7. **Recommended next action**

## Artifact updates

If a brief exists or is created, update:

- `Target direction`
- `Constraints`
- `Execution state`
- `Handoff notes`

If `architecture.md` changed materially, update it too.
