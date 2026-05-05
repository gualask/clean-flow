# Safety Net

This phase belongs after discovery/mapping and before structural edits.

## Preflight

- Require current `.cflow/architecture.md`; if missing, stop and route to `cf-architecture`.
- Read architecture plus existing `.cflow/refactor-brief.md`.
- Without a brief, continue only with an explicit, local, behavior-preserving scope; otherwise route to `cf-start` or the correct Cflow phase.
- If a brief exists but the current work unit, cohesive local unit, or refactoring surface is still too unclear to name the behavior to lock, stop and route back to the correct planning or map phase before designing checks.
- Do not invent a broader cleanup direction in this phase.

## Goal

Lock behavior proportionate to the risk of the planned structural change.

Use protection that materially reduces refactor risk without turning this phase into a broad test strategy. The safety lock must be credible for the change shape, affected contracts, and plausible failure modes.

## Refactoring surface

Name exactly what the next move may disturb:

- current work unit if a brief exists
- explicit cohesive local unit when the request is already scoped to one structural move
- touched workflow, module, or feature area
- observable behavior that must remain stable

If you cannot describe the refactoring surface clearly, route back instead of guessing.

## Choose the lock

Prefer existing protection before adding anything:

1. existing targeted tests
2. existing broader tests that already lock the relevant behavior
3. targeted characterization tests
4. runtime smoke checks or explicit invariants when automated tests are not practical

Characterization tests lock current behavior, not ideal behavior. Do not weaken or rewrite tests just to make a refactor pass.

## Go / no-go

Return `go` only when the lock is credible for the planned move.
Return `no-go` when behavior cannot be checked reasonably or the uncovered surface is too risky for structural execution.
If the gap is acceptable, name it plainly instead of expanding into unrelated test work.

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
