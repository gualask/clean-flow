# Work Unit Planning

## Goal

Create an ordered backlog of cohesive bounded work units for an approved spec.

## Required Inputs

- approved spec, or accepted plan whose units need reordering
- candidate area or bounded planning scope
- resolved ownership, boundary, and packaging decisions for the planned area

## Planning rules

- If required inputs are missing, stop with `Artifact decision: not updated; planning inputs missing`.
- Keep planning proportionate and tied to the assessed scope.
- Promote only evidenced candidates; put unproven ones in `Unknowns to re-check`.
- Do not split one clear local cleanup into smaller pieces just to create more work units.
- Prefer the narrowest cohesive useful unit.
- A unit may touch several nearby files when one structural move owns them.
- Split units only for ordering, ownership, risk, verification, or reviewability.

## Selection rules

- Each unit is `mode: split`, `mode: consolidate`, or `mode: feature` (behavior the spec introduces).
- Choose exactly one next unit and record it through `artifacts.md`.
- Name units by workflow or seam when that is more stable than a brittle file list.

## Output format

Return sections: **Planning scope**, **Candidate work units**, **Ordering logic**, **Recommended next work unit**, **Artifact decision**, **Recommended next action**.

## Artifact updates

Apply `artifacts.md` only for approved artifact-backed planning.
Phase-specific fields:

- `Work units`
- `Unknowns to re-check`

If planning clarifies the near-term path or finds a conflict with the spec, also update `Decision notes`.
