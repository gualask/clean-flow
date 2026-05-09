# Work Unit Planning

Do planning only. Do not implement in this phase.

## Goal

Create an ordered backlog of cohesive bounded work units.

## Required Inputs

- accepted direction or target shape
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
- Do not invent a repo-wide target shape in this phase.

## Selection rules

- Each unit is `mode: split` or `mode: consolidate`.
- Choose exactly one next unit and record it through `artifacts.md`.
- Keep the chosen unit as `recommended next work unit`, not `current work unit`.
- Name units by workflow or seam when that is more stable than a brittle file list.
- Stop after planning. Do not map, safety-net, or execute.

## Output format

Return sections: **Planning scope**, **Candidate work units**, **Ordering logic**, **Recommended next work unit**, **Artifact decision**, **Recommended next action**.

## Artifact updates

Apply `artifacts.md` only for approved artifact-backed planning.
Phase-specific fields:

- `Work units`
- `Unknowns to re-check`

The chosen unit becomes active only in a later execution phase.

If planning clarifies the near-term path, also update:

- `Assessment summary`
- `Decision notes`
