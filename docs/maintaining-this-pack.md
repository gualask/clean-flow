# Maintaining This Pack

## Scope

This repository is the source pack for Cflow.
It is not a target repository that uses Cflow at runtime.

At runtime:

- skills are installed into `.agents/skills` in the target repository, or into `$HOME/.agents/skills` for global install
- Cflow artifacts live in the target repository under `.cflow/`
- this source repository does not need `.cflow/` artifacts

## Runtime Model

Cflow has two maintainer concerns:

1. distribution
   - `cflow-skills install` is an idempotent sync for both first install and later updates
   - `cflow-skills install --tag <tag>` delegates to the exact tag from the official repository, allowing upgrade or downgrade without changing the caller's checkout
   - it materializes public skill directories before syncing them
   - auxiliary cleanup warns on failure; failures to inspect, replace, or prune installed skills and references, or remove interrupted staging under the skills directory, fail the install
   - it vendors configured `_shared` files into the consuming skill's `references/` and `scripts/` paths
   - it does not install `_shared` as a runtime skill directory
   - it does not bootstrap repository `.cflow/` artifacts
   - `--friction` alone opts into the separate `install/friction/` assets under `~/.agents/cflow`; see [Friction Log](./friction-log.md)
2. public runtime flows
   - runtime contracts live in the public `SKILL.md` files, first-level linked references, and vendored shared references loaded by an active runtime reference
   - per-public-skill flow docs are maintainer mirrors used to review and validate the runtime contracts

The former internal workflow skills are now `cf-execute` phase references.
They are not packaged as separate skill entrypoints.

## Repository Layout

```text
skills/          authoring source for public skill dirs and shared sources
skills/_shared/  shared authoring references, scripts, and vendoring config
src/             materialization, sync, and fingerprint logic
bin/             CLI entrypoint
test/            filesystem and structure tests
docs/            maintainer documentation
```

## Packaged Skills

Public skill entrypoints:

- `cf-architecture`
- `cf-execute`
- `cf-mr-wolf`
- `cf-scenario`
- `cf-deadcode`
- `cf-cognitive`
- `cf-split`
- `cf-cohesion`
- `cf-review`
- `cf-test`
- `cf-docs`
- `cf-todo`
- `cf-brainstorm`

`cf-execute` phase references:

- `skills/cf-execute/references/artifacts.md`
- `skills/cf-execute/references/concentration-map.md`
- `skills/cf-execute/references/fragmentation-map.md`
- `skills/cf-execute/references/work-unit-planning.md`
- `skills/cf-execute/references/migration-unit-planning.md`
- `skills/cf-execute/references/safety-net.md`
- `skills/cf-execute/references/split-execution.md`
- `skills/cf-execute/references/consolidation-execution.md`
- `skills/cf-execute/references/structural-closure.md`
- `skills/cf-execute/references/local-simplify.md`
- `skills/cf-execute/references/review.md`
- `skills/cf-execute/references/verify.md`

Shared authoring references vendored into consuming skills:

- `skills/_shared/references/design-spec-lifecycle.md`
- `skills/_shared/references/navigation-cost.md`
- `skills/_shared/references/local-refactor-rules.md`
- `skills/_shared/references/local-readability-review.md`
- `skills/_shared/references/file-split-rules.md`
- `skills/_shared/references/reference-audit.md`
- `skills/_shared/references/regression-handling.md`
- `skills/_shared/references/dynamic-agents.md`

Shared authoring scripts vendored into consuming skills:

- `skills/_shared/scripts/repo-tree.mjs`

Delegated agents use the shared provider-neutral context, consent, and terminal-role contract, then explicit phase prompts that live beside the consuming reference:

- `skills/_shared/references/dynamic-agents.md`
- `skills/cf-review/references/review-agent-brief.md`
- `skills/cf-test/references/test-agent-brief.md`

## Golden Rules

Pack-wide golden rules live in [golden-rules.md](./golden-rules.md).

## Source Of Truth

