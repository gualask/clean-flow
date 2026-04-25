# cf-start Flow

## Purpose

Document the runtime flow for `cf-start`, the public workflow controller for Cflow assessment, planning, execution, review, verification, feedback intake, and resume.
When the upstream problem is too ambiguous for Cflow assessment, `cf-start` hands off to `cf-mr-wolf`.

## Runtime Inputs

- Public skill: `skills/cf-start/SKILL.md`
- Phase references: `skills/cf-start/references/*.md`
- Shared references: `skills/_shared/references/*.md` when linked by a phase
- Artifact templates: `skills/cf-start/assets/architecture.template.md`, `skills/cf-start/assets/refactor-brief.template.md`
- Target artifacts: `.cflow/architecture.md`, `.cflow/refactor-brief.md`

## Flow

1. Trigger `cf-start`.
2. Controller reads the hard gates, DOT flow diagrams, reference map, and output contracts from `cf-start/SKILL.md`.
3. Controller loads `references/routing.md` when it must decide fresh entry, resume, review, verify, or route handoff.
4. If the problem, goal, scope, or success criteria are not clear enough for Cflow assessment, controller routes to `cf-mr-wolf` before creating Cflow artifacts.
5. If architecture context is missing or stale, controller routes to `cf-architecture-map` before continuing.
6. If `.cflow/refactor-brief.md` is needed, controller uses `references/artifacts.md` and `refactor-brief.template.md`.
7. Fresh work enters `assessment.md`; non-trivial fresh assessment stops at alignment.
8. User steering after assessment enters `alignment.md` until direction is clear enough.
9. Soft-path work routes through work-unit planning or directly to mapping only when one local low-risk unit is already clear.
10. Hard-path work routes through target-shape and migration-unit planning before any code edits.
11. Execution routes through safety net, split or consolidation execution, optional local simplify, review, and verify.
12. Feedback routes through feedback intake before returning to alignment or the appropriate resume point.
13. Controller keeps `.cflow/refactor-brief.md` current when resumable state matters.

## Phase Contracts

| Reference | Phase contract | Minimum context | If context missing | May edit code |
| --- | --- | --- | --- | --- |
| `references/routing.md` | choose entry mode, upstream problem-shaping handoff, fresh path, or resume point | prompt, repository state, and any existing `.cflow/*` artifacts | route to the required public entrypoint or earlier phase | no |
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

## Review Checks

- `cf-start` remains the only workflow controller.
- Upstream problem ambiguity routes to `cf-mr-wolf` before `.cflow/*` artifacts are created or updated.
- Runtime behavior lives in `SKILL.md` or a directly linked reference, not only in docs.
- Phase routing is state-based, not actor-based.
- Architecture bootstrap belongs to `cf-architecture-map`; refactor brief ownership belongs to `cf-start`.
- `soft-mixed` is assessment-only; every executable unit is exactly `split` or `consolidate`.
- Hard-path work cannot skip target-shape and migration-unit planning.
- Internal phase references must preserve the former internal-skill guardrails.
