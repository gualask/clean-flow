# Consolidation Execution

## Required Inputs

- live brief or explicit local behavior-preserving scope
- credible safety lock
- mapped fragmentation seam and artificial boundary

If required inputs are missing, stop with `Next action: complete mapping or safety net first`.
- If there is no credible safety lock for the current structural move, stop and route to safety-net first.
- If the target boundary may be real, route to fragmentation-map before editing.

## Goal

Reduce fragmentation pressure without widening scope.

Consolidate when:

- tiny files, wrappers, or adapters add hops without real ownership
- a simple workflow takes too many jumps
- a boundary exists for style rather than responsibility
- callers still perform nearly the same branching or mapping after crossing the boundary

Do not consolidate just because files are small. Keep boundaries with real domain vocabulary, integration/lifecycle ownership, dependency direction, or test isolation.

## Consolidation criteria

- Name the workflow with too many jumps and the artificial boundary to collapse.
- Consolidate only when a visible hop disappears or caller code gets simpler.
- The resulting file/module still needs one clear reason to exist.

## Execution rules

- Preserve behavior unless behavior change is explicitly requested.
- Keep the resulting seam easier to read than the starting point.
- Stay within one bounded unit unless the request broadens scope.
- Prefer one meaningful merge/collapse at a time.
- Avoid replacing over-fragmentation with a new god file.
- Preserve dataflow; avoid extra allocations, clones, or passes unless they reduce complexity.
- Move ownership only when caller code visibly gets simpler.
- If a real sub-seam appears, keep it near the owner unless reuse or cross-feature ownership justifies broader placement.
- Report bugs separately unless behavior fixes were requested.

## Before finishing

Apply [structural-closure.md](structural-closure.md).

## Artifact updates

If the actual implementation changed understanding, also update:

- `Fragmentation pressure`
- `Target direction`
- `Decision notes`