- Public skill contracts live in `skills/*/SKILL.md`.
- `cf-execute` flow selection lives in `skills/cf-execute/SKILL.md`; phase contracts live in `skills/cf-execute/references/*.md`.
- Shared authoring rules live in `skills/_shared/references/`; installed runtime copies live under the consuming skill's `references/` directory. Architecture criteria (structural questions, ownership and contract rules) live in the `## Principles` section of `cf-architecture/SKILL.md`; no other skill reads them. Brainstorm hands ownership of what a feature adds to architecture instead (see the brainstorm flow). Review, scenario, and execute do not load them: two-arm checks found the same lens-4 finding and the same scenario verdict (2026-09-28), and the same adapter placement for a feature unit whose spec left placement open (2026-09-29), with and without them. Per-flow loading conditions live in the consuming controllers. `cf-architecture` keeps its procedure and its ownership and contract rules in `SKILL.md`. The draft → spec cycle (`.cflow/specs/draft.md`, resume, review, promotion) lives once in `design-spec-lifecycle.md`, shared by brainstorm and architecture; each keeps its own process and spec sections (architecture's in its private `references/spec.md`, so the analysis body stays free of spec instructions).
- Shared deterministic helpers live in `skills/_shared/scripts/`; installed runtime copies live under the consuming skill's `scripts/` directory.
- Shared vendoring configuration lives in `skills/_shared/vendor.json`.
- Artifact ownership is declared in the owning skill's `SKILL.md` with an `Owns` bullet naming the `.cflow` path; a contract test rejects any `.cflow` artifact a skill references without an owner. Templates live in public skill `assets/` directories, and any cross-skill use must be an explicit runtime path.
- Codex install prompts live in `install/codex/`.
- Pack-wide maintainer rules live in [golden-rules.md](./golden-rules.md).

Maintainer flow mirrors:

- `cf-architecture`: [architecture/doc-architecture.flow.md](./architecture/doc-architecture.flow.md)
- `cf-execute`: [execute/doc-execute.flow.md](./execute/doc-execute.flow.md)
- `cf-mr-wolf`: [mr-wolf/doc-mr-wolf.flow.md](./mr-wolf/doc-mr-wolf.flow.md)
- `cf-scenario`: [scenario/doc-scenario.flow.md](./scenario/doc-scenario.flow.md)
- `cf-deadcode`: [deadcode/doc-deadcode.flow.md](./deadcode/doc-deadcode.flow.md)
- `cf-cognitive`: [cognitive/doc-cognitive.flow.md](./cognitive/doc-cognitive.flow.md)
- `cf-split`: [split/doc-split.flow.md](./split/doc-split.flow.md)
- `cf-cohesion`: [cohesion/doc-cohesion.flow.md](./cohesion/doc-cohesion.flow.md)
- `cf-review`: [review/doc-review.flow.md](./review/doc-review.flow.md)
- `cf-test`: [test/doc-test.flow.md](./test/doc-test.flow.md)
- `cf-docs`: [docs/doc-docs.flow.md](./docs/doc-docs.flow.md)
- `cf-todo`: [todo/doc-todo.flow.md](./todo/doc-todo.flow.md)
- `cf-brainstorm`: [brainstorm/doc-brainstorm.flow.md](./brainstorm/doc-brainstorm.flow.md)

## Runtime Reference Rules

Use `references/` to keep `SKILL.md` lean without hiding the core contract.

Keep in `SKILL.md`:

- what the skill is for
- when it should be used
- hard gates and routing laws
- phase order or branch-order contract
- first-level reference loading decisions
- the output section list and the output rules every flow shares

Move to `references/`:

- phase-specific preflight
- detailed decision tables
- local subpath and agent selection
- prompt, input, and output contracts for agents selected by that reference
- artifact field update lists
- execution heuristics
- review and verification lenses
- what each output section holds in that flow

Every first-level runtime reference loaded by `SKILL.md` must be linked from `SKILL.md` with its loading condition.
Vendored shared references may be loaded by an already-active consuming reference, but runtime text must use installed-local paths such as `references/...` or `scripts/...`.
Do not duplicate the same rule in both `SKILL.md` and a reference unless `SKILL.md` needs a compact summary for routing.
When removing a duplicate, prefer keeping the copy in the file the model has open when it acts, usually the flow reference's Output or Verification. Indication, not a measured effect: on cf-split (2026-10-03) moved tests ran 4/4 on one cell with the Output lines in the flow reference and 1/3 with the same lines only in `SKILL.md`, which suggests but does not separate a position effect. The same line repeated in alternative flow references, one loaded per flow, is not a duplicate.

