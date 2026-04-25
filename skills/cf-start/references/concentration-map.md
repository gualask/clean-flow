# Concentration Map

Do analysis first. Do not implement in this phase.

## Goal

Map **concentration pressure**.

When the scope is a bounded local seam, do the local mapping that must exist before a safe split-oriented refactor:

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

## Preflight

- Require current `.cflow/architecture.md`; if missing, stop and route to `cf-architecture-map`.
- Read architecture plus existing `.cflow/refactor-brief.md`.
- Without a brief, continue only with an explicit local or repo-level scope; otherwise route to `cf-start`.
- Re-check the repository and treat it as the source of truth.

## Analyze in this order

1. Identify whether the scope is repo-level or a bounded local seam.
2. Identify dense seams or the current choke point.
3. Identify distinct workflows hiding inside the scope.
4. Identify which responsibilities are mixed.
5. Classify the code into entry points, orchestration, integrations, and pure logic.
6. Identify what should stay local and what, if anything, has real shared ownership.
7. Decide whether the safest action is:
   - split
   - keep local and leave it alone
   - defer because the seam is not yet worth touching
8. If split is justified, state the safest split direction for this seam.
9. If split is not justified, do not route into safety-net or structural execution from this phase.

## Output format

Return sections: **Concentration scope**, **Dense seams or touched seam**, **Workflow map**, **Role classification and boundary confusion**, **Safe split direction**, **Refactor risks**, **Recommended next action**.

## Artifact updates

If `.cflow/refactor-brief.md` is missing and this pass produces resumable seam-mapping state, create it before returning.

If a brief exists or is created, update:

- `Concentration pressure`
- `Work units` if the current unit needs refinement
- `Execution state`
- `Handoff notes`
- `Unknowns to re-check`

If this materially changes the likely intervention mode, also update:

- `Assessment summary`
- `Target direction`
