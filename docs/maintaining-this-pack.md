# Maintaining This Pack

## Scope

This repository is the source pack for Cflow.
It is not a target repository that uses Cflow at runtime.

At runtime:

- skills are installed into `.codex/skills` in the target repository, or into `$CODEX_HOME/skills` / `~/.codex/skills` for global install
- Codex custom agents are installed into `.codex/agents` in the target repository, or into `$CODEX_HOME/agents` / `~/.codex/agents` for global install
- Cflow artifacts live in the target repository under `.cflow/`
- this source repository does not need `.cflow/architecture.md` or `.cflow/refactor-brief.md`

## Runtime Model

Cflow has two maintainer concerns:

1. distribution
   - `cflow-skills install` is an idempotent sync for both first install and later updates
   - it materializes public skill directories before syncing them
   - it vendors configured `_shared` files into the consuming skill's `references/` and `scripts/` paths
   - it copies Cflow-owned Codex custom agents from `skills/_codex_agents`
   - it does not install `_shared` as a runtime skill directory
   - it does not bootstrap `.cflow/`
2. public runtime flows
   - runtime contracts live in the public `SKILL.md` files, first-level linked references, and vendored shared references loaded by an active runtime reference
   - per-public-skill flow docs are maintainer mirrors used to review and validate the runtime contracts

The former internal workflow skills are now `cf-start` phase references.
They are not packaged as separate skill entrypoints.

## Repository Layout

```text
skills/          authoring source for public skill dirs, shared sources, and custom agents
skills/_codex_agents/
                 canonical Codex custom agent source
skills/_shared/  shared authoring references, scripts, and vendoring config
src/             materialization, sync, and fingerprint logic
bin/             CLI entrypoint
test/            filesystem and structure tests
docs/            maintainer documentation
```

## Packaged Skills

Public skill entrypoints:

- `cf-start`
- `cf-mr-wolf`
- `cf-simplify`
- `cf-architecture`
- `cf-trace`
- `cf-scenario`
- `cf-cognitive`
- `cf-split`
- `cf-cohesion`
- `cf-docs`
- `cf-brainstorm`

`cf-start` phase references:

- `skills/cf-start/references/artifacts.md`
- `skills/cf-start/references/assessment.md`
- `skills/cf-start/references/concentration-map.md`
- `skills/cf-start/references/fragmentation-map.md`
- `skills/cf-start/references/work-unit-planning.md`
- `skills/cf-start/references/target-shape.md`
- `skills/cf-start/references/migration-unit-planning.md`
- `skills/cf-start/references/safety-net.md`
- `skills/cf-start/references/split-execution.md`
- `skills/cf-start/references/consolidation-execution.md`
- `skills/cf-start/references/structural-closure.md`
- `skills/cf-start/references/local-simplify.md`
- `skills/cf-start/references/review.md`
- `skills/cf-start/references/verify.md`

Shared authoring references vendored into consuming skills:

- `skills/_shared/references/navigation-cost.md`
- `skills/_shared/references/local-refactor-rules.md`
- `skills/_shared/references/local-readability-review.md`
- `skills/_shared/references/file-split-rules.md`
- `skills/_shared/references/reference-audit.md`
- `skills/_shared/references/clean-context-recon.md`

Shared authoring scripts vendored into consuming skills:

- `skills/_shared/scripts/repo-tree.mjs`

Codex custom agents:

- `skills/_codex_agents/cflow_architecture_recon.toml`
- `skills/_codex_agents/cflow_trace_recon.toml`
- `skills/_codex_agents/cflow_finding_derisk_recon.toml`

## Golden Rules

Pack-wide golden rules live in [golden-rules.md](./golden-rules.md).

## Source Of Truth

- Public skill contracts live in `skills/*/SKILL.md`.
- `cf-start` flow selection lives in `skills/cf-start/SKILL.md`; phase contracts live in `skills/cf-start/references/*.md`.
- Shared authoring rules live in `skills/_shared/references/`; installed runtime copies live under the consuming skill's `references/` directory.
- Shared deterministic helpers live in `skills/_shared/scripts/`; installed runtime copies live under the consuming skill's `scripts/` directory.
- Shared vendoring configuration lives in `skills/_shared/vendor.json`.
- Bootstrap and artifact templates live in the owning public skill's `assets/` directory.
- Codex custom agent sources live in `skills/_codex_agents/`.
- Codex install prompts live in `install/codex/`.
- Pack-wide maintainer rules live in [golden-rules.md](./golden-rules.md).

For real target-repo validation, use [repo-trial-rules.md](./repo-trial-rules.md).

Maintainer flow mirrors:

