# Assessment

Do assessment only. Do not implement, move files, or write patches.

## Goal

Decide the right **repository-level intervention frame** using the current architecture map.

You must determine:

- whether intervention is actually justified
- candidate intervention areas worth carrying forward
- which intervention modes are plausible
- whether artifact-backed planning should be recommended after user approval
- how Cflow's clean-by-default standard plus domain ownership, request-stated constraints, risk appetite, and acceptable ceremony affect the intervention frame

## Preflight

Use standard phase preflight.
For broad repository or subsystem structure assessment, orient with the bundled `repo-tree.mjs` helper when available before ad hoc file inventory; use source reads to verify conclusions.

## Premise check

Answer these honestly:

1. What concrete problem is this intervention solving now?
2. What domain concepts, boundaries, business invariants, workflows, and allowed dependencies should shape the clean architecture if current folders were not treated as constraints?
3. What is the cost of leaving the current shape as-is for now?
4. Why is the intervention proportionate rather than architecture theater?
5. What constraints, risk appetite, acceptable ceremony, or non-goals does the current request state?

For hard restructure also answer:

6. Is repository shape itself the recurring cause of friction?
7. Are existing global barrels, shared models, or layer boundaries hiding real ownership, boundary roles, or organizing axis?
8. Would a good soft intervention remove the structural pain without preserving dirty ownership or unclear boundaries?

## Intervention mode framing

Do not choose the final mode yet, but identify what is plausible:

- soft-split
- soft-consolidate
- soft-mixed
- hard-restructure
- no-structural-refactor

Do not reject `hard-restructure` just because a lower-churn soft intervention exists. Reject it only when the premise check shows that a hard path would be disproportionate, detached from the repository, or unnecessary for the clean evidence-backed target.
Rank plausible interventions by structural cleanliness first. Use cost, churn, and reviewability to judge proportionality and migration order, not to prefer a dirtier target.
If the cleanest proportionate target is a broad architecture or repository reshape, carry `hard-restructure` as the leading plausible route and constrain the migration later.
For architecture or structure assessment, present the domain concepts, boundaries, business invariants, workflows, and allowed dependencies before candidate intervention areas or target tree examples.

Treat `soft-mixed` as a repository-level outcome only.
Later work units must still choose `split` or `consolidate`.

## Artifact behavior

Do not create or refresh `.cflow/architecture.md` in this phase.
If the map is missing or stale, route to `cf-architecture` first.

Do not create or update `.cflow/refactor-brief.md` during a first-pass check, evaluation, or discussion request.
Create or update the brief only when the current request explicitly asks for planning/resume/proceed, or after the user approves the recommended intervention direction.
Do not add work units during assessment; work-unit planning owns work-unit creation after the decision checkpoint.

## Output format

Return sections: **Premise check**, **Domain**, **Candidate intervention areas**, **Plausible intervention modes**, **Artifact decision**, **Recommended next action**.

## Anti-goals

- Do not implement.
- Do not dive into work-unit splitting yet.
- Do not create, rewrite, or reprioritize work units.
- Do not rewrite the architecture map from this phase.
