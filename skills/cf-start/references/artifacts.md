# Artifact Reference

`.cflow/refactor-brief.md` is accepted plan/resume state. It is not scratch notes.

## Write Gate

Write the brief only when:

- the user resumes accepted Cflow work
- the user approved a direction/target and asked for artifact-backed planning
- execution, review, or verification changed accepted unit state

Do not write it during fresh assessment, target proposal, or decision discussion. A generic "yes" does not grant brief writes unless the previous checkpoint asked to create/update a plan artifact.

## Fresh vs Resume

Existing brief is live only for resume. In fresh work:

- do not read the brief unless the user asks to resume it
- do not preserve its old work units or recommendations as defaults
- if a new plan is approved, reset from `assets/refactor-brief.template.md`
- carry forward only still-relevant facts

## Brief Write Rules

When creating or updating the refactor brief:

- create from `assets/refactor-brief.template.md` when missing or starting a fresh accepted plan
- update in place only for live resume or the same approved plan
- update the phase-specific fields named by the active phase
- preserve unrelated live-resume fields unless evidence makes them stale
- keep user decisions, constraints, exclusions, and open unknowns explicit
- keep speculative candidates out

## Execution State

- `current work unit`: active selected unit only.
- `recommended next work unit`: known next unit, not active.
- Planning normally ends with `current work unit: none` and one recommended next unit.
- Activate a unit only when the user asks to execute it.
- Artifact-backed planning must not leave both fields unset.
