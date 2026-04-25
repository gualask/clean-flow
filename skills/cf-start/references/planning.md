# Planning

Use this reference for lightweight work-unit planning and hard-path target or migration planning.

Do not implement in this phase.

## Planning Modes

- `work-unit planning`: order cohesive bounded units for soft split, soft consolidate, or soft mixed work.
- `target shape`: define the bounded target direction for a hard restructure.
- `migration planning`: break an aligned hard path into reviewable migration units.

## Shared Preflight

1. Require current `.cflow/architecture.md`; if missing, route to `cf-architecture-map`.
2. Read architecture plus existing `.cflow/refactor-brief.md`.
3. Re-check candidate areas and treat repository state as source of truth.
4. If there is no assessed direction, candidate area, or explicit bounded scope to order, route back to assessment.

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
- Choose exactly one next unit: active `current work unit` when ready to continue, otherwise `recommended next work unit`.
- Never finish planning with both `current work unit` and `recommended next work unit` unset.
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
- Mark it active only when goal, dependency order, and immediate next phase are explicit enough to continue without another planning pass.
- Otherwise leave `current work unit` as `none` and record it as `recommended next work unit`.
- Never finish with both `current work unit` and `recommended next work unit` unset.

## Artifact Updates

If `.cflow/refactor-brief.md` is missing and planning creates resumable state, create it before returning.

Update:

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
