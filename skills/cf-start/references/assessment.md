# Assessment And Alignment

Use this reference for fresh assessment, premise checks, and post-assessment alignment.

Do not implement in this phase.

## Assessment Goal

Decide the right repository-level intervention frame using the current architecture map.

Determine:

- whether intervention is justified now
- candidate intervention areas worth carrying forward
- dominant pressure: concentration, fragmentation, mixed, or none
- plausible intervention mode: soft-split, soft-consolidate, soft-mixed, hard-restructure, or no-structural-refactor
- whether `.cflow/refactor-brief.md` must be created or refreshed

## Assessment Preflight

1. Require current `.cflow/architecture.md`; if missing, stale, or materially incomplete, route to `cf-architecture-map`.
2. Read architecture plus existing `.cflow/refactor-brief.md`.
3. Re-check repository state and treat it as source of truth.

## Premise Check

Answer honestly:

1. What concrete problem is this intervention solving now?
2. What is the cost of leaving the current shape as-is for now?
3. Why is the intervention proportionate rather than architecture theater?

For hard restructure also answer:

1. Is repository shape itself the recurring cause of friction?
2. Would a good soft intervention likely remove most of the pain anyway?

## Intervention Framing

- Treat `soft-mixed` as a repository-level outcome only.
- Each executable work unit must still choose exactly one mode: `split` or `consolidate`.
- Do not split one coherent local cleanup into multiple work units just to make units smaller.
- Use the local fast lane when one explicit, local, low-risk, behavior-preserving cohesive unit is already clear enough to map, lock, or execute.
- Use planning when multiple credible candidates, dependency/order decisions, cross-boundary scope, or resumable multi-step work must be sequenced.
- Use hard-path planning only when soft intervention is not enough.

## Alignment Goal

Resolve only decisions that materially change cleanup or refactor direction.

Alignment is sufficient only when next phase, scope boundaries, exclusions, and whether to continue are explicit enough to route without another alignment pass.

## Alignment Trigger

Use alignment when a reply after the assessment checkpoint may materially change:

- scope
- exclusions
- invariants
- risk appetite
- direction
- whether to continue

Simple confirmation or a factual question that does not affect those decisions does not require a separate alignment pass.

## Deliberation

If the decision is still fuzzy:

1. State the decision in one sentence.
2. Choose 3-4 genuine perspectives with real stakes in this repository.
3. Let each perspective speak once: what it values, its main concern, and what it loses in each direction.
4. Surface convergence, live tension, and a reframe when the original question was wrong.

Keep this short. Do not create fake personas or run a debate loop.

## Questioning

- Ask one question at a time.
- Ask only when the answer materially changes path, scope, exclusions, invariants, migration appetite, or whether to continue.
- Offer at most two concrete options with trade-offs and a recommendation.
- Prefer repository evidence first.

## Artifact Behavior

Do not create or refresh `.cflow/architecture.md` here.

Create or refresh `.cflow/refactor-brief.md` when work is non-trivial, risky, multi-step, or needs resumable handoff state.

Once enough decisions are aligned:

- update `.cflow/architecture.md` only when repository guidance became clearer and architecture context is already present
- create or refresh `.cflow/refactor-brief.md` when aligned decisions create resumable handoff state
- keep work units concise
- do not freeze brittle file lists

## Output

For assessment, return premise, candidate areas, plausible modes, artifact decision, and recommended next action.

For unresolved alignment, end with exactly one focused question.

For sufficient alignment, return aligned decisions, exclusions or non-goals, artifacts updated, and recommended next action.
