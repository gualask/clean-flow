---
name: cf-start
description: Main entrypoint for Cflow. Use to start or resume most cleanup and refactor work. Run repository assessment, evaluate both concentration and fragmentation pressure, update .cflow/architecture.md, and always stop at an alignment checkpoint before non-trivial execution.
---

This is the normal entrypoint for the pack.

Do not behave like a router that only suggests another skill.
Advance the workflow yourself whenever the correct next phase is clear.

## Goal

Handle one of these two modes:

- **fresh assessment** for a new cleanup or refactor
- **artifact-backed resume** from `.cflow/architecture.md` and `.cflow/refactor-brief.md`

## Hard rule

For non-trivial fresh work, always stop at an **alignment checkpoint** after the initial assessment.
Do this even when you already have a recommendation.

At the checkpoint:

- if the user confirms, continue with the proposed path
- if the user changes something material, switch into brainstorming
- if the user says nothing material and only says "continue", treat that as confirmation

## Language rules

- Use the user's language for conversational output.
- Use the repository's dominant documentation language for `.cflow/architecture.md` and `.cflow/refactor-brief.md`.
- If the repository has no dominant documentation language, use the user's language for those artifacts too.

## Preflight

1. Read `.cflow/architecture.md` if it exists.
2. Read `.cflow/refactor-brief.md` if it exists.
3. Re-check the repository state.
4. Treat the repository as the source of truth.

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
- If the user explicitly asks only for review or verification, route to that mode.
- For non-trivial fresh work, default to **assessment-then-alignment**.

## Fresh assessment responsibilities

Internally perform:

1. repository discovery
2. concentration lens
3. fragmentation lens
4. premise check
5. provisional intervention mode
6. artifact updates

You must determine:

- repository context
- domain gravity
- external boundaries
- current boundary model
- current packaging model
- architecture fit
- whether intervention is justified
- the likely dominant pressure:
  - concentration
  - fragmentation
  - mixed
  - neither
- the credible intervention mode:
  - soft-split
  - soft-consolidate
  - soft-mixed
  - hard-restructure
  - no-structural-refactor

Rules:

- Keep assessment repository-level.
- Update or create `.cflow/architecture.md` whenever it is missing, stale, or materially incomplete.
- For non-trivial work, create or refresh `.cflow/refactor-brief.md`.
- Do not implement yet.
- Always end fresh assessment at the alignment checkpoint with exactly one focused question.

## Resume responsibilities

Resume is not a phase. Re-enter the correct phase using the brief and the repository.

Resume from the correct point:

- if the brief is stale or the seam changed materially -> reassessment
- if the current unit is selected but not mapped enough -> concentration or fragmentation mapping
- if the unit needs a behavior lock -> safety-net
- if the unit is ready for structural work:
  - use split work when concentration dominates
  - use consolidate work when fragmentation dominates
- if code already changed and needs judgment -> review
- if the work is ready for factual closure -> verify

Rules:

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

Update these too when they changed:

- `Target direction`
- `Work units`
- `Safety net`
- `Verification`
- `Review notes`
- `Unknowns to re-check`
