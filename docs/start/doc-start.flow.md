# cf-start Flow

## Purpose

Maintainer summary for `cf-start`. Runtime behavior belongs to `skills/cf-start/SKILL.md` and its linked references; keep this file descriptive, not authoritative.

## Runtime Inputs

- Public skill: `skills/cf-start/SKILL.md`
- Phase references: `skills/cf-start/references/*.md`
- Shared sources vendored into runtime paths: configured `skills/_shared/references/*.md` and `skills/_shared/scripts/repo-tree.mjs` when linked by an active phase
- Artifact templates: `skills/cf-start/assets/refactor-brief.template.md`
- Target artifact: `.cflow/refactor-brief.md`

## Maintainer Notes

- Controller runtime stays in `skills/cf-start/SKILL.md`.
- Phase rules stay in `skills/cf-start/references/*.md`.
- `scripts/repo-tree.mjs` orients fresh assessment and direct target-shape work when current structure is not already established; planning, resume, execution, review, and verify inspect only their accepted or touched scope. No stored map is consumed.
- `.cflow/refactor-brief.md` is accepted plan/resume state, not assessment notes.
- Keep assessment, target shape, unit planning, and execution as separate gates.
- Target-shape and migration-unit planning must surface the plan's most fragile assumption before approval.
- When a safety lock or check breaks during execution, `regression-handling.md` (shared, vendored) gates further edits: root-cause sentence, three-hypothesis hard stop, scope blast after the fix.
