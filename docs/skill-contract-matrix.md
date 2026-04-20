# Skill Contract Matrix

This file is the compact contract baseline for entry, gating, and routing decisions.

Use it together with [maintaining-this-pack.md](/Users/blazar/Dev/clean-flow/docs/maintaining-this-pack.md).
The source of truth remains each `skills/*/SKILL.md`.

## Interpretation

- `Supported direct human entrypoint`: the official path a human may invoke directly.
- `Can still work if directly invoked`:
  - `yes`: the skill can usually produce a coherent result from repository state alone or with minimal prompt context.
  - `conditional`: the skill may proceed only if the required context already exists.
  - `no`: the skill should stop and route back to `cf-start`.
- `If context missing`: the intended routing outcome when prerequisites are not satisfied.

This matrix records the current contract.
It does not assume that every skill already enforces that routing with the same explicit gate wording.

## Entry And Routing

| Skill | Role | Supported direct human entrypoint | Can still work if directly invoked | Minimum context to proceed | If context missing |
| --- | --- | --- | --- | --- | --- |
| `cf-start` | public | yes | yes | repository state only; existing `.cflow/*` artifacts are optional | bootstrap or reassess, then continue internally |
| `cf-phase-discovery` | internal | no | yes | repository state only; existing `.cflow/*` artifacts are optional | n/a; discovery can start from repository state |
| `cf-phase-brainstorming` | internal | no | conditional | an already assessed direction or a concrete decision to resolve; repository facts must be checkable | route to `cf-start` for assessment or alignment context |
| `cf-phase-concentration-map` | internal | no | conditional | architecture map plus repository check; brief optional; if no brief exists, the prompt must give an explicit local or repo-level scope | route to `cf-start` or the assessment path first |
| `cf-phase-fragmentation-map` | internal | no | conditional | architecture map plus repository check; brief optional; if no brief exists, the prompt must give an explicit local or repo-level scope | route to `cf-start` or the assessment path first |
| `cf-phase-target-shape` | internal | no | conditional | hard path already justified; `.cflow/architecture.md` and `.cflow/refactor-brief.md` already present | route to `cf-start`, then reassess or align before hard-path design |
| `cf-phase-migration-units` | internal | no | conditional | target direction already aligned; `.cflow/architecture.md` and `.cflow/refactor-brief.md` already present | route to `cf-start` or `cf-phase-target-shape` first |
| `cf-step-safety-net` | internal | no | conditional | architecture map plus a clear current work unit; if no brief exists, the prompt must give an explicit local, behavior-preserving scope | stop and route to `cf-start` or the correct `cf-phase-*` skill |
| `cf-step-boundary-apply` | internal | no | conditional | architecture map plus a mapped split-oriented work unit; if no brief exists, the prompt must give an explicit local, behavior-preserving scope | stop and route to `cf-start` or `cf-phase-concentration-map` |
| `cf-step-consolidate-seam` | internal | no | conditional | architecture map plus a mapped consolidate-oriented work unit; if no brief exists, the prompt must give an explicit local, behavior-preserving scope | stop and route to `cf-start` or the correct `cf-phase-*` skill |
| `cf-step-local-simplify` | internal | no | conditional | architecture map plus an already touched local area; if no brief exists, the prompt must make that touched area explicit and local | stop and route to `cf-start` or the correct `cf-phase-*` skill |
| `cf-review` | internal | no | conditional | architecture map plus a completed bounded step or an explicit touched area to judge; brief optional | route to `cf-start` if the current unit or path is unclear |
| `cf-verify` | internal | no | conditional | architecture map plus a completed bounded step or an explicit touched area to verify; brief optional | route to `cf-start` if the verification target is unclear |
| `cf-feedback-intake` | internal | no | conditional | architecture map plus existing feedback and enough repository evidence to verify it; brief optional | route to `cf-start` if the feedback changes plan and the current path is unclear |

## Artifact And Edit Surface

| Skill | `.cflow/architecture.md` expectation | `.cflow/refactor-brief.md` expectation | Artifact behavior | May edit code |
| --- | --- | --- | --- | --- |
| `cf-start` | optional | optional | full bootstrap and refresh of Cflow artifacts | via internal routing |
| `cf-phase-discovery` | optional | optional | may create or refresh `architecture.md`; may create or refresh `refactor-brief.md` for non-trivial work | no |
| `cf-phase-brainstorming` | optional | optional | may refresh `architecture.md`; may create or refresh `refactor-brief.md` once alignment is sufficient | no |
| `cf-phase-concentration-map` | required | optional; explicit scope if absent | may create or update `refactor-brief.md`; may also update assessment and target fields when the likely mode changes | no |
| `cf-phase-fragmentation-map` | required | optional; explicit scope if absent | may create or update `refactor-brief.md`; may also update assessment and target fields when the likely mode changes | no |
| `cf-phase-target-shape` | required | required | refresh existing brief fields for hard-path direction | no |
| `cf-phase-migration-units` | required | required | refresh existing brief fields for migration planning | no |
| `cf-step-safety-net` | required | optional; explicit local scope if absent | may create or update `refactor-brief.md` while locking the current work unit | no |
| `cf-step-boundary-apply` | required | optional; explicit local scope if absent | may create or update `refactor-brief.md` while executing the current bounded split step | yes |
| `cf-step-consolidate-seam` | required | optional; explicit local scope if absent | may create or update `refactor-brief.md` while executing the current bounded consolidation step | yes |
| `cf-step-local-simplify` | required | optional; explicit local touched area if absent | updates existing `refactor-brief.md` only | yes |
| `cf-review` | required | optional | updates existing `refactor-brief.md` only | no |
| `cf-verify` | required | optional | updates existing `refactor-brief.md` only | no |
| `cf-feedback-intake` | required | optional | updates existing `refactor-brief.md` only | no |

## Maintainer Use

Use this file to answer questions like:

- should this skill stop or continue when invoked directly?
- which prerequisites are real versus only typical?
- can this skill create or refresh artifacts on its own?
- is a proposed gate actor-based or state-based?

When a skill contract changes, update this matrix, the skill file, and the reference section in [maintaining-this-pack.md](/Users/blazar/Dev/clean-flow/docs/maintaining-this-pack.md).
