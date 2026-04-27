# cf-start Routing Reference

Use this reference when the prompt is ambiguous, when fresh assessment needs the full decision rules, or when resume needs an exact routing choice.
Ensure this reference has been read in the current invocation before finalizing any non-trivial fresh assessment path, and before resume routing whenever the next phase is not already obvious from an active current work unit.

## Intent inference

Use these modes:

- `cf-mr-wolf-handoff`
- `cf-trace-handoff`
- `assessment-only`
- `assessment-then-checkpoint`
- `resume-existing-work`
- `review-or-verify`

Heuristics:

- If there is no live brief or the task looks new, start with assessment.
- If the request asks to clarify, shape, design, de-risk, or spec an unclear problem before implementation, route to `cf-mr-wolf`.
- If the request asks only to reconstruct or audit a path, workflow, sequence, state transition, or orchestration flaw before deciding on fixes, route to `cf-trace`.
- If the request asks only for local cognitive cleanup, one file-level split, or local cohesion regrouping, route to `cf-cognitive`, `cf-split`, or `cf-cohesion` instead of starting repository-level assessment.
- If Cflow cannot yet answer what problem the refactor solves, what success looks like, or what is explicitly out of scope from the repo and conversation, route to `cf-mr-wolf` before creating or updating Cflow artifacts.
- A `cf-mr-wolf-handoff` must identify the missing framing answer and cite the checked source that failed to answer it: user request, repository evidence, `.cflow/architecture.md`, or `.cflow/refactor-brief.md`.
- If there is a live brief and the user says resume / continue / proceed, resume from the correct phase.
- If the user explicitly asks only for review or verification, bootstrap or refresh prerequisites first and then route internally to that mode.
- For non-trivial fresh work, default to `assessment-then-checkpoint`.

## Fresh assessment details

Determine:

- whether intervention is justified
- candidate intervention areas worth tracking in the brief
- dominant pressure: concentration | fragmentation | mixed | neither
- intervention mode: soft-split | soft-consolidate | soft-mixed | hard-restructure | no-structural-refactor

Rules:

- Use `cf-architecture` whenever `.cflow/architecture.md` is missing, stale, or materially incomplete.
- Use `cf-mr-wolf` whenever the upstream problem is still too ambiguous to justify repository-level intervention framing.
- Use `cf-trace` whenever the current blocker is understanding whether one path, workflow, sequence, state transition, or orchestration contract is flawed.
- Use the assessment phase when repository-level intervention framing is still needed after architecture context is current.
- Use `artifacts.md` when non-trivial work needs durable handoff state.
- Treat `soft-mixed` as a repository-level outcome, not as one executable step.
- In `soft-mixed`, break work into bounded work units only when there is more than one cohesive intervention; assign each work unit exactly one `mode`: `split` or `consolidate`.
- Do not split one coherent local cleanup into multiple work units just to make the units smaller.
- For lightweight paths, use the local fast lane when the next cohesive local unit is explicit, local, low-risk, behavior-preserving, and already clear enough to map, lock, or execute.
- Otherwise use work-unit planning before local mapping or execution.
- For hard restructure, use target-shape planning first, then migration-unit planning.
- Do not implement yet.
- Follow the `cf-start` decision checkpoint rule before execution.

## Detailed resume routing

Resume from the correct point:

- if `.cflow/architecture.md` is missing, stale, or materially incomplete -> `cf-architecture`
- if the brief is stale, or repository changes made the recorded path or work-unit state unreliable -> reassessment
- if repository-level intervention framing is still unclear -> assessment phase
- if hard-path direction is chosen but target shape is still unresolved -> `target-shape.md`
- if hard-path direction is confirmed but migration units are not yet planned -> `migration-unit-planning.md`
- if `current work unit` is `none` and there are multiple credible candidates, dependency/order decisions, cross-boundary scope, or resumable multi-step work -> `work-unit-planning.md`
- if `current work unit` is `none` but the prompt or brief gives one explicit, local, behavior-preserving cohesive unit -> continue by mapping, locking, or executing that unit instead of forcing planning
- if an active work unit is selected but not ready -> `concentration-map.md`, `fragmentation-map.md`, or `safety-net.md`
- if an active work unit is ready for structural work -> execute by its declared mode:
  - `split` -> `split-execution.md`
  - `consolidate` -> `consolidation-execution.md`
- if structural work is already done -> `review.md` or `verify.md` based on whether judgment or factual closure is needed

Rules:

- In `soft-mixed`, select the next work unit by local dominant pressure and use that unit's declared mode.
- Do not jump from lightweight assessment directly into local mapping or execution unless the next cohesive local unit is already explicit in the brief or prompt.
- Do not silently switch direction without updating the brief through `artifacts.md`.
- Do not execute more than one cohesive bounded unit per invocation unless the user explicitly asked for a broader pass.
