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
Their contracts live as phase references under `skills/cf-start/references/`.

## Skill Entrypoints

| Skill | Role | Supported direct human entrypoint | Minimum context to proceed | Artifact behavior | May edit code |
| --- | --- | --- | --- | --- | --- |
| `cf-start` | workflow controller | yes | repository state only; existing `.cflow/*` artifacts are optional | owns workflow entry plus creation or refresh of `.cflow/refactor-brief.md`; routes to `cf-architecture-map` when architecture bootstrap or refresh is needed | yes, through execution phase |
| `cf-architecture-map` | repository map | yes | repository state only; existing `.cflow/architecture.md` is optional | creates or refreshes `.cflow/architecture.md`, bootstraps `.cflow/`, updates `.gitignore` for `.cflow/`, never creates `.cflow/refactor-brief.md` | no |
| `cf-cognitive` | local cognitive cleanup | yes | repository state plus up to three optional source file targets | does not create or update `.cflow/*`; discovers up to three justified candidates when needed | yes |
| `cf-file-split` | local file split | yes | repository state plus one explicit or inferable target source file | does not create or update `.cflow/*`; evaluates or executes one scoped file-level split | yes |

## cf-start Phase References

| Reference | Phase contract | Minimum context | If context missing | May edit code |
| --- | --- | --- | --- | --- |
| `references/routing.md` | choose entry mode, fresh path, or resume point | prompt, repository state, and any existing `.cflow/*` artifacts | route to the required public entrypoint or earlier phase | no |
| `references/artifacts.md` | define `.cflow/refactor-brief.md` updates | decision to create, refresh, or update brief state | defer artifact update until required fields are known | no |
| `references/assessment.md` | premise check, intervention framing, alignment | current `.cflow/architecture.md`; brief optional | route to `cf-architecture-map` when architecture is missing or stale | no |
| `references/planning.md` | work-unit planning, hard-path target shape, migration units | architecture map plus assessed direction, candidate areas, or explicit bounded scope | return to assessment or alignment | no |
| `references/mapping.md` | concentration and fragmentation seam mapping | architecture map plus active work unit, brief, or explicit local/repo scope | return to assessment or planning | no |
| `references/execution.md` | safety lock, split execution, consolidation execution, local simplify | architecture map plus clear work unit or explicit local behavior-preserving scope | return to mapping, planning, or assessment | yes |
| `references/closure.md` | review, verification, feedback intake | architecture map plus completed unit, touched area, or concrete feedback | return to resume routing or assessment | no |

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
