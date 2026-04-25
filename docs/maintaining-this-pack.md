# Maintaining This Pack

## Scope

This repository is the source pack for Cflow.
It is not a target repository that uses Cflow at runtime.

At runtime:

- skills are installed into `.agents/skills` in the target repository, or into `$CODEX_HOME/skills` / `~/.codex/skills` for global install
- Cflow artifacts live in the target repository under `.cflow/`
- this source repository does not need `.cflow/architecture.md` or `.cflow/refactor-brief.md`

## Runtime Model

Cflow has three runtime pieces:

1. distribution
   - `cflow-skills install` copies public skill directories plus `_shared` support resources
   - install does not bootstrap `.cflow/`
2. bootstrap
   - `cf-architecture-map` uses a read-only clean-context reconnaissance subagent before creating or refreshing `.cflow/architecture.md`
   - `cf-architecture-map` creates or refreshes `.cflow/architecture.md`, bootstraps `.cflow/`, and updates `.gitignore`
   - `cf-start` creates or refreshes `.cflow/refactor-brief.md` when the workflow needs resumable handoff state
3. execution
   - `cf-start` is the workflow controller for assessment, alignment, planning, mapping, execution, review, verify, feedback intake, and resume
   - `cf-cognitive` is a standalone local file-level cognitive complexity entrypoint
   - `cf-file-split` is a standalone local file-level split entrypoint

The former internal workflow skills are now `cf-start` phase references.
They are not packaged as separate skill entrypoints.

## Repository Layout

```text
skills/          canonical skill source
skills/_shared/  shared runtime references used by multiple skills
src/             sync and fingerprint logic
bin/             CLI entrypoint
test/            filesystem and structure tests
docs/            maintainer documentation
```

## Packaged Skills

Public skill entrypoints:

- `cf-start`
- `cf-architecture-map`
- `cf-cognitive`
- `cf-file-split`

`cf-start` phase references:

- `skills/cf-start/references/routing.md`
- `skills/cf-start/references/artifacts.md`
- `skills/cf-start/references/assessment.md`
- `skills/cf-start/references/alignment.md`
- `skills/cf-start/references/concentration-map.md`
- `skills/cf-start/references/fragmentation-map.md`
- `skills/cf-start/references/work-unit-planning.md`
- `skills/cf-start/references/target-shape.md`
- `skills/cf-start/references/migration-unit-planning.md`
- `skills/cf-start/references/safety-net.md`
- `skills/cf-start/references/split-execution.md`
- `skills/cf-start/references/consolidation-execution.md`
- `skills/cf-start/references/local-simplify.md`
- `skills/cf-start/references/review.md`
- `skills/cf-start/references/verify.md`
- `skills/cf-start/references/feedback-intake.md`

Shared support references:

- `skills/_shared/references/local-refactor-rules.md`
- `skills/_shared/references/local-readability-review.md`
- `skills/_shared/references/file-split-rules.md`
- `skills/_shared/references/reference-audit.md`

## Golden Rules

- Keep runtime behavior in the relevant `SKILL.md` or a reference file directly linked from that skill.
- Keep `docs/` maintainer-only; do not assume docs are visible at runtime.
- Prefer state-based gates over actor-based gates.
- Keep `cf-start/SKILL.md` as the controller: identity, hard gates, DOT flow diagrams, reference map, and output contracts.
- Put phase-specific operational detail in `cf-start/references/*.md`.
- Keep `_shared` only for runtime rules consumed by multiple public skills or phase references.
- Do not create separate internal skills unless a phase needs independent triggering as a real user-facing entrypoint.
- Be strict only when the failure mode is concrete and costly.
- Otherwise state the preferred direction plus the conditions that justify exceptions.

## Source Of Truth

- Public skill contracts live in `skills/*/SKILL.md`.
- `cf-start` phase contracts live in `skills/cf-start/references/*.md`.
- Shared runtime rules live in `skills/_shared/references/`.
- Bootstrap templates live in `skills/cf-start/assets/`.
- Agent-specific install instructions live in `install/<agent>/`.

For per-entrypoint and per-phase contracts, use [skill-contract-matrix.md](./skill-contract-matrix.md).
For the shortest runtime walkthrough, use [workflow-map.md](./workflow-map.md).
For real target-repo validation, use [repo-trial-rules.md](./repo-trial-rules.md).

