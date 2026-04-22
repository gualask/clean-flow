---
name: cf-start
description: Main and only supported user-facing entrypoint for Cflow. Use to start or resume most cleanup and refactor work, bootstrap .cflow state, evaluate concentration and fragmentation pressure, and stop at an alignment checkpoint before non-trivial execution.
---

This is the only supported user-facing entrypoint for the pack.
Do not tell the user to invoke internal phase or step skills directly.
Internal phase and step skills are still valid workflow steps when the repository state already fits them.
Do not behave like a router that only suggests another skill.
Advance the workflow yourself whenever the correct next phase is clear.

## Goal

Handle fresh assessment, artifact-backed resume, or review/verify re-entry through `cf-start`.

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

## Bootstrap

Use `assets/architecture.template.md` and `assets/refactor-brief.template.md` as the source templates for Cflow artifacts.

When bootstrapping or refreshing Cflow artifacts:

- create `.cflow/` if it does not exist
- add `.cflow/` to the repository `.gitignore` if the entry is missing
- create `.cflow/architecture.md` from `assets/architecture.template.md` when a repository map is needed and the file is missing
- create `.cflow/refactor-brief.md` from `assets/refactor-brief.template.md` when the work is non-trivial, risky, multi-step, or likely to resume later and the file is missing
- never create root-level `architecture.md` or `refactor-brief.md` for Cflow
- when a Cflow artifact already exists, update it in place instead of re-copying the template blindly

## Intent inference

Infer the current intent from the user's prompt.

Use these modes:

- **assessment-only**
- **assessment-then-alignment**
- **resume-existing-work**
- **review-or-verify**

Heuristics:

- If there is no live brief or the task looks new, start with assessment.
- If there is a live brief and the user says resume / continue / proceed, resume from the correct phase.
- If the user explicitly asks only for review or verification, bootstrap or refresh prerequisites first and then route internally to that mode.
- For non-trivial fresh work, default to **assessment-then-alignment**.

## Fresh assessment responsibilities

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
- dominant pressure: concentration | fragmentation | mixed | neither
- intervention mode: soft-split | soft-consolidate | soft-mixed | hard-restructure | no-structural-refactor

Rules:

- Keep assessment repository-level.
- Update or create `.cflow/architecture.md` whenever it is missing, stale, or materially incomplete.
- For non-trivial work, create or refresh `.cflow/refactor-brief.md`.
- Treat `soft-mixed` as a repository-level outcome, not as one executable step.
- In `soft-mixed`, break the work into bounded work units and assign each unit exactly one `mode`: `split` or `consolidate`.
- Do not implement yet.
- Always end fresh assessment at the alignment checkpoint with exactly one focused question.

## Resume responsibilities

Resume is not a phase. Re-enter the correct phase using the brief and the repository.

Resume from the correct point:

- if the brief is stale, the seam changed materially, or `current work unit` is `none` -> reassessment or next-unit selection
- if an active work unit is selected but not ready -> concentration or fragmentation mapping, or safety-net
- if an active work unit is ready for structural work -> execute by its declared mode:
  - `split` -> split work
  - `consolidate` -> consolidate work
- if structural work is already done -> review or verify based on whether judgment or factual closure is needed

Rules:

- In `soft-mixed`, select the next work unit by local dominant pressure and use that unit's declared mode.
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

## Artifact update requirements

If `.cflow/architecture.md` exists or is created, update it when repository understanding or guidance materially changed.

If `.cflow/refactor-brief.md` exists or is created, update at least:

- `Context`
- `Assessment summary`
- `Concentration pressure`
- `Fragmentation pressure`
- `Alignment notes`
- `Execution state`
- `Handoff notes`

- In `Execution state`, set `current work unit` to the active selected unit, or `none` at a safe stopping point with no next unit selected.

Update these too when they changed:

- `Target direction`
- `Work units`
- `Safety net`
- `Verification`
- `Review notes`
- `Unknowns to re-check`
