---
name: cf-phase-brainstorming
description: Phase-A user alignment for Cflow. Use after discovery when a material cleanup decision is still open and user input is needed before locking architecture.md or refactor-brief.md.
---

Do not implement in this skill.

## Goal

Resolve only the decisions that materially change the cleanup or refactor.

This is a lightweight alignment step, not a full specification phase.

## Preflight

1. Read `AGENTS.md`.
2. Read `architecture.md` if it exists.
3. Read `refactor-brief.md` if it exists.
4. Re-check repository facts that matter for the open decisions.
5. Treat the repository as the source of truth.

## Deliberation mode

If the decision is still not framed well enough for a clean question, run a short deliberation first.

Use deliberation only when:

- the real decision is still fuzzy
- multiple legitimate constraints pull in different directions
- the problem may need reframing before options can be judged

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

- no debate between perspectives
- no fake personas with no real stake
- keep each perspective tight
- do not force a conclusion just because the structure exists

## Questioning rules

- Ask **one question at a time**.
- Ask only when the answer would materially change:
  - soft vs hard path
  - scope boundaries
  - what must stay stable
  - target direction
  - migration risk
  - explicit non-goals
  - whether to stop after Phase A or continue into execution
- Offer at most **two concrete options** with trade-offs and a recommendation.
- Prefer repository evidence first.

## Artifact behavior

Once enough decisions are aligned:

- update `architecture.md` if repository guidance became clearer
- create or refresh `refactor-brief.md` if the work is non-trivial
- keep work units concise
- do not write pseudo-code
- do not freeze file lists that repository exploration may still change

## Output rules

If a decision is still open, end with exactly one focused question.

If alignment is now sufficient, provide exactly these sections:

1. **Aligned decisions**
2. **Remaining exclusions or non-goals**
3. **Artifact updates**
4. **Recommended next action**
