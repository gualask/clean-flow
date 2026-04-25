# Migration Unit Planning

Do not implement in this phase.

## Goal

Translate a hard path into reviewable, bounded migration units.

## Preflight

1. Require current `.cflow/architecture.md` and `.cflow/refactor-brief.md`; route to `cf-architecture-map` or `cf-start` if missing.
2. If a hard path is justified but target direction is not aligned, route to target-shape planning.
3. If hard-path planning is not justified, route to `cf-start`.
4. Re-check the repository and treat it as the source of truth.

## Rules

- No big-bang rewrite.
- Prefer the smallest first unit that proves the target direction.
- Keep each migration unit behavior-preserving unless a behavior change was explicitly requested.
- Record what is intentionally deferred.
- Choose and record exactly one first migration unit that should prove or de-risk the target direction.
- Mark that first migration unit as the active current work unit only when its goal, dependency order, and immediate next phase are explicit enough to continue without another planning pass.
- If planning stops before activation, leave `current work unit` as `none` and record that first migration unit as `recommended next work unit`.
- Never finish planning with both `current work unit` and `recommended next work unit` unset.

## Output format

Return sections: **Migration strategy**, **Migration units**, **What stays unchanged for now**, **Artifacts updated**, **Recommended next action**.

## Artifact updates

Update:

- `Work units`
- `Constraints`
- `Execution state`
- `Handoff notes`
- `Unknowns to re-check`

- In `Execution state`, set `current work unit` to the active selected migration unit only when that unit is ready to continue without another planning pass.
- Otherwise set `current work unit` to `none` and set `recommended next work unit` to the first migration unit.
