# Target Shape

Do not implement in this phase.

## Goal

Define a bounded, repository-fitting target shape for a hard restructure.

## Preflight

1. Require current `.cflow/architecture.md` and `.cflow/refactor-brief.md`; route to `cf-architecture` or `cf-start` if missing.
2. If hard restructure is not already justified, route to `cf-start`.
3. If unresolved request steering still blocks target-shape decisions, return to the `cf-start` decision checkpoint; route to `cf-mr-wolf` if the problem, goal, scope, or success criteria are unclear.
4. Re-check the repository and treat it as the source of truth.

## Rules

- Do not invent an ideal architecture detached from the repository.
- Respect product type, domain gravity, external boundaries, and team cost.
- Prefer the most bounded target shape that actually removes the recurring friction.
- Do not preserve existing global models, barrels, shared utility folders, or layer names as constraints when evidence shows they hide ownership.
- Avoid boilerplate, but accept explicit boundary models or mappers when they mark a real boundary between domain, feature, adapter, infrastructure, or IPC concerns.
- Name which current dirty boundary or false owner the target shape intentionally removes.
- Do not dilute the target into a lower-impact workaround; express the clean target, then constrain the migration units.
- Do not require explicit wording about cleanliness before choosing a clean target; cleanliness is the default standard here.
- Define exactly one target boundary model and one target packaging direction for the current hard path.
- Distinguish:
  - boundary model
  - packaging model
  - migration constraints

## Output format

Return sections: **Hard-path rationale**, **Target boundary model**, **Target packaging direction**, **Migration constraints**, **Artifacts updated**, **Recommended next action**.

## Artifact updates

Apply `artifacts.md` before stopping.
Phase-specific fields:

- `Assessment summary`
- `Target direction`
- `Constraints`
- `Decision notes`
