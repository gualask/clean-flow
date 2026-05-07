# Split Execution

## Preflight

Use standard phase preflight.
Without a brief, require explicit local behavior-preserving scope.
- If there is no credible safety lock for the current structural move, stop and route to safety-net first.
- If the seam is still not mapped enough to name the hidden workflows, role classification, and safe split direction, stop and route to concentration-map instead of guessing.

## Goal

Apply the current bounded work unit or cohesive local unit without widening scope.

Concentration pressure has a clear split direction when:

- one place hides multiple workflows or roles
- orchestration, integration, policy, or pure logic are tangled enough to slow reading
- a caller must understand too much local detail to follow the main behavior
- the seam is mapped well enough to name what moves and what stays

Do not split just because a file is large. If the new boundary would be generic, speculative, or harder to follow than the current code, leave it alone or route back to mapping.

## Split criteria

- Before splitting, name the workflow that should stay visible and the responsibility currently hiding it.
- Split only when the caller, entry point, or main workflow becomes visibly simpler, or when the moved responsibility gets a real local owner.
- If callers still need the same branching, mapping, or integration detail after the split, the boundary did not reduce pressure.
- Do not treat "one file became two files" as completion by itself. The extracted owner must have a clearer home, a clearer name, or a clearer local workflow than the original inline block.

## Placement criteria

When this step creates or relocates files, ensure you have read [file-split-rules.md](../../_shared/references/file-split-rules.md) in this invocation before choosing placement.
If placement is still not obvious, ask one focused question before editing.

## Execution rules

- Preserve behavior unless behavior change is explicitly requested.
- Stay within one bounded work unit or cohesive local unit unless the current request explicitly broadens scope.
- Make the narrowest complete structural move that gives a responsibility a clearer home.
- Add a file, module, type, or helper only when it reduces real complexity.
- Preserve existing dataflow and avoid extra allocations, clones, or passes unless they clearly improve the seam.
- Prefer local, named ownership over generic utilities or fake layers; avoid names like `helper`, `utils`, `common`, `shared`, `manager`, or `service` unless local convention gives them clear meaning.
- If the safety lock breaks after a move, stop and investigate before stacking more changes on top.
- If the implementation changes what the brief assumed, record the drift.
- Report discovered bugs separately unless the current request explicitly asks for a behavior fix.

## Post-change closure check

Before declaring the unit complete, re-read the changed entry point, extracted files, containing directory, imports/exports, and relevant tests.

Ask these questions after the code compiles, not only before editing:

- Did the main workflow become easier to scan, or did the change only move bulk into a new file?
- Does each new file have one stable local reason to exist?
- Are private companion files grouped with their owner instead of advertised as broadly reusable peers?
- Did the split reveal another natural capability inside the same touched area?
- Would that revealed capability be a small continuation of this same bounded unit, or a separate follow-up unit?

If the answer reveals a clear placement fix caused by this split, apply it in this execution step when it is behavior-preserving and unambiguous.
If the answer reveals another natural split that is still inside the same bounded unit and safety net, either apply it now or record the exact remaining split as real follow-up work.
If the remaining split would widen scope, needs a new safety lock, or changes the intended unit, leave it for a new work unit and record it in `Remaining`, `Next action`, and `.cflow/refactor-brief.md`.
Do not return `Next action: none` while a clear structural follow-up remains in the touched area.

## Before finishing

Apply [structural-closure.md](structural-closure.md).

## Artifact updates

If the actual implementation changed understanding, also update:

- `Concentration pressure`
- `Target direction`
- `Decision notes`
