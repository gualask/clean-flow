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

For non-trivial execution paths:

- lightweight cleanup or refactor must enter `cf-internal-work-unit-planning` before local mapping or execution, unless the next active work unit is already clearly selected and recorded
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

## Intent modes

Infer the current intent from the user's prompt.

Use these modes:

- **assessment-only**
- **assessment-then-alignment**
- **resume-existing-work**
- **review-or-verify**

## Fresh assessment

Internally perform:

1. architecture map when missing or stale
2. repository assessment
3. concentration lens
4. fragmentation lens
5. provisional intervention mode
6. artifact updates

Determine:

- whether intervention is justified
- candidate intervention areas worth tracking in the brief
- dominant pressure: concentration | fragmentation | mixed | neither
- intervention mode: soft-split | soft-consolidate | soft-mixed | hard-restructure | no-structural-refactor

Rules:

- Keep assessment repository-level.
- If `.cflow/architecture.md` is missing, stale, or materially incomplete, use `cf-architecture-map` before finalizing repository-level assessment.
- Use `cf-internal-assessment` when repository-level intervention framing is still needed after architecture context is current.
- For non-trivial work, create or refresh `.cflow/refactor-brief.md`.
- Treat `soft-mixed` as a repository-level outcome, not as one executable step.
- In `soft-mixed`, break the work into bounded work units and assign each unit exactly one `mode`: `split` or `consolidate`.
- For lightweight paths, propose `cf-internal-work-unit-planning` as the next planning phase before local mapping or execution unless the next active unit is already clearly selected and recorded.
- For hard restructure, propose `cf-internal-target-shape` first, then `cf-internal-migration-unit-planning`.
- Do not implement yet.
- Always end fresh assessment at the alignment checkpoint with exactly one focused question.

## Resume

Resume is not a phase. Re-enter the correct phase using the brief and the repository.

Rules:

- If `.cflow/architecture.md` is missing, stale, or materially incomplete for the current repository state, use `cf-architecture-map` first.
- If the brief is stale, or repository changes made the recorded path or work-unit state unreliable, reassess first.
- If repository-level intervention framing is still unclear after architecture context is current, use `cf-internal-assessment`.
- If hard-path direction is chosen but target shape is still unresolved, use `cf-internal-target-shape`.
- If hard-path direction is aligned but migration units are not yet planned, use `cf-internal-migration-unit-planning`.
- If `current work unit` is `none` and the next bounded unit is not yet selected and recorded, use `cf-internal-work-unit-planning`.
- If an active work unit exists and its seam still needs mapping, continue into the matching map skill.
- If an active work unit exists and mapping is sufficient but behavior is not yet locked, continue into `cf-internal-safety-net`.
- If an active work unit exists and it is ready for structural work, execute it by its declared mode.
- If an active work unit's structural work is already complete, continue into `cf-internal-review` or `cf-internal-verify`.
- Do not silently switch direction without updating the artifacts.
- Do not execute more than one bounded work unit per invocation unless the user explicitly asked for a broader pass.

## Output rules

### For fresh assessment
Provide exactly these sections:

1. **Repository assessment**
2. **Concentration pressure**
3. **Fragmentation pressure**
4. **Proposed path**
5. **Artifacts updated**
6. **Alignment checkpoint**

End with exactly one focused question.

### For execution or resume progress
Provide exactly these sections:

1. **Current state**
2. **Work unit executed**
3. **Checks run**
4. **Artifacts updated**
5. **What remains**
6. **Next action**

### For reassessment without code changes
Provide exactly these sections:

1. **Current state**
2. **Reassessment result**
3. **Checks run**
4. **Artifacts updated**
5. **What remains**
6. **Next action**

## Artifact update baseline

Do not create or refresh `.cflow/architecture.md` directly in this skill.
Use `cf-architecture-map` when the architecture map is missing or stale.

If `.cflow/refactor-brief.md` exists or is created, update the fields required by [references/artifacts.md](references/artifacts.md).

- In `Execution state`, keep `current work unit` as the active selected unit only; use `none` at a safe stopping point with no next unit selected.
- In `Execution state`, set `recommended next work unit` whenever the near-term next unit is known but not yet completed.
