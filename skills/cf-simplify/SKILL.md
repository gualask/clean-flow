---
name: cf-simplify
description: Diagnose overengineering, file sprawl, unnecessary lifecycle complexity, and whether an area can be made substantially cleaner by simplifying behavior, UX, boundaries, or architecture. Use when the user is confused by too many files, asks whether everything is necessary, suspects overengineering, wants a large simplification refactor, or asks whether to remove/replace an over-complex design instead of polishing it.
---

Operate as a simplification reviewer before refactor execution.
Reduce decision noise, identify what complexity is real, and recommend the cleanest simplification path.

Do not implement code changes unless the user explicitly asks to apply the chosen simplification after the review.
For broad or multi-step execution, route to `cf-start` with a concrete recommended direction.

## Core Rules

- Treat repository state as the source of truth.
- Inspect the target area, its entry points, call sites, tests, and persistence or runtime boundaries before judging.
- Do not treat file count alone as overengineering.
- Do not treat existing behavior as sacred when the behavior itself is the main source of accidental complexity.
- Name the requirement or product behavior that makes each complex piece necessary.
- Prefer deleting a costly requirement, state machine, lifecycle, abstraction, or boundary over reorganizing it when that produces the cleanest result.
- Do not recommend a quick patch, cosmetic flattening, or file merge that leaves the same decision complexity hidden elsewhere.
- Separate behavior-preserving cleanup from behavior-changing simplification.
- If the best simplification changes UX or runtime behavior, say so plainly and ask for that decision before implementation.

## Workflow

### 1. Frame The Area

Identify the concrete area under review from the prompt. If no area is clear, ask one focused question.

Gather only enough evidence to answer:

- which files belong to the area
- where the area is entered from
- which files are tests, UI, state/lifecycle, persistence, backend, adapters, or shared glue
- which public behavior or user workflow the area supports
- whether current git changes alter the picture

Useful checks include file listing, line counts, targeted usage search, relevant file reads, and current worktree state.

### 2. Identify Complexity Drivers

Name the forces that require complexity. Common drivers:

- async, concurrent, or implicit lifecycle behavior
- retries, queues, batching, caching, debouncing, synchronization, or background work
- distributed state, persistence, or multiple sources of truth
- cross-process, cross-service, plugin, adapter, or frontend/backend contracts
- public API, data format, or backward-compatibility requirements
- validation, migration, permissions, error recovery, offline behavior, or observability
- framework, runtime, build, deployment, or test harness constraints

For each driver, decide whether it is:

- `required`: necessary for current behavior or contract
- `self-imposed`: caused by a product/UX/design choice that could be changed
- `accidental`: complexity that no longer earns its place
- `unknown`: needs one more targeted check

### 3. Classify The Files

Group files by necessity, not by folder:

- `essential`: directly owns required behavior
- `justified but expensive`: necessary only if the current behavior is kept
- `simplification target`: can disappear or shrink if a requirement changes
- `accidental`: wrapper, duplicate, stale layer, over-specific policy, or ceremony without clear ownership
- `uncertain`: not enough evidence yet

Be explicit about why each group exists. Avoid long inventories when a compact grouping is clearer.

### 4. Choose The Simplification Lever

Recommend the lever with the best complexity reduction:

- remove or relax a costly behavior
- make the user action explicit instead of implicit
- collapse an unnecessary lifecycle/state machine
- consolidate artificial boundaries
- split a dense owner only when it reveals real ownership
- keep current behavior and accept the current complexity when simplification would damage the product

For each serious option, state what code likely disappears, what behavior changes, and what risk remains.

### 5. Recommend A Path

Prefer one clear recommendation over a menu of equal choices.

Use this decision order:

1. If current behavior is valuable and complexity is proportionate, recommend keeping the design and only doing targeted cleanup.
2. If a behavior or UX choice creates most of the complexity and can reasonably change, recommend the behavior-changing simplification.
3. If the behavior should stay but the shape is accidental, recommend a behavior-preserving refactor route through `cf-start`.
4. If evidence is insufficient, ask for the smallest decision or inspection needed next.

## Output Format

Answer in the user's language.
Use direct, decision-oriented sections:

- **Verdict**: whether this is necessary complexity, likely overengineering, or mixed.
- **Evidence checked**: compact list of files/searches/commands inspected.
- **Complexity drivers**: the requirements or design choices creating the noise.
- **Necessity map**: what is essential, justified-but-expensive, simplification target, accidental, or uncertain.
- **Recommendation**: the preferred simplification path and why it gives real cleanup.
- **Alternatives**: 1-3 options with trade-offs.
- **Decision needed**: exactly one focused question when implementation requires a behavior, UX, or scope decision.

If the review leads to a refactor handoff, end with the exact route:

- `cf-start` for broad, ordered, resumable refactor work
- `cf-cohesion` for local regrouping of already-related files
- `cf-split` for one dense file with separable responsibilities
- `cf-cognitive` for local readability cleanup inside one file
