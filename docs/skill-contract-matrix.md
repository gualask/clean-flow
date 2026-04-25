# Skill Contract Matrix

This file is the compact contract index for entry, gating, and routing decisions.
It intentionally does not restate the runtime flow of public skills.

Use it together with [maintaining-this-pack.md](./maintaining-this-pack.md).
The source of truth remains each `skills/*/SKILL.md`, the runtime references directly linked from that skill, and the per-public-skill flow docs linked below.

## Runtime Shape

Cflow ships four public skill entrypoints:

- `cf-start`: [start/doc-start.flow.md](./start/doc-start.flow.md)
- `cf-architecture-map`: [architecture-map/doc-architecture.map.flow.md](./architecture-map/doc-architecture.map.flow.md)
- `cf-cognitive`: [cognitive/doc-cognitive.flow.md](./cognitive/doc-cognitive.flow.md)
- `cf-file-split`: [file-split/doc-file.split.flow.md](./file-split/doc-file.split.flow.md)

The former internal workflow skills are not packaged as separate skill entrypoints.
Their contracts live as granular phase references under `skills/cf-start/references/`.

Cflow also ships the Codex custom agent source under `skills/_codex_agents/`.
The public flow that consumes it is documented in [architecture-map/doc-architecture.map.flow.md](./architecture-map/doc-architecture.map.flow.md).

## Skill Entrypoints

| Skill | Role | Flow reference |
| --- | --- | --- |
| `cf-start` | workflow controller | [cf-start flow](./start/doc-start.flow.md) |
| `cf-architecture-map` | repository map | [cf-architecture-map flow](./architecture-map/doc-architecture.map.flow.md) |
| `cf-cognitive` | local cognitive cleanup | [cf-cognitive flow](./cognitive/doc-cognitive.flow.md) |
| `cf-file-split` | local file split | [cf-file-split flow](./file-split/doc-file.split.flow.md) |

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

Execution-mode flow rules are maintained in [start/doc-start.flow.md](./start/doc-start.flow.md) and the relevant `skills/cf-start/references/*.md` files.
Do not keep a parallel copy in this matrix.

## Maintainer Use

Use this file to answer:

- which shipped skill should trigger?
- which `cf-start` reference owns the phase?
- where the authoritative public-skill flow is documented?

When a contract changes, update the affected `SKILL.md`, any affected `cf-start/references/*.md`, the affected per-public-skill flow doc, this matrix when ownership/indexing changes, and [maintaining-this-pack.md](./maintaining-this-pack.md) when maintainer rules changed.