- `cf-start`: [start/doc-start.flow.md](./start/doc-start.flow.md)
- `cf-mr-wolf`: [mr-wolf/doc-mr-wolf.flow.md](./mr-wolf/doc-mr-wolf.flow.md)
- `cf-simplify`: [simplify/doc-simplify.flow.md](./simplify/doc-simplify.flow.md)
- `cf-architecture`: [architecture/doc-architecture.flow.md](./architecture/doc-architecture.flow.md)
- `cf-trace`: [trace/doc-trace.flow.md](./trace/doc-trace.flow.md)
- `cf-scenario`: [scenario/doc-scenario.flow.md](./scenario/doc-scenario.flow.md)
- `cf-cognitive`: [cognitive/doc-cognitive.flow.md](./cognitive/doc-cognitive.flow.md)
- `cf-split`: [split/doc-split.flow.md](./split/doc-split.flow.md)
- `cf-cohesion`: [cohesion/doc-cohesion.flow.md](./cohesion/doc-cohesion.flow.md)
- `cf-docs`: [docs/doc-docs.flow.md](./docs/doc-docs.flow.md)
- `cf-brainstorm`: [brainstorm/doc-brainstorm.flow.md](./brainstorm/doc-brainstorm.flow.md)

## Runtime Reference Rules

Use `references/` to keep `SKILL.md` lean without hiding the core contract.

Keep in `SKILL.md`:

- what the skill is for
- when it should be used
- hard gates and routing laws
- phase order or branch-order contract
- first-level reference loading decisions
- output contracts

Move to `references/`:

- phase-specific preflight
- detailed decision tables
- local subpath and agent selection
- prompt, input, and output contracts for agents selected by that reference
- artifact field update lists
- execution heuristics
- review and verification lenses

Every first-level runtime reference loaded by `SKILL.md` must be linked from `SKILL.md` with its loading condition.
Vendored shared references may be loaded by an already-active consuming reference, but runtime text must use installed-local paths such as `references/...` or `scripts/...`.
Do not duplicate the same rule in both `SKILL.md` and a reference unless `SKILL.md` needs a compact summary for routing.

## Key Design Decisions

- Cflow does not depend on `AGENTS.md` for manual start or artifact-backed resume.
- Public skill flow rules live in `docs/<public-skill>/doc-*.flow.md`; do not keep duplicate flow copies in maintainer overview docs.
- The former internal workflow skills remain `cf-start` phase references, not separately packaged entrypoints.
- `_shared` is authoring source for references and scripts vendored into multiple runtime skill directories.
- `skills/_codex_agents` is for real Codex custom agents that should be installed, not notes or examples.

## Skill Change Validation

When changing the pack, validate both:

1. direct human invocation of each public skill
2. `cf-start` flow selection plus phase execution through the relevant reference

Checklist:

- `description`: does the public skill metadata still trigger correctly?
- `Flow links`: does `cf-start/SKILL.md` link every runtime reference inside the flow slice that first uses it?
- `State gates`: are gates based on artifacts and repository state rather than actor identity?
- `Artifact behavior`: do create, refresh, assume, or update rules match the phase?
- `Runtime boundary`: does every runtime rule live in a skill or linked reference, not only in docs?
- `Output contract`: does the output still give the next phase enough state?
- `Flow doc sync`: does the affected `docs/<public-skill>/doc-*.flow.md` reflect the public flow?

Token budget report:

```bash
pnpm report
pnpm report -- cf-start
```

The report shows discovery metadata, `SKILL.md` instruction tokens, each runtime reference or asset, per-skill totals, and the pack total.
Budget warnings are emitted by `pnpm test`; the report is for maintainer review before trimming or moving detail into references.

## Maintainer Workflow

When changing the pack:

- update the relevant public `SKILL.md`
- update the relevant `cf-start/references/*.md` phase contract
- update the affected `docs/<public-skill>/doc-*.flow.md` when a public skill flow changes
- update this document when maintainer rules change
- if artifact structure changes, update the owning skill's `assets/*.template.md`
- if install/remove behavior changes, update `src/` and filesystem tests
- if Codex custom agent behavior changes, update `skills/_codex_agents/*.toml`, the consuming `SKILL.md`, the affected flow doc, and tests together
- keep `README.md` focused on user-facing install and usage

## Testing

Run:

```bash
pnpm test
```

Current automated coverage checks:

- install on empty target
- update + prune + preserve foreign skills
- conflict detection on foreign same-name skills
- remove of Cflow-owned skill dirs, legacy support dirs, and custom agents while preserving foreign entries
- install, update, prune, and remove behavior for Cflow-owned Codex custom agents
- structural checks for packaged public skills
- materialized runtime reference, script, and asset links
- packaged routing only to public skills that exist
- token budget warnings for packaged runtime files
- presence of per-public-skill flow docs

## Manual Smoke Checks

The most important manual validation is a real target-repo run:

1. install the pack into a target repo
2. exercise each public skill according to its `docs/<public-skill>/doc-*.flow.md` reference
3. confirm the target repo gets `.codex/skills/...`
4. confirm no `.codex/skills/_shared` directory is installed
5. confirm vendored shared files exist inside the consuming skill directories
6. confirm the target repo gets Cflow-owned custom agents under `.codex/agents/`
7. confirm runtime artifacts match the owning public flow docs
