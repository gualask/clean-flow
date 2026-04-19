---
name: cf-phase-fragmentation-map
description: Analyze pressure caused by over-splitting, pass-through wrappers, or artificial boundaries. Use during assessment or before a consolidate-oriented work unit.
---

Do analysis first. Do not implement in this skill.

## Goal

Map **fragmentation pressure**.

Look for:

- too many tiny files with no real ownership
- pass-through wrappers
- one-hop functions or adapters that add no semantic value
- high hop count for simple workflows
- boundaries created for style rather than responsibility
- indirection that hides the flow more than it clarifies it

## Preflight

- Read `architecture.md`.
- Read `refactor-brief.md` if it exists.
- If no brief exists, this skill may still run when the prompt gives an explicit local or repo-level scope.
- Re-check the repository.
- Treat the repository as the source of truth.

## Analyze in this order

1. Identify fragmented seams or awkward chains.
2. Identify which files or modules do too little to justify their existence.
3. Identify whether the boundary is semantically real or artificial.
4. Measure the indirection cost in human terms: how many hops are needed to understand one simple workflow.
5. Decide whether the safest action is:
   - consolidate
   - leave it alone
   - defer because the seam is not yet worth touching

## Output format

Provide exactly these sections:

1. **Fragmentation scope**
2. **Artificial boundaries**
3. **Indirection cost**
4. **Consolidation candidates**
5. **Refactor risks**
6. **Recommended next action**

## Artifact updates

If a brief exists or is created, update:

- `Fragmentation pressure`
- `Execution state`
- `Handoff notes`
- `Unknowns to re-check`

If this materially changes the likely intervention mode, also update:

- `Assessment summary`
- `Target direction`
