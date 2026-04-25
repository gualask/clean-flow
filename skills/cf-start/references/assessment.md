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
- whether durable handoff state is needed

## Assessment Preflight

- Requires current architecture context; route through `cf-architecture-map` first when missing, stale, or materially incomplete.
- Read any existing brief and re-check repository state before deciding.

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
- Leave local fast lane, planning, and hard-path routing decisions to `routing.md`.

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

Use `artifacts.md` for brief creation and field updates.
Do not create or refresh `.cflow/architecture.md` here.

Once enough decisions are aligned:

- record aligned decisions in `.cflow/refactor-brief.md` when they create resumable handoff state
- route to `cf-architecture-map` if architectural guidance itself needs a refresh
- keep work units concise
- do not freeze brittle file lists

## Output

For assessment, return premise, candidate areas, plausible modes, artifact decision, and recommended next action.

For unresolved alignment, end with exactly one focused question.

For sufficient alignment, return aligned decisions, exclusions or non-goals, artifacts updated, and recommended next action.
