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

- live brief or explicit local/repo-level scope
- selected consolidation-oriented pressure or unit

## Analyze in this order

1. Identify fragmented seams or awkward chains.
2. Identify which files or modules do too little to justify their existence.
3. Identify whether the boundary is semantically real or artificial.
4. Measure the indirection cost in human terms: how much must be read to understand one simple workflow, counting only hops the reader cannot skip from names and roles.
5. Decide whether the safest action is:
   - consolidate
   - leave it alone
   - defer because the seam is not yet worth touching
6. If consolidation is not justified, do not route into safety-net or structural execution from this phase.

## Output format

Return sections: **Fragmentation scope**, **Artificial boundaries**, **Indirection cost**, **Consolidation candidates**, **Refactor risks**, **Recommended next action**.

## Artifact updates

Apply `artifacts.md` when this pass creates or refreshes resumable state.
Phase-specific fields:

- `Fragmentation pressure`

If this materially changes the likely intervention mode, also update:

- `Assessment summary`
- `Target direction`

Record concrete seam questions in `Unknowns to re-check`.
