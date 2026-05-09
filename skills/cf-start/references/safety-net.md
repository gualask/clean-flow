# Safety Net

Use after mapping and before structural edits.

## Required Inputs

- live brief or explicit local behavior-preserving scope
- named work unit, cohesive unit, or refactoring surface

If required inputs are missing, stop with `Go / no-go: no-go; planning inputs missing`.
Do not invent a broader cleanup direction in this phase.

## Goal

Lock behavior proportionate to refactor risk. Keep it targeted to the change shape, affected contracts, and plausible failures.

## Refactoring surface

Name what the next move may disturb:

- current work unit if a live brief exists
- explicit local unit when the request is already scoped
- touched workflow, module, or feature area
- observable behavior that must remain stable

If the surface is unclear, route back.

## Choose the lock

Prefer existing protection:

1. existing targeted tests
2. existing broader tests that already lock the relevant behavior
3. targeted characterization tests
4. smoke checks or explicit invariants

Characterization tests lock current behavior, not ideal behavior.

## Go / no-go

- `go`: lock is credible.
- `no-go`: behavior cannot be checked, or uncovered surface is too risky.
- acceptable gap: name it plainly; do not expand into unrelated test work.

## Required output

Return sections: **Refactoring surface**, **Behavior to lock**, **Existing protections**, **Added or recommended protections**, **Remaining gaps**, **Go / no-go and recommended next action**.

## Artifact updates

Apply `artifacts.md` when this pass creates or refreshes resumable state.
Phase-specific fields:

- `Safety net`
- `Verification`

If this changes what is safe to do next, also update:

- `Work units`
- `Unknowns to re-check`
