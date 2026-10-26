# Migration Unit Planning

## Goal

Translate the approved structural spec into reviewable migration units.

## Required Inputs

- approved spec with target tree, `Moves`, and migration order
- migration constraints and behavior-preservation expectations

## Rules

- If required inputs are missing, stop with `Artifact decision: not updated; migration inputs missing`.
- State the most fragile assumption behind the unit ordering — "this plan assumes X; if X does not hold, Y" — plus the cheapest check to run before the first unit, and record it under `Unknowns to re-check`.
- Choose exactly one first unit and record it through `artifacts.md`.

## Output format

Return sections: **Migration strategy**, **Migration units**, **What stays unchanged for now**, **Fragile assumption**, **Artifact decision**, **Recommended next action**.

## Artifact updates

Apply `artifacts.md` only when planning an approved spec.
Phase-specific fields:

- `Work units`
- `Constraints`
- `Unknowns to re-check`
- `Decision notes` for conflicts with the spec
