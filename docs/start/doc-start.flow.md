# cf-start Flow

## Purpose

Maintainer summary for `cf-start`. Runtime behavior belongs to `skills/cf-start/SKILL.md` and its linked references; keep this file descriptive, not authoritative.

## Runtime Inputs

- Public skill: `skills/cf-start/SKILL.md`
- Phase references: `skills/cf-start/references/*.md`
- Shared references: `skills/_shared/references/*.md` when linked by an active phase
- Artifact templates: `skills/cf-start/assets/architecture.template.md`, `skills/cf-start/assets/refactor-brief.template.md`
- Target artifacts: `.cflow/architecture.md`, `.cflow/refactor-brief.md`

## Maintainer Notes

- Controller runtime stays in `skills/cf-start/SKILL.md`.
- Phase rules stay in `skills/cf-start/references/*.md`.
- `.cflow/architecture.md` is map input from `cf-architecture`.
- `.cflow/refactor-brief.md` is accepted plan/resume state, not assessment notes.
- Keep assessment, target shape, unit planning, and execution as separate gates.
