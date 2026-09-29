# Migration Unit Planning

## Goal

Translate the approved structural spec into reviewable migration units.

## Required Inputs

- approved spec with target tree, `Moves`, and migration order
- migration constraints and behavior-preservation expectations

## Rules

- If required inputs are missing, stop with `Artifact decision: not updated; migration inputs missing`.
- No big-bang rewrite.
- Follow the spec's `Moves` and migration order. Record a step the code makes impossible in `Decision notes`.
- Prefer the narrowest first unit that proves the target.
- Keep units behavior-preserving unless requested otherwise.
- Record what is intentionally deferred as temporary staging against the accepted target, not as a revised target.
- State the most fragile assumption behind the unit ordering — "this plan assumes X; if X does not hold, Y" — plus the cheapest check to run before the first unit, and record it under `Unknowns to re-check`.
- Choose exactly one first unit and record it through `artifacts.md`.

## Output format

Return sections: **Migration strategy**, **Migration units**, **What stays unchanged for now**, **Fragile assumption**, **Artifact decision**, **Recommended next action**.

## Artifact updates

Apply `artifacts.md` only for approved artifact-backed planning.
Phase-specific fields:

- `Work units`
- `Constraints`
- `Unknowns to re-check`
- `Decision notes` for conflicts with the spec
