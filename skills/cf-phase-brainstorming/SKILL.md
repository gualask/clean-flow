---
name: cf-phase-brainstorming
description: User alignment for Cflow after assessment. Use when the user wants to adjust scope, exclusions, risk, or direction before execution.
---

Do not implement in this skill.

## Goal

Resolve only the decisions that materially change the cleanup or refactor.

This is a lightweight alignment step, not a spec-writing phase.

## Preflight

1. Read `AGENTS.md`.
2. Read `architecture.md` if it exists.
3. Read `refactor-brief.md` if it exists.
4. Re-check repository facts that matter for the open decisions.
5. Treat the repository as the source of truth.

## Trigger

Use this when the user does more than simple confirmation.

Simple confirmation examples:

- proceed
- prosegui
- continue
- vai avanti

Anything beyond that means the user is steering the direction and this skill should align it.

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

- update `architecture.md` if repository guidance became clearer
- create or refresh `refactor-brief.md` if the work is non-trivial
- keep work units concise
- do not write pseudo-code
- do not freeze brittle file lists

## Output rules

If a decision is still open, end with exactly one focused question.

If alignment is now sufficient, provide exactly these sections:

1. **Aligned decisions**
2. **Remaining exclusions or non-goals**
3. **Artifacts updated**
4. **Recommended next action**
