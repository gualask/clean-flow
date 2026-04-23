---
name: cf-internal-review
description: Review a completed bounded refactor step and judge whether it reduced pressure without over-engineering. Use after structural work and before final verification or acceptance.
---
Do review only. Do not introduce new structural changes in this skill unless the user explicitly asks.

## Preflight

- If `.cflow/architecture.md` is missing, stop and route to `cf-architecture-map` first.
- Read `.cflow/architecture.md`.
- Read `.cflow/refactor-brief.md` if it exists.
- If the completed step or touched area is not clear enough to review, stop and route to `cf-start` first.
- Re-check the touched area and the current repository state.
- Treat the repository as the source of truth.

## Goal

Judge whether the refactor improved structure in a proportionate way.

Review for:

- reduction of mixed responsibilities
- reduction of concentration pressure
- reduction of fragmentation pressure when relevant
- clearer role boundaries
- thin entry points that still act mostly as glue
- better naming and local readability
- absence of fake layers or architecture theater
- absence of dead weight such as empty wrappers or forwarding with no semantic value
- absence of cleanup mania
- coherence with `.cflow/architecture.md`
- whether the touched unit should stop here or needs one more bounded pass

## Also check

- whether the refactor widened scope unnecessarily
- whether current remaining issues are local and acceptable
- whether residual risk is mostly coverage rather than structure
- whether a broader change is being smuggled in without justification
- whether ownership was moved without materially simplifying the caller

## Recommendation rules

- If structure is acceptable and only factual closure is missing, recommend `cf-internal-verify`.
- If one more bounded pass is needed, name the exact next phase or step rather than recommending generic more work.

## Output format

Provide exactly these sections:

1. **What improved**
2. **What is still mixed or unclear**
3. **Over-engineering check**
4. **Boundary clarity check**
5. **Fragmentation / indirection check**
6. **Risk check**
7. **Recommended next action**

## Artifact updates

If a brief exists, update before stopping:

- `Review notes`
- `Execution state`
- `Handoff notes`

If review changes confidence in the target direction, also update:

- `Target direction`
- `Unknowns to re-check`
- `Alignment notes`
