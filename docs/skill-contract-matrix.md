# Skill Contract Matrix

This file is the compact contract baseline for entry, gating, and routing decisions.

Use it together with [maintaining-this-pack.md](./maintaining-this-pack.md).
The source of truth remains each `skills/*/SKILL.md` and the runtime references directly linked from that skill.

## Runtime Shape

Cflow now ships four public skill entrypoints:

- `cf-start`
- `cf-architecture-map`
- `cf-cognitive`
- `cf-file-split`

The former internal workflow skills are not packaged as separate skill entrypoints.
Their contracts live as granular phase references under `skills/cf-start/references/`.

Cflow also ships one Codex custom agent:

- `cflow_architecture_recon`, sourced from `skills/_codex_agents/cflow_architecture_recon.toml` and installed into `.codex/agents/` or `$CODEX_HOME/agents`, configured as read-only `gpt-5.4-mini` reconnaissance for `cf-architecture-map`.

## Skill Entrypoints

| Skill | Role | Supported direct human entrypoint | Minimum context to proceed | Artifact behavior | May edit code |
| --- | --- | --- | --- | --- | --- |
| `cf-start` | workflow controller | yes | repository state only; existing `.cflow/*` artifacts are optional | owns workflow entry plus creation or refresh of `.cflow/refactor-brief.md`; routes to `cf-architecture-map` when architecture bootstrap or refresh is needed | yes, through execution phase |
| `cf-architecture-map` | repository map | yes | repository state only; existing `.cflow/architecture.md` is optional | uses the read-only `cflow_architecture_recon` custom agent before artifact writes when available; while it runs, the controller only checks artifacts, `.gitignore`, template, and worktree status; creates or refreshes `.cflow/architecture.md`, bootstraps `.cflow/`, updates `.gitignore` for `.cflow/`, never creates `.cflow/refactor-brief.md` | no |
| `cf-cognitive` | local cognitive cleanup | yes | repository state plus up to three optional source file targets | does not create or update `.cflow/*`; discovers up to three justified candidates when needed | yes |
| `cf-file-split` | local file split | yes | repository state plus one explicit or inferable target source file | does not create or update `.cflow/*`; evaluates or executes one scoped file-level split | yes |

## cf-start Phase References

| Reference | Phase contract | Minimum context | If context missing | May edit code |
| --- | --- | --- | --- | --- |
| `references/routing.md` | choose entry mode, fresh path, or resume point | prompt, repository state, and any existing `.cflow/*` artifacts | route to the required public entrypoint or earlier phase | no |
| `references/artifacts.md` | define `.cflow/refactor-brief.md` updates | decision to create, refresh, or update brief state | defer artifact update until required fields are known | no |
| `references/assessment.md` | premise check and intervention framing | current `.cflow/architecture.md`; brief optional | route to `cf-architecture-map` when architecture is missing or stale | no |
| `references/alignment.md` | user steering after assessment | assessed direction or concrete decision to resolve | return to assessment | no |
| `references/concentration-map.md` | concentration seam mapping and split direction | architecture map plus active unit, brief, or explicit scope | return to assessment or planning | no |
| `references/fragmentation-map.md` | fragmentation seam mapping and consolidation direction | architecture map plus active unit, brief, or explicit scope | return to assessment or planning | no |
| `references/work-unit-planning.md` | soft-path work-unit ordering | architecture map plus assessed direction, candidate area, or explicit bounded scope | return to assessment, alignment, or target shape | no |
| `references/target-shape.md` | hard-path target direction | architecture map, brief, and justified hard path | return to assessment or alignment | no |
| `references/migration-unit-planning.md` | hard-path bounded migration units | architecture map, brief, and aligned target direction | return to target shape or assessment | no |
| `references/safety-net.md` | behavior lock before structural edits | clear current work unit or explicit local behavior-preserving scope | return to planning or map phase | no |
| `references/split-execution.md` | one bounded split-oriented structural step | mapped split seam plus credible safety lock | return to safety net or concentration map | yes |
| `references/consolidation-execution.md` | one bounded consolidation-oriented structural step | consolidation-ready seam plus credible safety lock | return to safety net or fragmentation map | yes |
| `references/local-simplify.md` | local readability cleanup after structural work | recently touched area | return to `cf-start` if unanchored | yes |
| `references/review.md` | structural review after bounded work | completed step or explicit touched area | return to resume routing or assessment | no |
| `references/verify.md` | factual verification after bounded work | completed unit or explicit touched area | return to resume routing or assessment | no |
| `references/feedback-intake.md` | verified intake of refactor feedback | concrete feedback and touched area | return to resume routing or assessment | no |

## Execution Modes

- `soft-mixed` is allowed only as a repository-level assessment outcome.
- Every executable work unit must declare exactly one mode: `split` or `consolidate`.
- A local fast lane may skip planning only when one explicit, local, low-risk, behavior-preserving cohesive unit is already clear enough to map, lock, or execute.
- Work-unit planning is required when multiple candidates, dependency/order decisions, cross-boundary scope, or resumable multi-step work must be sequenced.
- Hard-path work must define target shape and migration units before code edits.

## Maintainer Use

Use this file to answer:

- which shipped skill should trigger?
- which `cf-start` reference owns the phase?
- which artifact may be created or updated?
- whether code edits are allowed?

When a contract changes, update the affected `SKILL.md`, any affected `cf-start/references/*.md`, this matrix, and [maintaining-this-pack.md](./maintaining-this-pack.md) when maintainer rules changed.
