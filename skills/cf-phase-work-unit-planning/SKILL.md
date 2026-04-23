---
name: cf-phase-work-unit-planning
description: Turn an assessed cleanup or refactor backlog into bounded ordered work units. Use when multiple credible candidates exist and you need lightweight sequencing before implementation.
---
Do planning only. Do not implement in this skill.

## Goal

Turn the current assessed pressure into a lightweight ordered backlog of bounded work units.

Use this when the next step is not "design a new repository shape", but "choose or sequence the next safe work unit".

## Preflight

1. If `.cflow/architecture.md` is missing, stop and route to `cf-start` first.
2. Read `.cflow/architecture.md`.
3. Read `.cflow/refactor-brief.md` if it exists.
4. If there is no credible assessed direction, no candidate intervention areas, and no explicit bounded scope to order, stop and route to `cf-start` or `cf-phase-discovery`.
5. If a broader boundary or packaging decision is still unresolved, stop and route to `cf-phase-target-shape` instead of faking lightweight planning.
6. Re-check the candidate areas in the repository.
7. Treat the repository as the source of truth.

## Rules

- Keep planning lightweight and tied to the current assessed scope.
- Turn only credible, evidenced candidates into work units.
- If a candidate is plausible but not evidenced enough yet, record it under `Unknowns to re-check` instead of pretending it is ready.
- Prefer the smallest next unit that either reduces real pressure now or makes later units easier.
- Record why a deferred unit is not first.
- Record when one unit depends on another.
- Record when one unit may simplify or complicate another.
- Keep each work unit explicitly `mode: split` or `mode: consolidate`.
- Choose exactly one `recommended-next` unit.
- Do not activate multiple work units at once.
- If the next unit is clear enough to continue into local mapping, safety-net, or execution, mark it as the active current work unit.
- If planning stops before activation, leave `current work unit` as `none` and record exactly one `recommended next work unit`.
- Do not invent a repo-wide target shape in this skill.
- Do not freeze brittle file lists when the unit can be named more stably in workflow or seam terms.

## Output format

Provide exactly these sections:

1. **Planning scope**
2. **Candidate work units**
3. **Ordering logic**
4. **Recommended next work unit**
5. **Artifacts updated**
6. **Recommended next action**

## Artifact updates

If a brief exists or is created, update:

- `Work units`
- `Execution state`
- `Handoff notes`
- `Unknowns to re-check`

- In `Execution state`, set `current work unit` to the active selected unit when one is ready to continue.
- Otherwise set `current work unit` to `none` and set `recommended next work unit` to the best next candidate.

If planning clarifies the near-term path, also update:

- `Assessment summary`
- `Alignment notes`
