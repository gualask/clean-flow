# cf-start Artifact Reference

Use this reference when bootstrapping or refreshing `.cflow/*` state.
Ensure this reference has been read in the current invocation before creating or refreshing `.cflow/refactor-brief.md`, or deciding the required `.cflow/refactor-brief.md` field updates.

## Brief bootstrap rules

Use `assets/refactor-brief.template.md` as the source template for `.cflow/refactor-brief.md`.

When bootstrapping or refreshing the refactor brief:

- create `.cflow/refactor-brief.md` from `assets/refactor-brief.template.md` when the work is non-trivial, risky, multi-step, or needs resumable handoff state and the file is missing
- never create root-level `refactor-brief.md`
- when `.cflow/refactor-brief.md` already exists, update it in place instead of re-copying the template blindly

Use `cf-architecture` to bootstrap `.cflow/`, update `.gitignore`, and create or refresh `.cflow/architecture.md`.

Do not create or refresh `.cflow/architecture.md` from `cf-start` phases.
If architecture observations materially changed, route to `cf-architecture` for a refresh or record the decision in `.cflow/refactor-brief.md` until the next architecture pass.

## Required brief updates

If `.cflow/refactor-brief.md` exists or is created, update at least:

- `Context`
- `Assessment summary`
- `Concentration pressure`
- `Fragmentation pressure`
- `Decision notes`
- `Execution state`
- `Handoff notes`

Update these too when they changed:

- `Target direction`
- `Work units`
- `Safety net`
- `Verification`
- `Review notes`
- `Unknowns to re-check`

## Execution State Rules

- Keep `current work unit` as the active selected unit only.
- Use `current work unit: none` at a safe stopping point with no next unit selected.
- Set `recommended next work unit` whenever the near-term next unit is known but not yet active or completed.
- Never finish planning with both `current work unit` and `recommended next work unit` unset.
