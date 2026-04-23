---
name: cf-start
description: Main and only supported user-facing entrypoint for Cflow. Use to start or resume most cleanup and refactor work, bootstrap .cflow state, evaluate concentration and fragmentation pressure, and stop at an alignment checkpoint before non-trivial execution.
---

This is the only supported user-facing entrypoint for the pack.
Do not tell the user to invoke internal phase or step skills directly.
Internal phase and step skills are still valid workflow steps when the repository state already fits them.
Do not behave like a router that only suggests another skill.
When the next phase is already clear from repository state and Cflow artifacts, advance into it yourself instead of only suggesting it.

## Goal

Handle fresh assessment, artifact-backed resume, or review/verify re-entry through `cf-start`.

For non-trivial execution paths:

- lightweight cleanup or refactor must enter `cf-phase-work-unit-planning` before local mapping or execution, unless the next active work unit is already clearly selected and recorded
- hard-path restructuring must enter `cf-phase-target-shape` and then `cf-phase-migration-unit-planning` before implementation

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
- Ensure you have read [references/artifacts.md](references/artifacts.md) before creating `.cflow/`, touching `.gitignore`, creating or refreshing `.cflow/*`, or deciding which brief fields must be updated.

Use `assets/architecture.template.md` and `assets/refactor-brief.template.md` as the source templates whenever artifact bootstrap is required.

## Intent modes

Infer the current intent from the user's prompt.

Use these modes:

- **assessment-only**
- **assessment-then-alignment**
- **resume-existing-work**
- **review-or-verify**

## Fresh assessment

Internally perform:

1. repository discovery
2. concentration lens
3. fragmentation lens
4. premise check
5. provisional intervention mode
6. artifact updates

Determine:

- repository context and domain gravity
- current boundary / packaging shape and architecture fit
- whether intervention is justified
- candidate intervention areas worth tracking in the brief
- dominant pressure: concentration | fragmentation | mixed | neither
- intervention mode: soft-split | soft-consolidate | soft-mixed | hard-restructure | no-structural-refactor

Rules:

- Keep assessment repository-level.
- For non-trivial work, create or refresh `.cflow/refactor-brief.md`.
- Treat `soft-mixed` as a repository-level outcome, not as one executable step.
- In `soft-mixed`, break the work into bounded work units and assign each unit exactly one `mode`: `split` or `consolidate`.
- For lightweight paths, propose `cf-phase-work-unit-planning` as the next planning phase before local mapping or execution unless the next active unit is already clearly selected and recorded.
- For hard restructure, propose `cf-phase-target-shape` first, then `cf-phase-migration-unit-planning`.
- Do not implement yet.
- Always end fresh assessment at the alignment checkpoint with exactly one focused question.

## Resume

Resume is not a phase. Re-enter the correct phase using the brief and the repository.

Rules:

- If the brief is stale, or repository changes made the recorded path or work-unit state unreliable, reassess first.
- If hard-path direction is chosen but target shape is still unresolved, use `cf-phase-target-shape`.
- If hard-path direction is aligned but migration units are not yet planned, use `cf-phase-migration-unit-planning`.
- If `current work unit` is `none` and the next bounded unit is not yet selected and recorded, use `cf-phase-work-unit-planning`.
- If an active work unit exists and its seam still needs mapping, continue into the matching map skill.
- If an active work unit exists and mapping is sufficient but behavior is not yet locked, continue into `cf-step-safety-net`.
- If an active work unit exists and it is ready for structural work, execute it by its declared mode.
- If an active work unit's structural work is already complete, continue into `cf-review` or `cf-verify`.
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

If `.cflow/architecture.md` exists or is created, update it whenever current repository understanding or guidance in the file would otherwise be stale.

If `.cflow/refactor-brief.md` exists or is created, update the fields required by [references/artifacts.md](references/artifacts.md).

- In `Execution state`, keep `current work unit` as the active selected unit only; use `none` at a safe stopping point with no next unit selected.
- In `Execution state`, set `recommended next work unit` whenever the near-term next unit is known but not yet completed.
