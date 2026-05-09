# cf-mr-wolf Flow

## Purpose

Document the runtime flow for `cf-mr-wolf`, the public entrypoint for lightweight technical framing before implementation or Cflow assessment.

## Runtime Inputs

- Public skill: `skills/cf-mr-wolf/SKILL.md`
- Runtime references: `skills/cf-mr-wolf/references/framing.md`, `decomposition.md`, `evidence.md`, `dynamic-agents.md`, `derisk.md`, `outcomes.md`
- Custom agent source: `skills/_codex_agents/cflow_finding_derisk_recon.toml`
- Current conversation and request
- Focused repository context selected from the clarified request and bounded perimeter
- Optional notes artifact: `.cflow/mr-wolf-notes.md`, created from `skills/cf-mr-wolf/assets/mr-wolf-notes.template.md` when evidence or decisions need durable handoff context

## High-Level Flow

1. Start from the current request. If there is no concrete problem, ask what problem must be solved.
2. Frame the problem: clarify intent, success criteria, constraints, non-goals, uncertainty, risk appetite, and the useful perimeter for the decision under Cflow's clean-by-default standard. For broad architecture or structure requests, ask whether to run a target architecture and tree audit or start from one specific pain.
3. Use `.cflow/mr-wolf-notes.md` only when context, evidence, a slice map, or a handoff should survive the current turn.
4. If the framed request is broad, split it into a compact evidence slice map; otherwise continue with one direct pass.
5. Route early when another skill owns the next lens: `cf-architecture` for missing or stale repository mapping, `cf-start` for repository-level cleanup/refactor assessment or planning, `cf-simplify` for overengineering reviews, `cf-scenario` for concrete impact examples, or `cf-trace` for ordered workflow reconstruction.
6. Collect only evidence needed to choose the route, reduce framing uncertainty, or support the handoff. Treat orientation output as direction, not proof, and verify decision-relevant conclusions against source, tests, or runtime evidence.
7. Treat evidence findings as candidates, keeping behavioral evidence separate from detector, static-rule, preference, and process observations.
8. De-risk only candidate findings that can influence the final output, preferring `cflow_finding_derisk_recon` when available and allowed. For behavioral or cross-flow risks, require a concrete `cf-scenario` check or recommend it as the next verification step before a fix decision.
9. When a slice map exists, continue slice-by-slice until every in-scope slice is done, blocked, deferred, out of scope, or routed.
10. Produce the most scope-appropriate outcome: options, a bounded handoff, a `cf-start` handoff, a `cf-simplify` route, a `cf-scenario` explanation, a `cf-trace` route, a `cf-architecture` route, or a direct local-skill handoff.
