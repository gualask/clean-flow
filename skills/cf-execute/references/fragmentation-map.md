# Fragmentation Map

Do analysis first. Do not implement in this phase.

## Goal

Map **fragmentation pressure**.

Look for:

- too many tiny files with no real ownership
- pass-through wrappers
- one-hop functions or adapters that add no semantic value
- workflows whose units cannot be judged and skipped from their names, so each hop forces reading
- boundaries created for style rather than responsibility
- indirection that hides the flow more than it clarifies it

Judge candidates with references/navigation-cost.md: jumps into skippable single-responsibility units are cheap. Do not consolidate units a reader can already skip by name and role just to cut hops; consolidate when the boundary itself is artificial.

## Required Inputs

- live plan and the accepted unit's touched scope
- selected consolidation-oriented pressure or unit

## Analyze in this order

1. Identify fragmented seams or awkward chains.
2. Identify which files or modules do too little to justify their existence.
3. Identify whether the boundary is semantically real or artificial.
4. Measure the indirection cost in human terms: how much must be read to understand one simple workflow, counting only hops the reader cannot skip from names and roles.
5. The unit's move is the spec's decision; mapping does not re-decide it. If the map shows the boundary is real or the consolidation would not drop reading cost, record the conflict with the spec in `Decision notes` and ask; do not route into safety-net or structural execution.

## Output format

Return sections: **Fragmentation scope**, **Artificial boundaries**, **Indirection cost**, **Consolidation candidates**, **Refactor risks**, **Recommended next action**.

## Artifact updates

Apply `artifacts.md` when this pass creates or refreshes resumable state.
Phase-specific fields:

- `Fragmentation pressure`

Record a conflict with the spec in `Decision notes`.

Record concrete seam questions in `Unknowns to re-check`.
