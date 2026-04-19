---
name: cf-step-consolidate-seam
description: Apply one bounded consolidation step to reduce over-fragmentation while preserving behavior. Use when fragmentation pressure dominates and a credible safety net exists.
---

Use this to apply one bounded **consolidation-oriented** cleanup step.

## Preflight

- Read `.cflow/architecture.md`.
- Read `.cflow/refactor-brief.md` first if it exists.
- If no brief exists, continue only when the prompt already gives an explicit, local, behavior-preserving scope.
- If no brief exists and the scope is not explicit and local, stop before implementation and route to `cf-start` or the correct `cf-phase-*` skill.
- Re-check the touched area before moving code.
- Verify the repository state before trusting the brief or the prompt.
- Treat the repository as the source of truth.

## Goal

Reduce fragmentation pressure without widening scope.

This step is for seams where **fragmentation pressure** dominates.

## What this usually means

- merge tiny files that have no real semantic boundary
- collapse pass-through wrappers
- reduce hop count for simple workflows
- remove artificial boundaries that make the flow harder to follow
- keep behavior stable and preserve stable APIs when practical

## Core rules

- Do not consolidate just because files are small; consolidate only when the current boundary is artificial.
- Preserve behavior unless behavior change is explicitly requested.
- Keep the resulting seam easier to read than the starting point.
- Avoid swinging into a new god file.
- Prefer one bounded merge or collapse at a time.
- If the consolidation reveals a genuinely autonomous sub-seam, keep it local unless reuse is already real.

## Before finishing

Run the smallest relevant verification you can from this list:

- targeted tests
- lint
- typecheck
- build
- narrow smoke check

If you merged, renamed, removed, or relocated files or symbols, run an explicit **reference audit** for:

- old file paths
- old symbol names
- stale imports / requires / re-exports
- tests, mocks, fixtures, and helpers

## Output format

Provide exactly these sections:

1. **Current state**
2. **Work unit executed**
3. **Checks run**
4. **Artifacts updated**
5. **What remains**
6. **Next action**

## Artifact updates

If a brief exists or you create one, update before stopping:

- `Work units` status labels
- `Safety net` if assumptions changed
- `Verification`
- `Execution state`
- `Handoff notes`
- `Unknowns to re-check`

If the actual implementation changed understanding, also update:

- `Fragmentation pressure`
- `Target direction`
- `Alignment notes`