## Key Design Decisions

- Cflow does not depend on `AGENTS.md` for manual start or artifact-backed resume.
- Each public skill's maintainer flow mirror lives in `docs/<public-skill>/doc-*.flow.md`; do not keep duplicate flow copies in maintainer overview docs. When a mirror and the runtime disagree, `SKILL.md` and its loaded references win; fix the mirror.
- The former internal workflow skills remain `cf-execute` phase references, not separately packaged entrypoints.
- `_shared` is authoring source for references and scripts vendored into multiple runtime skill directories.

## Skill Change Validation

When changing the pack, validate both:

1. direct human invocation of each public skill
2. `cf-execute` flow selection plus phase execution through the relevant reference

Checklist:

- `description`: does the public skill metadata still trigger correctly?
- `Flow links`: does each controller `SKILL.md` link every runtime reference inside the flow slice that first uses it?
- `State gates`: are gates based on artifacts and repository state rather than actor identity?
- `Artifact behavior`: do create, refresh, assume, or update rules match the phase?
- `Runtime boundary`: does every runtime rule live in a skill or linked reference, not only in docs?
- `Output contract`: does the output still give the next phase enough state?
- `Flow doc sync`: does the affected `docs/<public-skill>/doc-*.flow.md` reflect the public flow?
- `Context map`: does the union of required and conditional files in `src/commands/skill-token-report.context.json` still exactly match reachable runtime Markdown, with same-thread handoffs still accurate?

Token budget report:

```bash
pnpm report
pnpm report -- cf-execute
```

The report recursively inventories Markdown under each materialized skill's `references/` and `assets/`, then separates that inventory from configured flow stacks. `src/commands/skill-token-report.context.json` is local maintainer input: each flow lists required files, conditional files, and handoffs that can add another skill in the same thread. The estimate counts the pack discovery metadata once, adds each activated `SKILL.md`, and reports both required and maximum reachable contract tokens. It excludes system and developer instructions, tools, conversation history, project files, and dynamic command output.

With a context map enabled, the report follows Markdown citations transitively from every public `SKILL.md` after shared files are materialized. The union of configured required and conditional files must exactly match that reachable set, explicit `### ... Flow` headings must match configured flow names, and direct citations inside those sections must belong to the same flow. Adding or removing a public skill is also an exact-coverage error until the JSON is updated. The validator cannot infer whether a reachable file is required or conditional, so that classification and handoff semantics remain a maintainer decision.

The packaged skills root uses that context map automatically. A custom `--skills-root` keeps the inventory-only report unless `--context-map <path>` is also passed. Budget warnings remain per runtime file and are emitted by `pnpm test`; flow totals are diagnostic estimates for maintainer review, not hard limits.

## Maintainer Workflow

When changing the pack:

- update the relevant public `SKILL.md`
- update the relevant `cf-execute/references/*.md` phase contract
- update the affected `docs/<public-skill>/doc-*.flow.md` when a public skill flow changes
- update this document when maintainer rules change
- if artifact structure changes, update the owning skill's `assets/*.template.md`
- if install/remove behavior changes, update `src/` and filesystem tests
- if delegated-agent behavior changes, update the agent brief reference, the consuming `SKILL.md`, the affected flow doc, and tests together
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
- remove of Cflow-owned skill dirs while preserving foreign entries
- exact-tag install delegation and temporary-checkout cleanup
- structural checks for packaged public skills
- materialized runtime reference, script, and asset links
- exact context-map coverage of public skills, declared flows, and transitively reachable runtime Markdown
- packaged routing only to public skills that exist
- every referenced `.cflow` artifact is owned by a skill in the pack
- repository orientation goes through the bundled tree script instead of a stored map
- token budget warnings for packaged runtime files
- presence of per-public-skill flow docs

## Manual Smoke Checks

The most important manual validation is a real target-repo run:

1. install the pack into a target repo
2. exercise each public skill according to its `docs/<public-skill>/doc-*.flow.md` reference
3. confirm the target repo gets `.agents/skills/...`
4. confirm no `.agents/skills/_shared` directory is installed
5. confirm vendored shared files exist inside the consuming skill directories
7. confirm runtime artifacts match the owning public flow docs
