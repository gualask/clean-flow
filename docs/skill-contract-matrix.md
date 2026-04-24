# Skill Contract Matrix

This file is the compact contract baseline for entry, gating, and routing decisions.

Use it together with [maintaining-this-pack.md](/Users/blazar/Dev/clean-flow/docs/maintaining-this-pack.md).
The source of truth remains each `skills/*/SKILL.md`.

## Interpretation

- `Supported direct human entrypoint`: the official path a human may invoke directly.
- `Can still work if directly invoked`:
  - `yes`: the skill can usually produce a coherent result from repository state alone or with minimal prompt context.
  - `conditional`: the skill may proceed only if the required context already exists.
  - `no`: the skill should stop and route to the required earlier public entrypoint, usually `cf-start` or `cf-architecture-map`.
- `If context missing`: the intended routing outcome when prerequisites are not satisfied.

This matrix records the current contract.
It does not assume that every skill already enforces that routing with the same explicit gate wording.

## Codex Invocation Policy

- `internal` means "not a supported direct human entrypoint". It does not mean "explicit-only" in Codex.
- Cflow workflow skills should normally allow implicit invocation so Codex can route into the next relevant step when the task matches the skill description.
- If a skill is intentionally explicit-only in Codex, document that exception in the skill, in this matrix, and in [maintaining-this-pack.md](/Users/blazar/Dev/clean-flow/docs/maintaining-this-pack.md).

## Entry And Routing

| Skill | Role | Supported direct human entrypoint | Can still work if directly invoked | Minimum context to proceed | If context missing |
| --- | --- | --- | --- | --- | --- |
| `cf-start` | public | yes | yes | repository state only; existing `.cflow/*` artifacts are optional | bootstrap or reassess, then continue internally |
| `cf-architecture-map` | public | yes | yes | repository state only; existing `.cflow/architecture.md` is optional | create or refresh architecture context, then stop or continue from there |
| `cf-cognitive` | public | yes | yes | repository state plus up to three optional explicit source file targets; `.cflow/*` artifacts are not required | discover and shortlist up to three justified local files, ask one focused target question if selection is ambiguous, or route to `cf-start` when the request is broader than local file-by-file cleanup |
| `cf-internal-assessment` | internal | no | conditional | current `.cflow/architecture.md`; `.cflow/refactor-brief.md` optional | route to `cf-architecture-map` first |
| `cf-internal-brainstorming` | internal | no | conditional | current `.cflow/architecture.md` plus an already assessed direction and a non-trivial reply or concrete decision to resolve | route to `cf-architecture-map` when architecture is missing, otherwise to `cf-start` for assessment or alignment context |
| `cf-internal-concentration-map` | internal | no | conditional | architecture map plus repository check; brief optional; if no brief exists, the prompt must give an explicit local or repo-level scope | route to `cf-architecture-map` when architecture is missing, otherwise to `cf-start` or the assessment path first |
| `cf-internal-fragmentation-map` | internal | no | conditional | architecture map plus repository check; brief optional; if no brief exists, the prompt must give an explicit local or repo-level scope | route to `cf-architecture-map` when architecture is missing, otherwise to `cf-start` or the assessment path first |
| `cf-internal-work-unit-planning` | internal | no | conditional | architecture map plus multiple credible candidate areas, dependency/order decisions, cross-boundary scope, resumable multi-step work, or an explicit bounded scope to order; brief optional | route to `cf-architecture-map` when architecture is missing, to `cf-start` when assessment context is missing, to the local fast lane when one cohesive local unit is already clear, or to `cf-internal-target-shape` when structural direction is still unresolved |
| `cf-internal-target-shape` | internal | no | conditional | hard path already justified; `.cflow/architecture.md` and `.cflow/refactor-brief.md` already present | route to `cf-architecture-map` when architecture is missing, to `cf-start` when hard restructure is not justified or the brief is missing, or to `cf-internal-brainstorming` when unresolved user steering still blocks target-shape decisions |
| `cf-internal-migration-unit-planning` | internal | no | conditional | target direction already aligned; `.cflow/architecture.md` and `.cflow/refactor-brief.md` already present | route to `cf-architecture-map` when architecture is missing, to `cf-internal-target-shape` when the target direction is not aligned, or to `cf-start` when hard-path framing or the brief is missing |
| `cf-internal-safety-net` | internal | no | conditional | architecture map plus a clear current work unit or cohesive local unit; if no brief exists, the prompt must give an explicit local, behavior-preserving scope | stop and route to `cf-architecture-map` when architecture is missing, otherwise to `cf-start` or the correct internal skill |
| `cf-internal-boundary-apply` | internal | no | conditional | architecture map plus a mapped split-oriented work unit or cohesive local unit; file placement must be clear or resolved before editing; if no brief exists, the prompt must give an explicit local, behavior-preserving scope | stop and route to `cf-architecture-map` when architecture is missing, otherwise to `cf-start` or `cf-internal-concentration-map` |
| `cf-internal-consolidate-seam` | internal | no | conditional | architecture map plus either a mapped consolidate-oriented work unit or cohesive local unit, or an explicit local, behavior-preserving seam where the artificial boundary is already clear | stop and route to `cf-architecture-map` when architecture is missing, otherwise to `cf-start` or `cf-internal-fragmentation-map` when the path or seam is not clear enough |
| `cf-internal-local-simplify` | internal | no | conditional | architecture map plus an already touched local area; if no brief exists, the prompt must make that touched area explicit and local | stop and route to `cf-architecture-map` when architecture is missing, otherwise to `cf-start` or the correct internal skill |
| `cf-internal-review` | internal | no | conditional | architecture map plus a completed bounded step or an explicit touched area to judge; brief optional | route to `cf-architecture-map` when architecture is missing, otherwise to `cf-start` if the current unit or path is unclear |
| `cf-internal-verify` | internal | no | conditional | architecture map plus a completed bounded step or an explicit touched area to verify; brief optional | route to `cf-architecture-map` when architecture is missing, otherwise to `cf-start` if the verification target is unclear |
| `cf-internal-feedback-intake` | internal | no | conditional | architecture map plus existing feedback and enough repository evidence to verify it; brief optional | route to `cf-architecture-map` when architecture is missing, otherwise to `cf-start` if the feedback changes plan and the current path is unclear |