## Runtime Reference Rules

Use `references/` to keep `SKILL.md` lean without hiding the core contract.

Keep in `SKILL.md`:

- what the skill is for
- when it should be used
- hard gates and routing laws
- DOT diagrams for branch-heavy runtime flow
- reference loading map
- output contracts

Move to `references/`:

- phase-specific preflight
- detailed decision tables
- artifact field update lists
- execution heuristics
- review and verification lenses

Every reference file must be linked directly from `SKILL.md` with a trigger condition.
Keep references one level deep from `SKILL.md`.
Do not duplicate the same rule in both `SKILL.md` and a reference unless `SKILL.md` needs a compact summary for routing.

## Key Design Decisions

- Cflow does not depend on `AGENTS.md` for manual start or artifact-backed resume.
- `cf-start` is the only workflow controller.
- `cf-architecture-map` owns `.cflow/` bootstrap, `.gitignore` updates, and `.cflow/architecture.md`.
- `cf-architecture-map` keeps subagent reconnaissance read-only; the main controller owns final interpretation and artifact writes.
- `cf-start` owns workflow entry, phase routing, and `.cflow/refactor-brief.md`.
- `cf-cognitive` and `cf-file-split` do not create or require `.cflow/*` artifacts.
- `soft-mixed` is a repository-level assessment outcome, not an execution mode.
- Every executable work unit must choose exactly one mode: `split` or `consolidate`.
- A local fast lane may skip work-unit planning when one explicit, local, low-risk, behavior-preserving cohesive unit is already clear enough.
- Work-unit planning is required when multiple candidates, dependency/order decisions, cross-boundary scope, or resumable multi-step work must be sequenced.
- Hard-path work must define target shape and migration units before code edits.
- After non-trivial fresh assessment, `cf-start` must stop at an alignment checkpoint.
- After that checkpoint, simple confirmation may proceed; material steering stays in alignment until the path is clear enough.
- In `.cflow/refactor-brief.md`, `current work unit` means the active selected unit only; after a completed safe stop with no new unit selected, it should be `none`.

## Skill Change Validation

When changing the pack, validate both:

1. direct human invocation of each public skill
2. `cf-start` phase routing through the relevant reference

Checklist:

- `description`: does the public skill metadata still trigger correctly?
- `Reference map`: does `cf-start/SKILL.md` link every runtime reference it may need?
- `State gates`: are gates based on artifacts and repository state rather than actor identity?
- `Artifact behavior`: do create, refresh, assume, or update rules match the phase?
- `Runtime boundary`: does every runtime rule live in a skill or linked reference, not only in docs?
- `Output contract`: does the output still give the next phase enough state?
- `Matrix sync`: does [skill-contract-matrix.md](./skill-contract-matrix.md) reflect the same contract?

## Maintainer Workflow

When changing the pack:

- update the relevant public `SKILL.md`
- update the relevant `cf-start/references/*.md` phase contract
- update [skill-contract-matrix.md](./skill-contract-matrix.md) when entrypoint or phase behavior changes
- update [workflow-map.md](./workflow-map.md) when lifecycle or branch flow changes
- update this document when maintainer rules change
- if bootstrap artifact structure changes, update `skills/cf-start/assets/*.template.md`
- if install/remove behavior changes, update `src/` and filesystem tests
- keep `README.md` focused on user-facing install and usage

## Testing

Run:

```bash
npm test
```

Current automated coverage checks:

- install on empty target
- update + prune + preserve foreign skills
- conflict detection on foreign same-name skills
- remove of Cflow-owned skill and support directories only
- structural checks for packaged public skills
- Codex implicit invocation policy for shipped public skills
- presence of `cf-start` bootstrap assets and phase references
- shared reference links from consuming skills and phase references

## Manual Smoke Checks

The most important manual validation is a real target-repo run:

1. install the pack into a target repo
2. invoke `$cf-start` as the standard workflow first-use path
3. invoke `$cf-architecture-map` as standalone mapping
4. invoke `$cf-cognitive` with explicit files and once without a file target
5. invoke `$cf-file-split` once in evaluation mode and once with an explicit local split
6. confirm the target repo gets `.agents/skills/...`
7. confirm `.cflow/`, `.cflow/architecture.md`, `.cflow/refactor-brief.md`, and `.gitignore` are created only by runtime workflow when needed
