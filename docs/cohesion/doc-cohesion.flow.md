# cf-cohesion Flow

## Purpose

Document the runtime flow for `cf-cohesion`, the standalone skill for finding and fixing local cross-file cohesion problems.

## Runtime Inputs

- Public skill: `skills/cf-cohesion/SKILL.md`
- Discovery reference: `skills/cf-cohesion/references/discovery.md`
- Targeted evaluation reference: `skills/cf-cohesion/references/targeted-evaluation.md`
- Execution reference: `skills/cf-cohesion/references/execution.md`
- Reference audit rules: `skills/_shared/references/reference-audit.md`
- Target artifacts: none; this skill does not create or update `.cflow/*`

## Flow

1. Trigger `cf-cohesion`.
2. Controller chooses exactly one entry mode from `SKILL.md`.
3. If no explicit target was provided, controller loads `references/discovery.md`, scans for at most three candidate clusters, and does not edit.
4. If an explicit target was provided and the current request does not explicitly ask for a move, controller loads `references/targeted-evaluation.md`, builds the cohesion map, and does not edit.
5. If the current request explicitly asks to apply a bounded regrouping, controller loads `references/execution.md`.
6. If the target, mode, or requested outcome is ambiguous, controller asks one focused question.
7. In execution mode, controller performs targeted evaluation first when needed, then moves exactly one clear local cluster.
8. Controller updates imports, exports, call sites, tests, and local paths affected by the regrouping.
9. Controller loads `reference-audit.md` only after moves and audits moved names and paths.
10. Controller runs the smallest relevant check after execution.
11. Final output reports scope, cohesion map, placement decision, checks, and remaining risk.

## Review Checks

- The skill handles already-related files that are scattered, not extraction from one source file.
- It should not create or depend on `.cflow/*`.
- Discovery, targeted evaluation, and execution modes must stay distinct.
- Discovery mode must not edit and must return at most three candidates.
- Targeted evaluation mode must not edit unless the current request explicitly asks to apply the move.
- A recommended regrouping needs real navigation cost, not just similar file names.
- Placement must follow nearest ownership and local convention.
- Broadly shared files must stay outside the local slice.
- The skill should not create top-level architecture folders or generic utility buckets.
- If the move crosses repository boundaries or needs ordered planning, route to `cf-start`.
