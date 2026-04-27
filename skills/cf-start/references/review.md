# Review

Do review only. Do not introduce new structural changes in this phase unless the user explicitly asks.

## Preflight

- Require current `.cflow/architecture.md`; if missing, stop and route to `cf-architecture`.
- Read architecture plus existing `.cflow/refactor-brief.md`.
- If the completed step or touched area is not clear enough to review, stop and route to `cf-start` first.
- Re-check the touched area and treat repository state as the source of truth.

## Goal

Judge whether the refactor improved structure in a proportionate way.

## Review lens

Ensure you have read [../../_shared/references/local-readability-review.md](../../_shared/references/local-readability-review.md) in this invocation before judging local readability.

Judge the result on four questions:

- Did it reduce the pressure it was meant to reduce?
- Did it keep boundaries and ownership clearer than before?
- Did it avoid fake layers, dead wrappers, cleanup mania, and unnecessary scope growth?
- Is the remaining risk structural, or mostly a verification gap?

## Recommendation rules

- If structure is acceptable and only factual closure is missing, recommend verify.
- If one more bounded pass is needed, name the exact next phase or step rather than recommending generic more work.
- If the result is proportionate and remaining issues are local or acceptable, recommend stopping structural work for this unit.

## Output format

Return sections: **What improved**, **What is still mixed or unclear**, **Over-engineering check**, **Boundary clarity check**, **Fragmentation / indirection check**, **Risk check**, **Recommended next action**.

## Artifact updates

If a brief exists, update before stopping:

- `Review notes`
- `Execution state`
- `Handoff notes`

If review changes confidence in the target direction, also update:

- `Target direction`
- `Unknowns to re-check`
- `Decision notes`
