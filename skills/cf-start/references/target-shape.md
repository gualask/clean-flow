# Target Shape

Do not implement in this phase.

## Goal

Define a bounded, repository-fitting target shape for a hard restructure.

## Preflight

1. Require current `.cflow/architecture.md` and `.cflow/refactor-brief.md`; route to `cf-architecture` or `cf-start` if missing.
2. If hard restructure is not already justified, route to `cf-start`.
3. If unresolved user steering still blocks target-shape decisions, return to the `cf-start` decision checkpoint; route to `cf-mr-wolf` if the problem, goal, scope, or success criteria are unclear.
4. Re-check the repository and treat it as the source of truth.

## Rules

- Do not invent an ideal architecture detached from the repository.
- Respect product type, domain gravity, external boundaries, and team cost.
- Prefer the smallest target shape that actually removes the recurring friction.
- Define exactly one target boundary model and one target packaging direction for the current hard path.
- Distinguish:
  - boundary model
  - packaging model
  - migration constraints

## Output format

Return sections: **Hard-path rationale**, **Target boundary model**, **Target packaging direction**, **Migration constraints**, **Artifacts updated**, **Recommended next action**.

## Artifact updates

Update:

- `Assessment summary`
- `Target direction`
- `Constraints`
- `Decision notes`
- `Execution state`
- `Handoff notes`
