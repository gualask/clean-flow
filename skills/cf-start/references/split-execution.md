# Split Execution

Use this to apply one bounded **split-oriented** cleanup step.

## Preflight

- Require current `.cflow/architecture.md`; if missing, stop and route to `cf-architecture`.
- Read architecture plus existing `.cflow/refactor-brief.md`.
- Without a brief, continue only with an explicit, local, behavior-preserving scope; otherwise route to `cf-start` or the correct Cflow phase.
- If there is no credible safety lock for the current structural move, stop and route to safety-net first.
- If the seam is still not mapped enough to name the hidden workflows, role classification, and safe split direction, stop and route to concentration-map instead of guessing.
- Re-check the touched area and treat repository state as the source of truth.

## Goal

Apply the current bounded work unit or cohesive local unit without widening scope.

Use this when **concentration pressure** has a clear split direction:

- one place hides multiple workflows or roles
- orchestration, integration, policy, or pure logic are tangled enough to slow reading
- a caller must understand too much local detail to follow the main behavior
- the seam is mapped well enough to name what moves and what stays

Do not split just because a file is large. If the new boundary would be generic, speculative, or harder to follow than the current code, leave it alone or route back to mapping.

## Split criteria

- Before splitting, name the workflow that should stay visible and the responsibility currently hiding it.
- Split only when the caller, entry point, or main workflow becomes visibly simpler, or when the moved responsibility gets a real local owner.
- If callers still need the same branching, mapping, or integration detail after the split, the boundary did not reduce pressure.

## Placement criteria

When this step creates or relocates files, ensure you have read [../../_shared/references/file-split-rules.md](../../_shared/references/file-split-rules.md) in this invocation before choosing placement.
If placement is still not obvious, ask one focused question before editing.

## Execution rules

- Preserve behavior unless behavior change is explicitly requested.
- Stay within one bounded work unit or cohesive local unit unless the user explicitly broadens scope.
- Make the smallest structural move that gives a responsibility a clearer home.
- Add a file, module, type, or helper only when it reduces real complexity.
- Preserve existing dataflow and avoid extra allocations, clones, or passes unless they clearly improve the seam.
- Prefer local, named ownership over generic utilities or fake layers; avoid names like `helper`, `utils`, `common`, `shared`, `manager`, or `service` unless local convention gives them clear meaning.
- If the safety lock breaks after a move, stop and investigate before stacking more changes on top.
- If the implementation changes what the brief assumed, record the drift.
- Report discovered bugs separately unless the user explicitly asked for a behavior fix.

## Before finishing

Run at least one relevant verification from this list when one is available:

- targeted tests
- lint
- typecheck
- build
- narrow smoke check

If no relevant verification is available, say that explicitly in `Checks run` or `What remains`.

If you moved, renamed, split, or re-exported symbols, ensure you have read [../../_shared/references/reference-audit.md](../../_shared/references/reference-audit.md) in this invocation, then run that audit for the touched names and paths.

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
- `Decision notes`
