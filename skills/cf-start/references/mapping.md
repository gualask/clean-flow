# Mapping

Use this reference to map concentration or fragmentation pressure before structural execution.

Do analysis first. Do not implement in this phase.

## Shared Preflight

- Requires current architecture context.
- Without a brief, continue only with an explicit local or repo-level scope; otherwise return to assessment.
- Re-check the mapped scope before deciding.

## Concentration Mapping

Use when the current path points to a split move or when assessment needs concentration pressure.

Look for:

- god files
- mixed responsibilities
- hidden workflows
- orchestration and integration confusion
- scattered I/O inside dense files
- local policy trapped inside an oversized seam

Analyze in this order:

1. Identify whether the scope is repo-level or a bounded local seam.
2. Identify dense seams or the current choke point.
3. Identify distinct workflows hiding inside the scope.
4. Identify which responsibilities are mixed.
5. Classify code into entry points, orchestration, integrations, and pure logic.
6. Identify what should stay local and what has real shared ownership.
7. Decide whether the safest action is split, keep local, or defer.
8. If split is justified, state the safest split direction.
9. If split is not justified, do not continue to safety net or execution.

## Fragmentation Mapping

Use when the current path points to consolidation or when assessment needs fragmentation pressure.

Look for:

- too many tiny files with no real ownership
- pass-through wrappers
- one-hop functions or adapters that add no semantic value
- high hop count for simple workflows
- boundaries created for style rather than responsibility
- indirection that hides the flow more than it clarifies it

Analyze in this order:

1. Identify fragmented seams or awkward chains.
2. Identify files or modules that do too little to justify their existence.
3. Identify whether the boundary is semantically real or artificial.
4. Measure indirection cost in human terms.
5. Decide whether the safest action is consolidate, leave alone, or defer.
6. If consolidation is not justified, do not continue to safety net or execution.

## Artifact Updates

Use `artifacts.md` for brief creation and baseline field rules.

For concentration mapping, update:

- `Concentration pressure`
- `Work units` if the current unit needs refinement
- `Execution state`
- `Handoff notes`
- `Unknowns to re-check`

For fragmentation mapping, update:

- `Fragmentation pressure`
- `Execution state`
- `Handoff notes`
- `Unknowns to re-check`

If mapping materially changes the likely intervention mode, also update:

- `Assessment summary`
- `Target direction`

## Output

For concentration, return scope, dense seam, workflow map, role classification, safe split direction, risks, and next action.

For fragmentation, return scope, artificial boundaries, indirection cost, consolidation candidates, risks, and next action.
