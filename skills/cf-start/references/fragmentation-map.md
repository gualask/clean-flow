# Fragmentation Map

Do analysis first. Do not implement in this phase.

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

- Require current `.cflow/architecture.md`; if missing, stop and route to `cf-architecture-map`.
- Read architecture plus existing `.cflow/refactor-brief.md`.
- Without a brief, continue only with an explicit local or repo-level scope; otherwise route to `cf-start`.
- Re-check the repository and treat it as the source of truth.

## Analyze in this order

1. Identify fragmented seams or awkward chains.
2. Identify which files or modules do too little to justify their existence.
3. Identify whether the boundary is semantically real or artificial.
4. Measure the indirection cost in human terms: how many hops are needed to understand one simple workflow.
5. Decide whether the safest action is:
   - consolidate
   - leave it alone
   - defer because the seam is not yet worth touching
6. If consolidation is not justified, do not route into safety-net or structural execution from this phase.

## Output format

Return sections: **Fragmentation scope**, **Artificial boundaries**, **Indirection cost**, **Consolidation candidates**, **Refactor risks**, **Recommended next action**.

## Artifact updates

If `.cflow/refactor-brief.md` is missing and this pass produces resumable seam-mapping state, create it before returning.

If a brief exists or is created, update:

- `Fragmentation pressure`
- `Execution state`
- `Handoff notes`
- `Unknowns to re-check`

If this materially changes the likely intervention mode, also update:

- `Assessment summary`
- `Target direction`
