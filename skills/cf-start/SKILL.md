---
name: cf-start
description: Main public workflow entrypoint for Cflow. Use to start or resume cleanup and refactor work, bootstrap `.cflow/refactor-brief.md`, evaluate concentration and fragmentation pressure, and stop at an alignment checkpoint before non-trivial execution.
---

This is the main public workflow entrypoint for the pack.
`cf-architecture-map` is also a supported public entrypoint, but only for standalone repository mapping.
Do not tell the user to invoke internal skills directly.
Internal workflow skills are still valid workflow steps when the repository state already fits them.
Do not behave like a router that only suggests another skill.
When the next phase is already clear from repository state and Cflow artifacts, advance into it yourself instead of only suggesting it.

## Goal

Handle fresh assessment, artifact-backed resume, or review/verify re-entry through `cf-start`.

For fresh work after assessment and alignment:

- local fast lane may skip work-unit planning when the scope is explicit, local, low-risk, behavior-preserving, and already has one cohesive stop condition
- lightweight cleanup or refactor must enter `cf-internal-work-unit-planning` before local mapping or execution when there are multiple credible candidates, dependency/order decisions, cross-boundary scope, or resumable multi-step work
- hard-path restructuring must enter `cf-internal-target-shape` and then `cf-internal-migration-unit-planning` before implementation

## Hard rule

For non-trivial fresh work, always stop at an **alignment checkpoint** after the initial assessment.
Do this even when you already have a recommendation.

At the checkpoint:

- if the user replies with simple confirmation only, continue with the proposed path
- if the user gives any non-trivial reply, switch into brainstorming first

Simple confirmation means short approval with no new steering.
Any doubt, question, reassurance request, scope change, risk concern, or direction change counts as a non-trivial reply and must enter brainstorming.

## Language rules

- Use the user's language for conversational output.
- Use the repository's dominant documentation language for `.cflow/architecture.md` and `.cflow/refactor-brief.md`.
- If the repository has no dominant documentation language, use the user's language for those artifacts too.

## Preflight

1. Read `.cflow/architecture.md` if it exists.
2. Read `.cflow/refactor-brief.md` if it exists.
3. Re-check the repository state.
4. Treat the repository as the source of truth.

## Reference map

Ensure you have read these references in this invocation when their trigger condition is met:

- Ensure you have read [references/routing.md](references/routing.md) before choosing the entry mode when assessment vs resume vs review-or-verify is not trivially obvious from the prompt and repository state.
- Ensure you have read [references/routing.md](references/routing.md) before finalizing the proposed path for any non-trivial fresh assessment.
- Ensure you have read [references/routing.md](references/routing.md) before resume routing whenever the next phase is not already obvious from an active current work unit.
- Ensure you have read [references/artifacts.md](references/artifacts.md) before creating or refreshing `.cflow/refactor-brief.md`, or deciding which brief fields must be updated.

Use `assets/refactor-brief.template.md` as the source template whenever brief bootstrap is required.

## Fresh assessment

Use [references/routing.md](references/routing.md) for intent inference, fresh assessment details, and path selection.

At a high level:

1. ensure architecture context is current
2. assess repository-level intervention pressure
3. apply concentration and fragmentation lenses
4. frame the proposed path
5. update artifacts when needed

Do not implement during fresh assessment.
Always end non-trivial fresh assessment at the alignment checkpoint with exactly one focused question.

## Resume

Resume is not a phase. Re-enter the correct phase using the brief and the repository.

Use the brief, repository state, and [references/routing.md](references/routing.md) to resume from the correct phase.
Do not silently switch direction without updating artifacts.
Do not execute more than one cohesive bounded unit per invocation unless the user explicitly asked for a broader pass.

## Output rules

User-facing output is a progress summary, not a brief mirror.
Keep durable state in `.cflow/refactor-brief.md`.
Return only the relevant format below.

### For fresh assessment
Return only:

- **Repository assessment**: the intervention decision and the evidence that matters.
- **Pressure**: concentration, fragmentation, mixed, or none.
- **Proposed path**: the recommended path and why.
- **Artifacts**: created or updated files, one line.
- **Alignment checkpoint**: exactly one focused question.

End with exactly one focused question.

### For execution or resume progress
Return only:

- **Done**: what changed in code or assessment.
- **Checks**: commands run and pass/fail result.
- **Artifacts**: created or updated files, one line.
- **Remaining**: only blockers, risks, or real follow-up work.
- **Next action**: one immediate action or `none`.

### For reassessment without code changes
Return only:

- **Current state**: one sentence.
- **Reassessment result**: the decision and why.
- **Artifacts**: created or updated files, one line.
- **Next action**: one immediate action or `none`.

## Artifact update baseline

Do not create or refresh `.cflow/architecture.md` directly in this skill.
Use `cf-architecture-map` when the architecture map is missing or stale.

If `.cflow/refactor-brief.md` exists or is created, update the fields required by [references/artifacts.md](references/artifacts.md).

- In `Execution state`, keep `current work unit` as the active selected unit only; use `none` at a safe stopping point with no next unit selected.
- In `Execution state`, set `recommended next work unit` whenever the near-term next unit is known but not yet completed.
