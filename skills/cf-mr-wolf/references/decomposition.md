# cf-mr-wolf Decomposition

Use decomposition only when the framed request is too broad for one focused evidence pass.
The slice map is an investigation map, not an implementation plan.

## Direct Pass

Skip decomposition when the request is already one concrete unit:

- one path, command, screen, API, component, module, file cluster, or candidate finding
- one narrow quality question
- one local action that can be checked cheaply

Record briefly why a direct pass is enough when notes are used.

## Slice Map

Create 3-7 compact slices when the request spans multiple flows, modules, boundaries, states, or quality lenses.
For each slice, record only what helps choose or run the next evidence pass:

- id and short name
- status: `pending`, `in-progress`, `done`, `blocked`, `deferred`, `out-of-scope`, or `routed`
- boundary or entrypoint, if known
- evidence question
- evidence class: `behavioral`, `static-signal`, `detector`, `process`, or `mixed`
- scope reason and explicit exclusions
- best next lens: local evidence, `cf-scenario`, or another specialist skill

Keep behavioral slices separate from detector/static/process slices unless the slice intentionally checks whether the signal has real behavioral impact.

## Routing During Decomposition

- When entrypoints, ownership, or boundaries are too unclear to slice credibly, orient locally: run `scripts/repo-tree.mjs` for a gitignore-aware tree with approximate LOC, then read the few files it points to. No skill owns repository mapping.
- Use `cf-scenario` when a concrete example would clarify impact before deeper evidence.
- When a slice depends on ordered workflow behavior, state, failure, resume, external effects, or ownership, gather that evidence locally: no skill owns path reconstruction.

Analyze slices sequentially unless the user explicitly authorized broader agent use and the runtime supports it.
Do not present a completed broad handoff while in-scope slices are still `pending` or `in-progress`.
