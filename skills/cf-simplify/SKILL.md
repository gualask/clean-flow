---
name: cf-simplify
description: Diagnose overengineering, file sprawl, unnecessary lifecycle complexity, and whether an area can be made substantially cleaner by simplifying behavior, UX, boundaries, or architecture. Use when the current request questions whether files are necessary, suspects overengineering, wants a large simplification refactor, or asks whether to remove/replace an over-complex design instead of polishing it.
---

Operate as a simplification reviewer before refactor execution.
Reduce decision noise, identify what complexity is real, and recommend the cleanest simplification path.

Do not implement code changes unless applying the chosen simplification is explicit in the current request.
For broad or multi-step execution, route to `cf-start` with a concrete recommended direction.

## Core Rules

- Treat repository state as the source of truth.
- Inspect the target area, its entry points, call sites, tests, and persistence or runtime boundaries before judging.
- Treat request-stated constraints, risk appetite, and willingness to introduce boundaries or mapping as decision inputs, not as afterthoughts.
- Do not treat file count alone as overengineering.
- Do not treat existing behavior as sacred when the behavior itself is the main source of accidental complexity.
- Do not treat existing folders, global models, barrels, or shared layers as constraints when they may be the accidental complexity under review.
- Recommend the cleanest evidence-backed shape by default, not the easiest or lowest-churn workaround.
- Do not choose a workaround that preserves false ownership, accidental boundaries, or global glue just because it minimizes immediate code movement.
- Do not list a dirty low-impact path as a refactor alternative. If explicit temporary containment is requested, label it as containment outside the cleanup recommendation.
- For architecture or shared-layer reviews, identify ownership, boundary roles, and organizing axis before proposing packaging; define project-specific architectural terms only when relying on them.
- Name the requirement or product behavior that makes each complex piece necessary.
- Prefer deleting a costly requirement, state machine, lifecycle, abstraction, or boundary over reorganizing it when that produces the cleanest result.
- Do not recommend a quick patch, cosmetic flattening, or file merge that leaves the same decision complexity hidden elsewhere.
- Separate behavior-preserving cleanup from behavior-changing simplification.
- Separate the clean target shape from the safe migration route. Broad target shapes may be valid even when execution must be staged through `cf-start`.
- If the best simplification changes UX or runtime behavior, say so plainly and ask for that decision before implementation.

## Workflow

### 1. Frame The Area

Identify the concrete area under review from the prompt. If no area is clear, ask one focused question.

Gather only enough evidence to answer:

- which files belong to the area
- where the area is entered from
- which role each file plays in the area, and whether that role is local, boundary-facing, or shared
- which public behavior or workflow the area supports
- which shared concepts, boundary representations, re-export surfaces, and organizing axis explain the area
- what constraints, risk appetite, non-goals, or acceptable ceremony the current request states
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

For shared models or cross-boundary representations, classify by boundary role, not current folder, type name, or generic layer label.

Be explicit about why each group exists. Avoid long inventories when a compact grouping is clearer.

### 4. Choose The Simplification Lever

Recommend the lever with the best complexity reduction:

- remove or relax a costly behavior
- make the action explicit instead of implicit
- collapse an unnecessary lifecycle/state machine
- consolidate artificial boundaries
- replace a false global owner or barrel with explicit local owners and boundary mapping
- move models to their real owners and add mappers only at real ownership boundaries
- split a dense owner only when it reveals real ownership
- keep current behavior and accept the current complexity when simplification would damage the product

For each serious option, state what code likely disappears, what behavior changes, and what risk remains.
Always include the cleanest plausible option if evidence supports one. Do not limit alternatives to the lowest-churn paths.

### 5. Recommend A Path

Prefer one clear recommendation over a menu of equal choices.

Use this decision order:

1. If current behavior is valuable and complexity is proportionate, recommend keeping the design and only doing targeted cleanup.
2. If the current boundary model is part of the problem, recommend the clean target shape and route broad execution through `cf-start` hard-restructure planning.
3. If a behavior or UX choice creates most of the complexity and can reasonably change, recommend the behavior-changing simplification.
4. If the behavior should stay but the shape is accidental, recommend a behavior-preserving refactor route through `cf-start`.
5. If evidence is insufficient, ask for one focused decision or inspection needed next.

## Output Format

Use direct, decision-oriented sections:

- **Verdict**: whether this is necessary complexity, likely overengineering, or mixed.
- **Evidence checked**: compact list of files/searches/commands inspected.
- **Complexity drivers**: the requirements or design choices creating the noise.
- **Necessity map**: what is essential, justified-but-expensive, simplification target, accidental, or uncertain; include owner roles and organizing axis when shared representations are the issue.
- **Recommendation**: the preferred simplification path and why it gives real cleanup.
- **Alternatives**: 1-3 clean options with trade-offs; do not include dirty low-impact workarounds as refactor alternatives.
- **Decision needed**: exactly one focused question when implementation requires a behavior, UX, or scope decision.

If the review leads to a refactor handoff, end with the exact route:

- `cf-start` for broad, ordered, resumable refactor work
- `cf-cohesion` for local regrouping of already-related files
- `cf-split` for one dense file with separable responsibilities
- `cf-cognitive` for local readability cleanup inside one file
