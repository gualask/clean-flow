---
name: cf-start
description: Assess, plan, execute, review, verify, or resume behavior-preserving cleanup and refactor work in Cflow. Use for repository-level cleanup/refactor workflows, bounded work units, artifact-backed resume from existing `.cflow` state, and progress review or verification.
---

Operate as the workflow controller: load and run the relevant phase reference when the next phase is clear from repository state and Cflow artifacts.

## Artifacts

- `.cflow/architecture.md`: input only; owned by `cf-architecture`.
- `.cflow/refactor-brief.md`: owned here; when creating or updating it, use [artifacts.md](references/artifacts.md).

Before creating an owned `.cflow/*` artifact, if `.cflow/` does not exist, create it and add `.cflow/` to `.gitignore`, creating `.gitignore` if needed.

## Preflight

1. Read existing `.cflow/architecture.md` and `.cflow/refactor-brief.md`.
2. Check repository state relevant to the current request and artifacts.
3. Treat the repository as the source of truth.
4. When the user questions whether a recorded completed unit is really finished, treat the brief as historical evidence, not as the closure verdict.

## Flow Selection

Choose the first matching flow below. User-facing output is a progress summary, not a brief mirror.

### Handoff Flow

Use when the request belongs to another public entrypoint before Cflow workflow work; do not create or update `.cflow/refactor-brief.md` during handoff.

- `cf-mr-wolf`: problem, goal, success criteria, scope boundary, or explicit non-goals are not clear enough for repository-level intervention framing. State the missing framing answer and the checked evidence source that failed to provide it.
- `cf-simplify`: the request asks whether an area is overengineered, whether all files are necessary, or whether changing behavior, UX, or boundaries could make a cleaner simplification possible before planning refactor work.
- `cf-trace`: the request asks only to reconstruct or audit a path, workflow, sequence, state transition, or orchestration flaw before deciding on fixes.
- `cf-cognitive`, `cf-split`, or `cf-cohesion`: the request asks only for local cognitive cleanup, one file-level split, or local cohesion regrouping.
- `cf-architecture`: `.cflow/architecture.md` is missing, stale, or materially incomplete.

### Fresh Assessment Flow

Use when there is no live brief, the task looks new, or repository-level intervention framing is still needed.
Run [assessment.md](references/assessment.md), do not implement, and stop at a decision checkpoint for non-trivial fresh work even when the recommendation is clear.

At the checkpoint:

- if the user replies with short approval and no new steering, continue with the proposed path
- if the user asks a factual question that does not affect the path, answer briefly and continue only when the next step is still clear
- if the user gives steering that materially changes scope, exclusions, invariants, risk appetite, direction, or whether to continue, reassess before proceeding and update `.cflow/refactor-brief.md` when resumable state matters
- if steering reopens problem framing enough to match the `cf-mr-wolf` rule, use the handoff flow

A reply is non-trivial when it may materially change scope, exclusions, invariants, risk appetite, direction, or whether to continue.
Do not implement while a material decision is open.

Use the assessment output format and end with exactly one decision checkpoint question.

### Resume Flow

Use when there is a live `.cflow/refactor-brief.md` and the request asks to resume, continue, proceed, or inspect current Cflow work.
Resume is not a phase; re-enter the correct flow using the brief and repository evidence.

- if the brief is stale, or repository changes made the recorded path or work-unit state unreliable, reassess
- if hard-path direction is chosen but target shape is unresolved, use the hard restructure flow
- if `current work unit` is `none` and there are multiple credible candidates, dependency or order decisions, cross-boundary scope, or resumable multi-step work, use the soft refactor flow
- if `current work unit` is `none` but the prompt or brief gives one explicit, local, behavior-preserving cohesive unit, use the structural unit flow
- if an active work unit exists, use the structural unit flow
- if structural work is already done, use the review or verify flow

Do not silently switch direction without updating artifacts.
Do not execute more than one cohesive bounded unit per invocation unless the user explicitly asked for a broader pass.

Default resume progress output: **Done**, **Checks**, **Artifacts**, **Remaining**, **Next action**.
For reassessment without code changes: **Current state**, **Reassessment result**, **Artifacts**, **Next action**.

### Soft Refactor Flow

Use when assessment or resume points to soft-split, soft-consolidate, or soft-mixed work.
Use [work-unit-planning.md](references/work-unit-planning.md) when there are multiple credible units, ordering decisions, cross-boundary scope, or resumable multi-step work.

Treat `soft-mixed` as a repository-level assessment outcome, not as one executable step.
In `soft-mixed`, select the next work unit by local dominant pressure and give each work unit exactly one `mode`: `split` or `consolidate`.
Do not split one coherent local cleanup into multiple work units just to make the units smaller.

When the prompt or brief already names one explicit, local, behavior-preserving structural unit whose goal and boundary are clear, use the structural unit flow instead of adding a separate planning pass.

### Hard Restructure Flow

Use when assessment or resume points to hard-restructure work.
Resolve target direction with [target-shape.md](references/target-shape.md), then plan bounded migration units with [migration-unit-planning.md](references/migration-unit-planning.md).

Do not execute hard-path structural edits before target direction and migration units are clear.
After one migration unit is selected, use the structural unit flow.

### Structural Unit Flow

Use when one active bounded unit is selected or explicit.
Map unresolved split pressure with [concentration-map.md](references/concentration-map.md) or consolidation pressure with [fragmentation-map.md](references/fragmentation-map.md).
Choose the behavior lock with [safety-net.md](references/safety-net.md) before structural edits.
Execute by declared mode: `split` uses [split-execution.md](references/split-execution.md); `consolidate` uses [consolidation-execution.md](references/consolidation-execution.md).
[local-simplify.md](references/local-simplify.md) is optional after structural execution and only for the recently touched area.

Do not jump from initial assessment directly into mapping or execution unless the next cohesive local unit is explicit in the brief or prompt.
After structural work, use the review or verify flow.

### Review Or Verify Flow

Use when the request explicitly asks for review or verification, challenges whether a recorded completed unit is really finished, or structural work is done.
Use [review.md](references/review.md) for closure judgment and [verify.md](references/verify.md) for factual checks.
Do not use generic reassessment output for closure challenges; use the review output format.

## Language rules

- Use the user's language for conversational output.
- Use the repository's dominant documentation language for `.cflow/architecture.md` and `.cflow/refactor-brief.md`.
- If the repository has no dominant documentation language, use the user's language for those artifacts too.
