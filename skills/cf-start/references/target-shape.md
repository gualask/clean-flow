# Target Shape

Do not implement in this phase.

## Goal

Define a bounded, repository-fitting target shape for a hard restructure.

## Preflight

Use standard phase preflight.
If hard restructure is not already justified, route to `cf-start`.
If unresolved request steering still blocks target-shape decisions, return to the `cf-start` decision checkpoint; route to `cf-mr-wolf` if the problem, goal, scope, or success criteria are unclear.

## Rules

- Do not invent an ideal architecture detached from the repository.
- Respect product type, domain gravity, external boundaries, and team cost.
- Prefer the most bounded target shape that actually removes the recurring friction.
- Define ownership model and organizing axis before packaging. Identify who owns each named concept or boundary representation, which primitives are truly shared, and what axis the clean shape follows.
- Define any architectural term you rely on for this target, and classify boundary representations by role before placing them.
- Do not preserve existing global models, barrels, shared utility folders, or layer names as constraints when evidence shows they hide ownership.
- Avoid boilerplate, but accept explicit boundary models or mappers when they mark a real ownership boundary.
- Name which current dirty boundary or false owner the target shape intentionally removes.
- Do not dilute the target into a lower-impact workaround; express the clean target, then constrain the migration units.
- Do not require explicit wording about cleanliness before choosing a clean target; cleanliness is the default standard here.
- Define exactly one target boundary model and one target packaging direction for the current hard path.
- Distinguish ownership model, organizing axis, boundary representation roles, boundary model, packaging model, and migration constraints.

## Output format

Return sections: **Hard-path rationale**, **Ownership model**, **Organizing axis**, **Boundary representation roles**, **Target boundary model**, **Target packaging direction**, **Migration constraints**, **Artifacts updated**, **Recommended next action**.

## Artifact updates

Apply `artifacts.md` before stopping.
Phase-specific fields:

- `Assessment summary`
- `Target direction`
- `Constraints`
- `Decision notes`
