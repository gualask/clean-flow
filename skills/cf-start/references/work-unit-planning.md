# Work Unit Planning

Do planning only. Do not implement in this phase.

## Goal

Turn the current assessed pressure into an evidence-backed ordered backlog of cohesive bounded work units.

## Preflight

1. Require current `.cflow/architecture.md`; if missing, stop and route to `cf-architecture`.
2. Read architecture plus existing `.cflow/refactor-brief.md`.
3. If there is no assessed direction, candidate area, or explicit bounded scope to order, route to `cf-start`.
4. If a broader boundary or packaging decision is unresolved, route to target-shape planning instead of faking bounded work-unit planning.
5. Re-check candidate areas and treat repository state as the source of truth.

## Planning rules

- Keep planning proportionate and tied to the assessed scope.
- Promote only credible, evidenced candidates into work units; put plausible but unproven candidates in `Unknowns to re-check`.
- Do not split one clear local cleanup into smaller pieces just to create more work units.
- Prefer the narrowest cohesive unit that still reduces real pressure now or makes later units easier.
- A unit may touch several nearby files when they are part of one behavior-preserving structural move with one clear stop condition.
- Split units only when ordering, ownership, risk, verification, or reviewability would materially improve.
- Do not invent a repo-wide target shape in this phase.

## Selection rules

- Keep each work unit explicitly `mode: split` or `mode: consolidate`.
- Choose exactly one next unit, then record it using the `artifacts.md` execution-state rules.
- Activate a unit only when its goal, mode, dependency order, and immediate next phase are explicit enough to proceed without another planning pass.
- Name units by workflow or seam when that is more stable than a brittle file list.

## Output format

Return sections: **Planning scope**, **Candidate work units**, **Ordering logic**, **Recommended next work unit**, **Artifacts updated**, **Recommended next action**.

## Artifact updates

Apply `artifacts.md` before stopping when this pass creates or refreshes resumable state.
Phase-specific fields:

- `Work units`
- `Unknowns to re-check`

For this phase, the best next candidate is the `recommended next work unit` unless it is ready to become active.

If planning clarifies the near-term path, also update:

- `Assessment summary`
- `Decision notes`
