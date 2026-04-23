# cf-start Artifact Reference

Use this reference when bootstrapping or refreshing `.cflow/*` state.
Ensure this reference has been read in the current invocation before creating `.cflow/`, touching `.gitignore`, creating or refreshing `.cflow/*`, or deciding the required `.cflow/refactor-brief.md` field updates.

## Bootstrap rules

Use `assets/architecture.template.md` and `assets/refactor-brief.template.md` as the source templates for Cflow artifacts.

When bootstrapping or refreshing Cflow artifacts:

- create `.cflow/` if it does not exist
- add `.cflow/` to the repository `.gitignore` if the entry is missing
- create `.cflow/architecture.md` from `assets/architecture.template.md` when a repository map is needed and the file is missing
- create `.cflow/refactor-brief.md` from `assets/refactor-brief.template.md` when the work is non-trivial, risky, multi-step, or needs resumable handoff state and the file is missing
- never create root-level `architecture.md` or `refactor-brief.md` for Cflow
- when a Cflow artifact already exists, update it in place instead of re-copying the template blindly

## Required brief updates

If `.cflow/architecture.md` exists or is created, update it whenever current repository understanding or guidance in the file would otherwise be stale.

If `.cflow/refactor-brief.md` exists or is created, update at least:

- `Context`
- `Assessment summary`
- `Concentration pressure`
- `Fragmentation pressure`
- `Alignment notes`
- `Execution state`
- `Handoff notes`

Update these too when they changed:

- `Target direction`
- `Work units`
- `Safety net`
- `Verification`
- `Review notes`
- `Unknowns to re-check`
