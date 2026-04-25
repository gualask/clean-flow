# Planning

Use this reference for lightweight work-unit planning and hard-path target or migration planning.

Do not implement in this phase.

## Planning Modes

- `work-unit planning`: order cohesive bounded units for soft split, soft consolidate, or soft mixed work.
- `target shape`: define the bounded target direction for a hard restructure.
- `migration planning`: break an aligned hard path into reviewable migration units.

## Shared Preflight

- Requires current architecture context.
- Requires an assessed direction, candidate area, or explicit bounded scope to order; otherwise return to assessment.
- Re-check candidate areas before recording units.

## Work-Unit Planning

Use when the next step is not designing a new repository shape, but choosing or sequencing the next cohesive work unit.

Use this when there are:

- multiple credible candidates
- dependency or ordering decisions
- cross-boundary scope
- resumable multi-step work

Do not use it just to split one clear local cleanup into smaller pieces.

Rules:

- Keep planning lightweight and tied to assessed scope.
- Promote only evidenced candidates into work units.
- Put plausible but unproven candidates in `Unknowns to re-check`.
- Prefer the smallest cohesive unit that reduces pressure now or makes later units easier.
- A unit may touch several nearby files when they are part of one behavior-preserving structural move with one clear stop condition.
- Split units only when ordering, ownership, risk, verification, or reviewability materially improves.
- Keep each work unit explicitly `mode: split` or `mode: consolidate`.
- Choose exactly one next unit using the execution-state rules in `artifacts.md`.
- Name units by workflow or seam when that is more stable than a brittle file list.

## Target Shape

Use only when assessment and alignment already justify a broader hard-path change.

Rules:

- Do not invent an ideal architecture detached from the repository.
- Respect product type, domain gravity, external boundaries, and team cost.
- Prefer the smallest target shape that actually removes recurring friction.
- Define exactly one target boundary model and one target packaging direction for the current hard path.
- Distinguish boundary model, packaging model, and migration constraints.
- If unresolved user steering still blocks target-shape decisions, return to alignment.

## Migration Planning

Use after hard-path target direction is aligned.

Rules:

- No big-bang rewrite.
- Prefer the smallest first unit that proves or de-risks the target direction.
- Keep each migration unit behavior-preserving unless a behavior change was explicitly requested.
- Record what is intentionally deferred.
- Choose exactly one first migration unit.
- Mark it active only when goal, dependency order, and immediate next phase are explicit enough; otherwise record it as the recommended next work unit.

## Artifact Updates

Use `artifacts.md` for brief creation and execution-state rules.
Record phase-specific changes in:

- `Work units`
- `Constraints` when hard-path or migration constraints changed
- `Target direction` when target shape changed
- `Execution state`
- `Handoff notes`
- `Unknowns to re-check`

If planning clarifies the near-term path, also update:

- `Assessment summary`
- `Alignment notes`

## Output

Return only the relevant sections:

- planning scope or hard-path rationale
- candidate units, target model, or migration strategy
- ordering logic or migration units
- recommended next unit
- artifacts updated
- recommended next action
