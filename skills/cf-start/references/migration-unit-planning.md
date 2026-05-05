# Migration Unit Planning

Do not implement in this phase.

## Goal

Translate a hard path into reviewable, bounded migration units.

## Preflight

1. Require current `.cflow/architecture.md` and `.cflow/refactor-brief.md`; route to `cf-architecture` or `cf-start` if missing.
2. If a hard path is justified but target direction is not confirmed, route to target-shape planning.
3. If hard-path planning is not justified, route to `cf-start`.
4. Re-check the repository and treat it as the source of truth.

## Rules

- No big-bang rewrite.
- Prefer the narrowest representative first unit that proves the target direction.
- Keep each migration unit behavior-preserving unless a behavior change was explicitly requested.
- Record what is intentionally deferred.
- Choose exactly one first migration unit that should prove or de-risk the target direction, then record it using the `artifacts.md` execution-state rules.

## Output format

Return sections: **Migration strategy**, **Migration units**, **What stays unchanged for now**, **Artifacts updated**, **Recommended next action**.

## Artifact updates

Apply `artifacts.md` before stopping.
Phase-specific fields:

- `Work units`
- `Constraints`
- `Unknowns to re-check`

For this phase, the first migration unit is the `recommended next work unit` unless it is ready to become active.
