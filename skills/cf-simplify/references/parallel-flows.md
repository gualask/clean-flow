# Parallel Flows Consolidation

Decide whether similar or duplicated flows should be consolidated behind one abstraction or stay separate.

## Verify Shared Behavior First

Two flows that look similar may not share implementation or contract. Before judging:

- Read both paths end to end; do not infer similarity from names, UI, or product intuition.
- Map the divergences point by point: input shape, branching, side effects, persistence, error handling, and boundary contracts.
- When real impact is unclear, use `cf-scenario` to ground one impacted flow and one nearby flow that must stay unchanged.

## Accidental vs Essential Divergence

Classify each divergence before proposing consolidation:

- `accidental`: born from old UI, data, or design choices; nobody rewriting this today would reintroduce it. Consolidation candidate.
- `essential`: domain forces will keep pulling the flows apart; differences are expected to grow. Keep the flows separate.
- `unknown`: needs one more targeted check before deciding.

A wrong abstraction costs more than the duplication it removes. When in doubt between `accidental` and `essential`, prefer keeping the duplication and say why.

## Consolidation Shape

- Name the single abstraction by its shared responsibility; per-flow remainders stay as thin named variants beside it.
- If the unified unit needs mode flags, type switches, or per-flow branches inside its core, the divergence was essential; stop and keep the flows separate.
- The result must still pass references/navigation-cost.md: a maintainer hunting a bug in one flow should read the shared core once and skip the other flow's variant entirely.
- Keep the consolidation behavior-preserving; if a contract or visible behavior must change to unify the flows, surface that as the decision before implementation.
- For a bounded merge, apply it under the Applying The Simplification rules; for multi-step or cross-boundary migration, route to `cf-start` with the proposed abstraction as the target direction.
