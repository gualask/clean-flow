# cf-start Flow

## Purpose

Document the runtime flow for `cf-start`, the public workflow controller for Cflow assessment, planning, execution, review, verification, feedback intake, and resume.

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
4. If architecture context is missing or stale, controller routes to `cf-architecture-map` before continuing.
5. If `.cflow/refactor-brief.md` is needed, controller uses `references/artifacts.md` and `refactor-brief.template.md`.
6. Fresh work enters `assessment.md`; non-trivial fresh assessment stops at alignment.
7. User steering after assessment enters `alignment.md` until direction is clear enough.
8. Soft-path work routes through work-unit planning or directly to mapping only when one local low-risk unit is already clear.
9. Hard-path work routes through target-shape and migration-unit planning before any code edits.
10. Execution routes through safety net, split or consolidation execution, optional local simplify, review, and verify.
11. Feedback routes through feedback intake before returning to alignment or the appropriate resume point.
12. Controller keeps `.cflow/refactor-brief.md` current when resumable state matters.

## Review Checks

- `cf-start` remains the only workflow controller.
- Runtime behavior lives in `SKILL.md` or a directly linked reference, not only in docs.
- Phase routing is state-based, not actor-based.
- Architecture bootstrap belongs to `cf-architecture-map`; refactor brief ownership belongs to `cf-start`.
- `soft-mixed` is assessment-only; every executable unit is exactly `split` or `consolidate`.
- Hard-path work cannot skip target-shape and migration-unit planning.
- Internal phase references must preserve the former internal-skill guardrails.

