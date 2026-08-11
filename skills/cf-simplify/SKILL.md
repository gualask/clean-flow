---
name: cf-simplify
description: Diagnose overengineering in software implementation. Use when a request asks whether implementation structure or behavior should be removed, consolidated, or replaced to make the codebase substantially simpler. Do not use for non-code content or local readability cleanup; route repository-wide restructuring to cf-start and local code readability work to cf-cognitive.
---

Operate as a simplification reviewer.
Reduce decision noise, identify what complexity is real, and recommend the cleanest simplification path.

Do not implement code changes unless applying the chosen simplification is explicit in the current request.

## Workflow

### 1. Frame The Area

Identify the concrete area under review from the prompt. If no area is clear, ask one focused question.

When the perimeter is effectively repository-level, do not deliver the analysis here. Answer with one question naming 2-4 candidate lenses and a recommended default, and name `cf-start` as where the confirmed frame goes.

Gather only enough evidence to answer:

- which files belong to the area, where it is entered from, and which public behavior or workflow it supports
- which role each file plays, and whether that role is local, boundary-facing, or shared
- which shared concepts, boundary representations, and organizing axis explain the area
- what constraints, non-goals, or acceptable ceremony the current request states
- whether current git changes alter the picture

### 2. Identify Complexity Drivers

[references/parallel-flows.md](references/parallel-flows.md) is how to tell an accidental divergence from an essential one, and what shape a consolidation may take. Read it before classifying drivers whenever the area holds duplicated logic or near-identical parallel flows. Read it every time that is true, including when the divergence looks obviously essential.

Name the forces that require complexity: lifecycle or concurrency behavior, retries/queues/caching/background work, distributed state or persistence, cross-process or plugin contracts, compatibility requirements, validation/migration/permissions/recovery/observability, framework or harness constraints, and analogous project-specific forces.

For each driver, decide whether it is:

- `required`: necessary for current behavior or contract
- `self-imposed`: caused by a product, interface, or design choice that could be changed
- `obsolete`: complexity that no longer earns its place
- `uncertain`: needs one more targeted check

### 3. Classify Units Of Necessity

Group by necessity, not by folder. A unit of necessity may be a file, but also a field, a lifecycle, a projection, or one responsibility spread across several files:

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
- unify parallel near-duplicate flows behind one abstraction when their divergence is accidental
- replace a false global owner or barrel with explicit local owners and mapping only at real ownership boundaries
- split a dense owner only when it reveals real ownership
- keep current behavior and accept the complexity when simplification would damage the product

For each serious option, state what code likely disappears and what risk remains.
Always include the cleanest plausible option when evidence supports one.

### 5. Recommend A Path

Prefer one clear recommendation over a menu of equal choices, in this order:

1. Complexity is proportionate to valuable behavior: keep the design, do targeted cleanup only.
2. The boundary model itself is the problem: recommend the clean target shape and hand off broad execution.
3. A changeable behavior or interface choice creates most of the complexity: recommend the behavior-changing simplification.
4. Behavior should stay but the shape is accidental: recommend a behavior-preserving refactor and hand off its execution.
5. Evidence is insufficient: ask for the one focused decision or inspection needed next.

## Applying The Simplification

Only when applying the chosen simplification is explicit in the current request:

[references/navigation-cost.md](references/navigation-cost.md) owns the hard triggers, the named exemptions that excuse one, and the rule keeping a finding alive when its remedy sits outside the authorized scope. Read it before the first edit of the pass. Read it every time, including when the chosen lever looks too narrow for any trigger to fire.

- Stay within the chosen lever; if the work widens beyond it, stop and return to recommendation.
- Apply the report/action separation when a hard trigger's remedy falls outside the chosen lever.
- Before editing code, ensure you have read references/local-refactor-rules.md in this invocation.
- After moving, renaming, or deleting files or symbols, read references/reference-audit.md, then audit the touched names and paths.
- Run the smallest relevant check: targeted tests, typecheck or compile, lint, or a narrow smoke check; if none can run, say that explicitly.

## Output Format

Use direct, decision-oriented sections:

- **Verdict**: necessary complexity, likely overengineering, or mixed.
- **Evidence checked**: compact list of files/searches/commands inspected.
- **Complexity drivers**: the requirements or design choices creating the noise.
- **Requirement pressure**: name the one or two behaviours whose existence costs the most structure here, and for each state what code disappears if the product drops it and what the user loses. Behaviours, not files. Do not decide: the trade is the user's. Answer `none` only after naming the expensive behaviours and saying which requirement each one holds up.
- **Necessity map**: the units of necessity with reasons, named as what each one is rather than as the file it happens to live in.
- **Domain**: owner roles, organizing axis, and destinations for criticized shared buckets when architecture or packaging is the issue.
- **Recommendation**: the preferred simplification path, staged as cautiously as the request needs, and why it gives real cleanup. When the structure is justified but a unit inside the area is still expensive to read or to locate a bug in, name that unit and route it to `cf-cognitive`; the reading-cost verdict is not made here.
- **Behaviour delta**: split the recommendation into what preserves observable behaviour and what changes it, item by item. Observable means visible to a user, a caller, a persisted format, or a contract. Answer `all behaviour-preserving` only after naming the observable surfaces you checked.
- **Alternatives**: 1-3 clean options with trade-offs.
- **Decision needed**: exactly one focused question when implementation requires a behavior, interface, or scope decision. When the preferred simplification changes an interface contract or runtime behavior, say that plainly here and ask for the decision before implementation.

When the simplification was applied in this pass, also return:

- **Changes**: edits made.
- **Checks**: commands run and pass/fail result, or why no check ran.
- **Deferred**: only when the canonical report/action rule applies; use the finding content required by references/navigation-cost.md.

If the review leads to a refactor handoff, end with the exact route:

- `cf-start` for broad, ordered, resumable refactor work; hand off with a concrete recommended direction
- `cf-cohesion` for local regrouping of already-related files
- `cf-split` for one dense file with separable responsibilities
- `cf-cognitive` for local readability cleanup inside one file
