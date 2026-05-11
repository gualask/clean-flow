# Migration Unit Planning

Do not implement in this phase.

## Goal

Translate the accepted hard target into reviewable migration units.

## Required Inputs

- approved hard target direction
- target boundary model and packaging direction
- migration constraints and behavior-preservation expectations

## Rules

- If required inputs are missing, stop with `Artifact decision: not updated; migration inputs missing`.
- No big-bang rewrite.
- Do not downgrade, narrow, or relabel the accepted clean target to reduce churn.
- Prefer the narrowest first unit that proves the target.
- Keep units behavior-preserving unless requested otherwise.
- Record what is intentionally deferred as temporary staging against the accepted target, not as a revised target.
- Choose exactly one first unit and record it through `artifacts.md`.
- Keep the first unit as `recommended next work unit`, not active execution state.
- Stop after planning. Do not map, safety-net, or execute.

## Output format

Return sections: **Migration strategy**, **Migration units**, **What stays unchanged for now**, **Artifact decision**, **Recommended next action**.

## Artifact updates

Apply `artifacts.md` only for approved artifact-backed planning.
Phase-specific fields:

- `Work units`
- `Constraints`
- `Unknowns to re-check`

The first unit becomes active only in a later execution phase.
