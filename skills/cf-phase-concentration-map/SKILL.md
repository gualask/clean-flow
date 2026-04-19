---
name: cf-phase-concentration-map
description: Analyze pressure caused by too much code or too many responsibilities in one place. Use during assessment or before a split-oriented work unit, including local seam mapping before edits.
---

Do analysis first. Do not implement in this skill.

## Goal

Map **concentration pressure**.

When the scope is a bounded local seam, do the local mapping that must exist before a safe split-oriented refactor:

- hidden workflows
- role classification:
  - entry points
  - orchestration
  - integrations
  - pure logic
- what should stay local instead of being promoted to shared utilities
- the safest split direction for this seam

Look for:

- god files
- mixed responsibilities
- hidden workflows
- orchestration and integration confusion
- scattered I/O inside dense files
- local policy trapped inside an oversized seam

## Preflight

- Read `.cflow/architecture.md`.
- Read `.cflow/refactor-brief.md` if it exists.
- If no brief exists, this skill may still run when the prompt gives an explicit local or repo-level scope.
- Re-check the repository.
- Treat the repository as the source of truth.

## Analyze in this order

1. Identify whether the scope is repo-level or a bounded local seam.
2. Identify dense seams or the current choke point.
3. Identify distinct workflows hiding inside the scope.
4. Identify which responsibilities are mixed.
5. Classify the code into entry points, orchestration, integrations, and pure logic.
6. Identify what should stay local instead of being promoted to shared helpers.
7. Decide whether the safest action is:
   - split
   - keep local and leave it alone
   - defer because the seam is not yet worth touching
8. If split is justified, state the safest split direction for this seam.

## Output format

Provide exactly these sections:

1. **Concentration scope**
2. **Dense seams or touched seam**
3. **Workflow map**
4. **Role classification and boundary confusion**
5. **Safe split direction**
6. **Refactor risks**
7. **Recommended next action**

## Artifact updates

If a brief exists or is created, update:

- `Concentration pressure`
- `Work units` if the current unit needs refinement
- `Execution state`
- `Handoff notes`
- `Unknowns to re-check`

If this materially changes the likely intervention mode, also update:

- `Assessment summary`
- `Target direction`
