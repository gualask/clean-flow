# Split Execution

## Required Inputs

- live brief or explicit local behavior-preserving scope
- credible safety lock
- mapped seam with workflows, roles, and split direction

If required inputs are missing, stop with `Next action: complete mapping or safety net first`.
- If there is no credible safety lock for the current structural move, stop and route to safety-net first.
- If the seam is not mapped enough to name workflows, roles, and split direction, route to concentration-map.

## Goal

Apply one bounded unit without widening scope.

Split when:

- one place hides multiple workflows or roles
- roles are tangled enough to slow reading
- callers must know too much local detail
- what moves and what stays is clear

Do not split just because a file is large. If the new boundary would be generic, speculative, or harder to follow than the current code, leave it alone or route back to mapping.

## Split criteria

- Name the visible workflow and the responsibility hiding it.
- Split only when the caller/workflow gets simpler or moved code gets a real owner.
- If callers still need the same branching/mapping/integration detail, pressure did not drop.
- "One file became two" is not completion. The new owner needs a clearer home, name, or workflow.

## Placement criteria

Before creating or moving files, read references/file-split-rules.md. If placement is unclear, ask one focused question.

## Execution rules

- Preserve behavior unless behavior change is explicitly requested.
- Stay within one bounded unit unless the request broadens scope.
- Make the narrowest complete move that gives a responsibility a clearer home.
- Add a file, module, type, or helper only when it reduces real complexity.
- Preserve dataflow; avoid extra allocations, clones, or passes unless they clearly improve the seam.
- Prefer local named ownership over generic utilities or fake layers.
- Avoid `helper`, `utils`, `common`, `shared`, `manager`, or `service` unless local convention gives clear meaning.
- If the safety lock or a relevant check breaks, stop editing and apply references/regression-handling.md before any further change.
- If the implementation changes what the brief assumed, record the drift.
- Report bugs separately unless behavior fixes were requested.

## Post-change closure check

Before completion, re-read changed entry points, extracted files, containing directory, imports/exports, and tests.

After compile/checks, ask:

- Did the main workflow become easier to scan, or did the change only move bulk into a new file?
- Does each new file have one stable local reason to exist?
- Are private companion files grouped with their owner instead of advertised as broadly reusable peers?
- Did the split reveal another capability in the same touched area?
- Is it same-unit continuation or separate follow-up?

Apply clear placement fixes caused by this split when behavior-preserving.
Apply or record same-unit follow-up covered by the same safety net.
If follow-up widens scope, needs new safety, or changes the unit, record it for a new unit.
Do not return `Next action: none` while a clear structural follow-up remains in the touched area.

## Before finishing

Apply structural-closure.md.

## Artifact updates

If the actual implementation changed understanding, also update:

- `Concentration pressure`
- `Target direction`
- `Decision notes`
