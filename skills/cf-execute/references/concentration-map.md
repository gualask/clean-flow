# Concentration Map

Do analysis first. Do not implement in this phase.

## Goal

Map **concentration pressure**.

Do the local mapping of the unit's touched scope that must exist before a safe split-oriented refactor:

- hidden workflows
- role classification:
  - entry points
  - orchestration
  - integrations
  - pure logic
- what should stay local and what, if anything, has real shared ownership
- the safest split direction for this seam

Look for:

- god files
- mixed responsibilities
- hidden workflows
- orchestration and integration confusion
- scattered I/O inside dense files
- local policy trapped inside an oversized seam

## Required Inputs

- live plan and the accepted unit's touched scope
- selected split-oriented pressure or unit

## Analyze in this order

1. Identify dense seams or the current choke point.
2. Identify distinct workflows hiding inside the scope.
3. Identify which responsibilities are mixed.
4. Classify the code into entry points, orchestration, integrations, and pure logic.
5. Identify what should stay local and what, if anything, has real shared ownership.
6. The unit's move is the spec's decision; mapping does not re-decide it. If the map shows the split would not drop pressure, because no hidden workflow or mixed role separates or the new boundary would be generic, speculative, or harder to follow, record the conflict with the spec in `Decision notes` and ask; do not route into safety-net or structural execution.
7. Otherwise state the safest split direction for this seam.

## Output format

Return sections: **Concentration scope**, **Dense seams or touched seam**, **Workflow map**, **Role classification and boundary confusion**, **Safe split direction**, **Refactor risks**, **Recommended next action**.

## Artifact updates

Apply `artifacts.md` when this pass creates or refreshes resumable state.
Phase-specific fields:

- `Concentration pressure`
- `Work units` if the current unit needs refinement

Record a conflict with the spec in `Decision notes`.

Record concrete seam questions in `Unknowns to re-check`.
