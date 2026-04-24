---
name: cf-internal-boundary-apply
description: Apply one bounded split-oriented structural refactor step while preserving behavior. Use when concentration pressure dominates and a credible safety net exists.
---
Use this to apply one bounded **split-oriented** cleanup step.

## Preflight

- Require current `.cflow/architecture.md`; if missing, stop and route to `cf-architecture-map`.
- Read architecture plus existing `.cflow/refactor-brief.md`.
- Without a brief, continue only with an explicit, local, behavior-preserving scope; otherwise route to `cf-start` or the correct internal skill.
- If there is no credible safety lock for the current structural move, stop and route to `cf-internal-safety-net` first.
- If the seam is still not mapped enough to name the hidden workflows, role classification, and safe split direction, stop and route to `cf-internal-concentration-map` instead of guessing.
- Re-check the touched area and treat repository state as the source of truth.

## Goal

Apply the current bounded work unit or cohesive local unit without widening scope.

This step is for seams where **concentration pressure** dominates.

## Core rules

- Preserve behavior unless behavior change is explicitly requested.
- Reduce pressure by separating responsibilities, not by mechanically splitting files.
- Do not invent fake layers or abstractions with no concrete job.
- Do not leave external-system access scattered through orchestration code.
- Extract pure logic only when it is genuinely autonomous.
- Prefer local, clear helpers over generic utilities.
- Preserve existing dataflow and avoid unnecessary allocations, clones, or passes over the same data unless they clearly reduce complexity.
- Add a new file, module, or type only if it reduces real complexity.
- Avoid dead code, workaround logic, and speculative abstractions.

## Structural step discipline

- Stay within one bounded work unit or cohesive local unit unless the user explicitly broadens scope.
- Record meaningful drift between the brief and the codebase.
- Prefer one meaningful structural move at a time when practical.
- If the safety lock breaks after a move, stop and investigate before stacking more changes on top.
- If you discover a bug while refactoring, do not silently fold a behavior fix into the same structural change unless the user explicitly asked for it.

## Before finishing

Run at least one relevant verification from this list when one is available:

- targeted tests
- lint
- typecheck
- build
- narrow smoke check

If no relevant verification is available, say that explicitly in `Checks run` or `What remains`.

If you moved, renamed, split, or re-exported symbols, ensure you have read [../_shared/references/reference-audit.md](../_shared/references/reference-audit.md) in this invocation, then run that audit for the touched names and paths.

## Output format

Return sections: **Current state**, **Work unit executed**, **Checks run**, **Artifacts updated**, **What remains**, **Next action**.

## Artifact updates

If `.cflow/refactor-brief.md` is missing and this step produces resumable execution state, create it before returning.

If a brief exists or you create one, update before stopping:

- `Work units` status labels
- `Safety net` if assumptions changed
- `Verification`
- `Execution state`
- `Handoff notes`
- `Unknowns to re-check`

If the actual implementation changed understanding, also update:

- `Concentration pressure`
- `Target direction`
- `Alignment notes`
