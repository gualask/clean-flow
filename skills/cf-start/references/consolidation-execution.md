# Consolidation Execution

## Preflight

Use standard phase preflight.
Without a brief, require explicit local behavior-preserving scope.
- If there is no credible safety lock for the current structural move, stop and route to safety-net first.
- If it is still unclear whether the target boundary is artificial or semantically real, stop and route to fragmentation-map instead of guessing.

## Goal

Reduce fragmentation pressure without widening scope.

Fragmentation pressure has a clear consolidation direction when:

- tiny files, wrappers, or adapters add hops without real ownership
- a simple workflow requires too many jumps to understand
- a boundary exists for style rather than responsibility
- callers still perform nearly the same branching or mapping after crossing the boundary

Do not consolidate just because files are small. Keep a boundary when it carries real domain vocabulary, integration or lifecycle ownership, dependency direction, or test isolation.

## Consolidation criteria

- Before consolidating, name the workflow that currently takes too many jumps to understand and the artificial boundary to collapse.
- Consolidate only when at least one reader-visible hop disappears, or when caller-side branching, mapping, or pass-through code becomes simpler.
- After consolidation, the resulting file or module must still have one readable primary reason to exist.

## Execution rules

- Preserve behavior unless behavior change is explicitly requested.
- Keep the resulting seam easier to read than the starting point.
- Stay within one bounded work unit or cohesive local unit unless the current request explicitly broadens scope.
- Prefer one complete, meaningful merge or collapse at a time.
- Avoid replacing over-fragmentation with a new god file.
- Preserve existing dataflow and avoid unnecessary allocations, clones, or passes over the same data unless they clearly reduce complexity.
- Move ownership only when the caller gets simpler in a visible way.
- If consolidation reveals a real autonomous sub-seam, keep it near the owning seam by default; move it broader only when reuse, cross-feature ownership, or repository convention justifies it.
- Report likely bugs or behavior inconsistencies separately unless the current request explicitly asks for a behavior fix.

## Before finishing

Apply [structural-closure.md](structural-closure.md).

## Artifact updates

If the actual implementation changed understanding, also update:

- `Fragmentation pressure`
- `Target direction`
- `Decision notes`
