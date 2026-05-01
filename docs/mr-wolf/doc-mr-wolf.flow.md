# cf-mr-wolf Flow

## Purpose

Document the runtime flow for `cf-mr-wolf`, the public entrypoint for clarifying unclear problems, feature ideas, refactors, architecture changes, and implementation tasks before execution.

## Runtime Inputs

- Public skill: `skills/cf-mr-wolf/SKILL.md`
- Runtime references: `skills/cf-mr-wolf/references/framing.md`, `decomposition.md`, `evidence.md`, `dynamic-agents.md`, `derisk.md`, `outcomes.md`
- Custom agent source: `skills/_codex_agents/cflow_finding_derisk_recon.toml`
- Current conversation and user request
- Focused repository context selected from the clarified request and bounded perimeter
- Notes artifact: `.cflow/mr-wolf-notes.md`, created from `skills/cf-mr-wolf/assets/mr-wolf-notes.template.md`

## High-Level Flow

1. Start from the user request. If there is no concrete problem, ask what problem must be solved.
2. Frame the problem: clarify intent, success criteria, constraints, non-goals, uncertainty, and aggressively zoom in on the smallest useful perimeter.
3. Read or create `.cflow/mr-wolf-notes.md`, then decide whether existing notes still match the current request and repository state.
4. Decide whether the framed request is atomic or broad. Atomic requests go straight to evidence; broad requests are split into a compact slice map.
5. If slice mapping depends on repository shape, entrypoints, boundaries, or ownership that are missing or stale, route to `cf-architecture`.
6. If a slice depends on ordered workflow behavior, state, resume, failure modes, or external effects, route that slice to `cf-trace`.
7. Collect evidence for the active direct scope or slice only. Use tools, focused reads, or agents when they reduce mechanical work.
8. Keep behavioral evidence separate from detector, static-rule, preference, and process observations unless de-risk proves user-visible impact.
9. De-risk candidate findings before treating them as confirmed. Static signals stay candidates until real behavior, counter-evidence, scope, and fix-fit have been checked.
10. When a slice map exists, repeat evidence and de-risk slice-by-slice until every in-scope slice is done, blocked, deferred, out of scope, or routed.
11. Produce the smallest useful outcome: options, a bounded handoff, a `cf-start` handoff, a `cf-trace` route, a `cf-architecture` route, or a direct local-skill handoff.
