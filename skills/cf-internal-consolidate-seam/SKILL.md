---
name: cf-internal-consolidate-seam
description: Apply one bounded consolidation step to reduce over-fragmentation while preserving behavior. Use when fragmentation pressure dominates and a credible safety net exists.
---
Use this to apply one bounded **consolidation-oriented** cleanup step.

## Preflight

- Require current `.cflow/architecture.md`; if missing, stop and route to `cf-architecture-map`.
- Read architecture plus existing `.cflow/refactor-brief.md`.
- Without a brief, continue only with an explicit, local, behavior-preserving scope; otherwise route to `cf-start` or the correct internal skill.
- If there is no credible safety lock for the current structural move, stop and route to `cf-internal-safety-net` first.
- If it is still unclear whether the target boundary is artificial or semantically real, stop and route to `cf-internal-fragmentation-map` instead of guessing.
- Re-check the touched area and treat repository state as the source of truth.

## Goal

Reduce fragmentation pressure without widening scope.

Use this when **fragmentation pressure** has a clear consolidation direction:

- tiny files, wrappers, or adapters add hops without real ownership
- a simple workflow requires too many jumps to understand
- a boundary exists for style rather than responsibility
- callers still perform nearly the same branching or mapping after crossing the boundary

Do not consolidate just because files are small. Keep a boundary when it carries a real domain, infrastructure, lifecycle, or dependency meaning.

## Execution rules

- Preserve behavior unless behavior change is explicitly requested.
- Keep the resulting seam easier to read than the starting point.
- Stay within one bounded work unit or cohesive local unit unless the user explicitly broadens scope.
- Prefer one meaningful merge or collapse at a time.
- Avoid replacing over-fragmentation with a new god file.
- Preserve existing dataflow and avoid unnecessary allocations, clones, or passes over the same data unless they clearly reduce complexity.
- Move ownership only when the caller gets simpler in a visible way.
- If consolidation reveals a real autonomous sub-seam, keep it local unless reuse already exists.
- Report likely bugs or behavior inconsistencies separately unless the user explicitly asked for a behavior fix.

## Before finishing

Run at least one relevant verification from this list when one is available:

- targeted tests
- lint
- typecheck
- build
- narrow smoke check

If no relevant verification is available, say that explicitly in `Checks run` or `What remains`.

If you merged, renamed, removed, or relocated files or symbols, ensure you have read [../_shared/references/reference-audit.md](../_shared/references/reference-audit.md) in this invocation, then run that audit for the touched names and paths.

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

- `Fragmentation pressure`
- `Target direction`
- `Alignment notes`
