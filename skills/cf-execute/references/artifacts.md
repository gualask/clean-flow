# Artifact Reference

`.cflow/execution-plan.md` is accepted plan/resume state for one approved spec. It is not scratch notes, and it does not copy the spec's design: it names the spec path and records units, state, and drift.

## Write Gate

Write the plan only when:

- the user resumes accepted Cflow work
- the user asked to plan an approved spec
- execution, review, or verification changed accepted unit state

Do not write it while the spec is still being designed or discussed. A generic "yes" does not grant plan writes unless the previous checkpoint asked to create/update the plan.

## New Spec

When planning a new spec over an existing plan that is not live:

- do not preserve its old work units or recommendations as defaults
- reset from `assets/execution-plan.template.md`
- carry forward only still-relevant facts

## Plan Write Rules

When creating or updating the execution plan:

- create from `assets/execution-plan.template.md` when missing or when planning a new spec
- update in place only for live resume or the same approved plan
- update the phase-specific fields named by the active phase
- preserve unrelated live-resume fields unless evidence makes them stale
- keep user decisions, constraints, exclusions, and open unknowns explicit
- record constraints verbatim (exact values, versions, names, and user wording), not paraphrased; a resumed session reads them without this conversation's context
- keep speculative candidates out
- keep Execution state consistent with unit statuses: `current work unit` must name an `active` unit or `none`, and `recommended next work unit` must not name a `done` unit

## Execution State

- `current work unit`: active selected unit only.
- `recommended next work unit`: known next unit, not active.
- Planning normally ends with `current work unit: none` and one recommended next unit.
- Activate a unit only when the user asks to execute it.
- Artifact-backed planning must not leave both fields unset.