## Artifact And Edit Surface

| Skill | `.cflow/architecture.md` expectation | `.cflow/refactor-brief.md` expectation | Artifact behavior | May edit code |
| --- | --- | --- | --- | --- |
| `cf-start` | optional | optional | workflow entry plus creation or refresh of `.cflow/refactor-brief.md`; routes to `cf-architecture-map` when architecture bootstrap or refresh is needed | via internal routing |
| `cf-architecture-map` | optional | optional; ignored by this skill | creates or refreshes `.cflow/architecture.md`, bootstraps `.cflow/`, updates `.gitignore` for `.cflow/`, and never creates or refreshes `.cflow/refactor-brief.md` | no |
| `cf-cognitive` | not required | optional; ignored by this skill | does not create or update `.cflow/*`; discovers up to three justified candidates when needed, performs local file-level cognitive complexity refactors sequentially, reports checks run, and may report file-level extraction review as follow-up only | yes |
| `cf-internal-assessment` | required | optional | may create or refresh `.cflow/refactor-brief.md` for non-trivial work or resumable assessment state; never creates or refreshes `architecture.md` | no |
| `cf-internal-brainstorming` | required | optional | may update existing `architecture.md` guidance and may create or refresh `refactor-brief.md` once alignment is sufficient or resumable alignment state exists | no |
| `cf-internal-concentration-map` | required | optional; explicit scope if absent | may create or update `refactor-brief.md`; may also update assessment and target fields when the likely mode changes | no |
| `cf-internal-fragmentation-map` | required | optional; explicit scope if absent | may create or update `refactor-brief.md`; may also update assessment and target fields when the likely mode changes | no |
| `cf-internal-work-unit-planning` | required | optional | may create or update `refactor-brief.md` while ordering cohesive candidate work units, setting the recommended next unit, and persisting resumable planning state | no |
| `cf-internal-target-shape` | required | required | refresh existing brief fields for hard-path direction | no |
| `cf-internal-migration-unit-planning` | required | required | refresh existing brief fields for migration planning | no |
| `cf-internal-safety-net` | required | optional; explicit local scope if absent | may create or update `refactor-brief.md` while locking the current work unit or cohesive local unit | no |
| `cf-internal-boundary-apply` | required | optional; explicit local scope if absent | may create or update `refactor-brief.md` while executing the current bounded split step | yes |
| `cf-internal-consolidate-seam` | required | optional; explicit local scope if absent | may create or update `refactor-brief.md` while executing the current bounded consolidation step | yes |
| `cf-internal-local-simplify` | required | optional; explicit local touched area if absent | updates existing `refactor-brief.md` only | yes |
| `cf-internal-review` | required | optional | updates existing `refactor-brief.md` only | no |
| `cf-internal-verify` | required | optional | updates existing `refactor-brief.md` only | no |
| `cf-internal-feedback-intake` | required | optional | updates existing `refactor-brief.md` only | no |

## Maintainer Use

Use this file to answer questions like:

- should this skill stop or continue when invoked directly?
- which prerequisites are real versus only typical?
- can this skill create or refresh artifacts on its own?
- is a proposed gate actor-based or state-based?

When a skill contract changes, update this matrix, the skill file, and the reference section in [maintaining-this-pack.md](/Users/blazar/Dev/clean-flow/docs/maintaining-this-pack.md).
