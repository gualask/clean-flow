---
name: cf-simplify
description: Diagnose overengineering, file sprawl, duplicated or parallel near-identical flows, unnecessary lifecycle complexity, and whether an area gets substantially cleaner by simplifying behavior, interface contracts, boundaries, or architecture. Use when the request questions whether files are necessary, suspects overengineering or duplication, wants a large simplification, or asks whether to remove/replace an over-complex design instead of polishing it.
---

Operate as a simplification reviewer before refactor execution.
Reduce decision noise, identify what complexity is real, and recommend the cleanest simplification path.

Do not implement code changes unless applying the chosen simplification is explicit in the current request.
For broad or multi-step execution, route to `cf-start` with a concrete recommended direction.

## Core Rules

- First bias to defeat: do not protect existing code from change. Integrating around the current shape to avoid touching it is how architecture rots; the cleanest target decides, and current code is inventory, not a constraint.
- Treat repository state as the source of truth: inspect the area, its entry points, call sites, tests, and persistence or runtime boundaries before judging.
- Treat request-stated constraints, risk appetite, and acceptable ceremony as decision inputs, not afterthoughts.
- Start from domain ownership, workflows, and external boundaries. Current folders, shared layers, global models, and barrels are evidence under review.
- Judge structural cost with references/navigation-cost.md; file count alone is not overengineering.
- Do not list a dirty low-impact path as a refactor alternative; if temporary containment is explicitly requested, label it as containment outside the cleanup recommendation.
- Treat false ownership, accidental boundaries, global glue, and catch-all buckets as cleanup targets; split directories or namespaces that only signal importance, reuse, or broad sharing unless the name already represents one stable role.
- Name the requirement or product behavior that makes each complex piece necessary. When criticizing a shared bucket or global surface, state where each criticized responsibility belongs before naming target folders.
- Prefer deleting a costly requirement, lifecycle, state machine, abstraction, or boundary over reorganizing it when that yields the cleanest result; behavior is not sacred when it is the main source of accidental complexity.
- Separate behavior-preserving cleanup from behavior-changing simplification, and the clean target shape from the staged migration route. Broad target shapes may be valid even when execution must be staged through `cf-start`.
- If the best simplification changes an interface contract or runtime behavior, say so plainly and ask for that decision before implementation.

## Workflow

### 1. Frame The Area

Identify the concrete area under review from the prompt. If no area is clear, ask one focused question.

If the framed area exceeds what one pass can credibly read and hold, split it into sub-areas and complete each verdict sequentially before starting the next. When the perimeter is effectively repository-level, route to `cf-start` assessment instead of stretching one pass.

Gather only enough evidence to answer:

- which files belong to the area, where it is entered from, and which public behavior or workflow it supports
- which role each file plays, and whether that role is local, boundary-facing, or shared
- which shared concepts, boundary representations, and organizing axis explain the area
- what constraints, non-goals, or acceptable ceremony the current request states
- whether current git changes alter the picture

### 2. Identify Complexity Drivers

When the request involves duplicated logic or parallel near-identical flows, read references/parallel-flows.md before classifying drivers; it owns the accidental-vs-essential divergence judgment.

Name the forces that require complexity: lifecycle or concurrency behavior, retries/queues/caching/background work, distributed state or persistence, cross-process or plugin contracts, compatibility requirements, validation/migration/permissions/recovery/observability, framework or harness constraints, and analogous project-specific forces.

For each driver, decide whether it is:

- `required`: necessary for current behavior or contract
- `self-imposed`: caused by a product, interface, or design choice that could be changed
- `accidental`: complexity that no longer earns its place
- `unknown`: needs one more targeted check

### 3. Classify The Files

Group files by necessity, not by folder:

- `essential`: directly owns required behavior
- `justified but expensive`: necessary only if the current behavior is kept
- `simplification target`: can disappear or shrink if a requirement changes
- `accidental`: wrapper, duplicate, stale layer, over-specific policy, or ceremony without clear ownership
- `uncertain`: not enough evidence yet

Classify shared models or cross-boundary representations by boundary role, not by current folder, type name, or generic layer label.
Prefer a compact grouping with reasons over a long inventory.

### 4. Choose The Simplification Lever

Recommend the lever with the best complexity reduction:

- remove or relax a costly behavior, or make an implicit action explicit
- collapse an unnecessary lifecycle or state machine
- consolidate artificial boundaries
- unify parallel near-duplicate flows behind one abstraction when their divergence is accidental, per references/parallel-flows.md
- replace a false global owner or barrel with explicit local owners and mapping only at real ownership boundaries
- split a dense owner only when it reveals real ownership
- keep current behavior and accept the complexity when simplification would damage the product

For each serious option, state what code likely disappears, what behavior changes, and what risk remains.
Always include the cleanest plausible option when evidence supports one.

### 5. Recommend A Path

Prefer one clear recommendation over a menu of equal choices, in this order:

1. Complexity is proportionate to valuable behavior: keep the design, do targeted cleanup only.
2. The boundary model itself is the problem: recommend the clean target shape and route broad execution through `cf-start` hard-restructure planning.
3. A changeable behavior or interface choice creates most of the complexity: recommend the behavior-changing simplification.
4. Behavior should stay but the shape is accidental: recommend a behavior-preserving refactor route through `cf-start`.
5. Evidence is insufficient: ask for the one focused decision or inspection needed next.

## Applying The Simplification

Only when applying the chosen simplification is explicit in the current request:

- Stay within the chosen lever; if the work widens beyond it, stop and return to recommendation.
- Before editing code, ensure you have read references/local-refactor-rules.md in this invocation.
- After moving, renaming, or deleting files or symbols, read references/reference-audit.md, then audit the touched names and paths.
- Run the smallest relevant check: targeted tests, typecheck or compile, lint, or a narrow smoke check; if none can run, say that explicitly.

## Output Format

Use direct, decision-oriented sections:

- **Verdict**: necessary complexity, likely overengineering, or mixed.
- **Evidence checked**: compact list of files/searches/commands inspected.
- **Complexity drivers**: the requirements or design choices creating the noise.
- **Necessity map**: the file classification with reasons.
- **Domain**: owner roles, organizing axis, and destinations for criticized shared buckets when architecture or packaging is the issue.
- **Recommendation**: the preferred simplification path and why it gives real cleanup.
- **Alternatives**: 1-3 clean options with trade-offs.
- **Decision needed**: exactly one focused question when implementation requires a behavior, interface, or scope decision.

If the review leads to a refactor handoff, end with the exact route:

- `cf-start` for broad, ordered, resumable refactor work
- `cf-cohesion` for local regrouping of already-related files
- `cf-split` for one dense file with separable responsibilities
- `cf-cognitive` for local readability cleanup inside one file
