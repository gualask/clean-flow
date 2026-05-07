# cf-start Flow

## Purpose

Document the runtime flow for `cf-start`, the public workflow controller for Cflow assessment, planning, execution, review, verification, and resume.

## Runtime Inputs

- Public skill: `skills/cf-start/SKILL.md`
- Phase references: `skills/cf-start/references/*.md`
- Shared references: `skills/_shared/references/*.md` when linked by an active phase
- Artifact templates: `skills/cf-start/assets/architecture.template.md`, `skills/cf-start/assets/refactor-brief.template.md`
- Target artifacts: `.cflow/architecture.md`, `.cflow/refactor-brief.md`

## High-Level Flow

1. Start from the current request, repository state, and existing Cflow artifacts.
2. Route before workflow work when another public entrypoint owns the request: `cf-mr-wolf` for unclear framing, `cf-simplify` for overengineering or simplification review, `cf-trace` for path audit, local skills for explicit bounded local cleanup, or `cf-architecture` for missing/stale architecture context.
3. For fresh work, run assessment against Cflow's clean-by-default standard plus request-stated constraints and risk appetite, and stop at the decision checkpoint when the work is non-trivial.
4. For resume, re-enter the correct flow from `.cflow/refactor-brief.md` and repository evidence.
5. For soft work, plan or select one bounded split/consolidate unit; for hard work, resolve target shape that may challenge existing false owners, then plan migration units before execution.
6. For one selected structural unit, map the seam, choose the safety net, execute the declared split or consolidation mode, and optionally simplify only the recently touched area.
7. After structural work, review or verify closure and keep `.cflow/refactor-brief.md` current when resumable state changes.
