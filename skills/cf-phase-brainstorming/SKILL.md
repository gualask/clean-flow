---
name: cf-phase-brainstorming
description: User alignment for Cflow after assessment. Use when the user wants to adjust scope, exclusions, risk, or direction before execution.
---
Do not implement in this skill.

## Goal

Resolve only the decisions that materially change the cleanup or refactor.

This is a lightweight alignment step, not a spec-writing phase.
Stay in this phase until the direction is clear enough to proceed safely.

Alignment is sufficient only when the next phase, scope boundaries, exclusions, and whether to continue are explicit enough to route without another alignment pass.

## Preflight

1. If `.cflow/architecture.md` is missing, stop and route to `cf-architecture-map` first.
2. Read `.cflow/architecture.md`.
3. Read `.cflow/refactor-brief.md` if it exists.
4. If there is no already assessed direction and no concrete decision to resolve yet, stop and route to `cf-start` first.
5. Re-check repository facts that matter for the open decisions.
6. Treat the repository as the source of truth.

## Trigger

Use this when the user gives any non-trivial reply after the assessment checkpoint.

Anything beyond simple confirmation means the user is steering the direction and this skill should align it before execution continues.

## Deliberation mode

If the decision is still fuzzy, run a short deliberation first.

When you use deliberation:

1. State the decision in one sentence.
2. Choose **3-4 genuine perspectives** with real stakes in this repository.
3. Let each perspective speak once only:
   - what it values most here
   - its main concern
   - what it loses in each direction
4. Then surface:
   - **convergence**
   - **live tension**
   - **reframe**, if the original question was wrong

Rules:

- no fake personas with no real stake
- no debate loop
- keep each perspective tight
- do not force consensus

## Questioning rules

- Ask **one question at a time**.
- Ask only when the answer materially changes:
  - intervention mode
  - scope boundaries
  - exclusions
  - invariants
  - migration appetite
  - whether to stop after alignment or continue into execution
- Offer at most **two concrete options** with trade-offs and a recommendation.
- Prefer repository evidence first.

## Artifact behavior

Once enough decisions are aligned:

- update `.cflow/architecture.md` if repository guidance became clearer
- create or refresh `.cflow/refactor-brief.md` if the work is non-trivial or the aligned decisions now create resumable handoff state
- keep work units concise
- do not write pseudo-code
- do not freeze brittle file lists
- for lightweight paths, recommend `cf-phase-work-unit-planning` unless the next active work unit and its immediate next phase are already explicit and recorded
- for hard-path restructuring, recommend `cf-phase-target-shape` before migration-unit planning

## Output rules

If a decision is still open, end with exactly one focused question.

If alignment is now sufficient, provide exactly these sections:

1. **Aligned decisions**
2. **Remaining exclusions or non-goals**
3. **Artifacts updated**
4. **Recommended next action**

Do not resume execution from this skill while a material decision is still open.
Do not skip `cf-phase-work-unit-planning` on lightweight paths unless the next active work unit is already explicitly selected and ready to continue.
