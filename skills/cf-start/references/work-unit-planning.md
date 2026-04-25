# Work Unit Planning

Do planning only. Do not implement in this phase.

## Goal

Turn the current assessed pressure into a lightweight ordered backlog of cohesive bounded work units.

Use this when the next step is not "design a new repository shape", but "choose or sequence the next cohesive work unit".

Do not use this phase just to split one clear local cleanup into smaller pieces.

## Preflight

1. Require current `.cflow/architecture.md`; if missing, stop and route to `cf-architecture-map`.
2. Read architecture plus existing `.cflow/refactor-brief.md`.
3. If there is no assessed direction, candidate area, or explicit bounded scope to order, route to `cf-start`.
4. If a broader boundary or packaging decision is unresolved, route to target-shape planning instead of faking lightweight planning.
5. Re-check candidate areas and treat repository state as the source of truth.

## Planning rules

- Keep planning lightweight and tied to the assessed scope.
- Promote only credible, evidenced candidates into work units; put plausible but unproven candidates in `Unknowns to re-check`.
- Prefer the smallest cohesive unit that reduces real pressure now or makes later units easier.
- A unit may touch several nearby files when they are part of one behavior-preserving structural move with one clear stop condition.
- Split units only when ordering, ownership, risk, verification, or reviewability would materially improve.
- Do not invent a repo-wide target shape in this phase.

## Selection rules

- Keep each work unit explicitly `mode: split` or `mode: consolidate`.
- Choose exactly one next unit: active `current work unit` when ready to continue, otherwise `recommended next work unit`.
- Activate a unit only when its goal, mode, dependency order, and immediate next phase are explicit enough to proceed without another planning pass.
- Never finish planning with both `current work unit` and `recommended next work unit` unset.
- Name units by workflow or seam when that is more stable than a brittle file list.

## Output format

Return sections: **Planning scope**, **Candidate work units**, **Ordering logic**, **Recommended next work unit**, **Artifacts updated**, **Recommended next action**.

## Artifact updates

If `.cflow/refactor-brief.md` is missing and this planning pass produces resumable work-unit state, create it before returning.

If a brief exists or is created, update:

- `Work units`
- `Execution state`
- `Handoff notes`
- `Unknowns to re-check`

- In `Execution state`, set `current work unit` to the active selected unit only when that unit is ready to continue without another planning pass.
- Otherwise set `current work unit` to `none` and set `recommended next work unit` to the best next candidate.

If planning clarifies the near-term path, also update:

- `Assessment summary`
- `Alignment notes`
