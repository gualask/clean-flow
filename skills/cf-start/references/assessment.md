# Assessment

Do assessment only. Do not implement, move files, or write patches.

## Goal

Decide the right **repository-level intervention frame** using the current architecture map.

You must determine:

- whether intervention is actually justified
- candidate intervention areas worth carrying forward
- which intervention modes are plausible
- whether `.cflow/refactor-brief.md` must be created or refreshed in this pass
- how Cflow's clean-by-default standard plus request-stated constraints, risk appetite, and acceptable ceremony affect the intervention frame

## Preflight

Use standard phase preflight.

## Premise check

Answer these honestly:

1. What concrete problem is this intervention solving now?
2. What is the cost of leaving the current shape as-is for now?
3. Why is the intervention proportionate rather than architecture theater?
4. What constraints, risk appetite, acceptable ceremony, or non-goals does the current request state?

For hard restructure also answer:

5. Is repository shape itself the recurring cause of friction?
6. Are existing global barrels, shared models, or layer boundaries hiding real ownership, boundary roles, or organizing axis?
7. Would a good soft intervention remove the structural pain without preserving dirty ownership or unclear boundaries?

## Intervention mode framing

Do not choose the final mode yet, but identify what is plausible:

- soft-split
- soft-consolidate
- soft-mixed
- hard-restructure
- no-structural-refactor

Do not reject `hard-restructure` just because a lower-churn soft intervention exists. Reject it only when the premise check shows that a hard path would be disproportionate, detached from the repository, or unnecessary for the clean evidence-backed target.
Rank plausible interventions by structural cleanliness first. Use cost, churn, and reviewability to judge proportionality and migration order, not to prefer a dirtier target.

Treat `soft-mixed` as a repository-level outcome only.
Later work units must still choose `split` or `consolidate`.

## Artifact behavior

Do not create or refresh `.cflow/architecture.md` in this phase.
If the map is missing or stale, route to `cf-architecture` first.

Update or create `.cflow/refactor-brief.md` when the work is non-trivial, risky, multi-step, or needs resumable handoff state.

If assessment identifies candidate intervention areas worth carrying forward and the brief is missing, create it before returning.

## Output format

Return sections: **Premise check**, **Candidate intervention areas**, **Plausible intervention modes**, **Artifact decision**, **Recommended next action**.

## Anti-goals

- Do not implement.
- Do not dive into work-unit splitting yet.
- Do not rewrite the architecture map from this phase.
