---
name: cf-internal-work-unit-planning
description: Turn an assessed cleanup or refactor backlog into cohesive bounded work units. Use when multiple credible candidates, dependency order, or resumable multi-step sequencing must be decided before implementation.
---
Do planning only. Do not implement in this skill.

## Goal

Turn the current assessed pressure into a lightweight ordered backlog of cohesive bounded work units.

Use this when the next step is not "design a new repository shape", but "choose or sequence the next cohesive work unit".

Do not use this skill just to split one clear local cleanup into smaller pieces.

## Preflight

1. Require current `.cflow/architecture.md`; if missing, stop and route to `cf-architecture-map`.
2. Read architecture plus existing `.cflow/refactor-brief.md`.
3. If there is no assessed direction, candidate area, or explicit bounded scope to order, route to `cf-start`.
4. If a broader boundary or packaging decision is unresolved, route to `cf-internal-target-shape` instead of faking lightweight planning.
5. Re-check candidate areas and treat repository state as the source of truth.

## Rules

- Keep planning lightweight and tied to the current assessed scope.
- Turn only credible, evidenced candidates into work units.
- If a candidate is plausible but not evidenced enough yet, record it under `Unknowns to re-check` instead of pretending it is ready.
- Prefer the smallest cohesive next unit that either reduces real pressure now or makes later units easier.
- A cohesive unit may touch several nearby files when they are part of one behavior-preserving structural move with one clear stop condition.
- Do not split one coherent local cleanup into multiple work units only to reduce size.
- Split units only when ordering, ownership, risk, verification, or reviewability would materially improve.
- Record why a deferred unit is not first.
- Record when one unit depends on another.
- Record when one unit may simplify or complicate another.
- Keep each work unit explicitly `mode: split` or `mode: consolidate`.
- Choose exactly one `recommended-next` unit.
- Do not activate multiple work units at once.
- Mark a unit as the active current work unit only when its goal, mode, dependency order, and immediate next phase are explicit enough to continue without another planning pass.
- If no unit meets that activation threshold, leave `current work unit` as `none` and record exactly one `recommended next work unit`.
- Never finish planning with both `current work unit` and `recommended next work unit` unset.
- Do not invent a repo-wide target shape in this skill.
- Do not freeze brittle file lists when the unit can be named more stably in workflow or seam terms.

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
