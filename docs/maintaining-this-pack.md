# Maintaining This Pack

## Scope

This repository is the source pack for Cflow.
It is not a target repository that uses Cflow at runtime.

At runtime:

- skills are installed as the `cflow` plugin, by Claude Code or Codex, from the `clean-flow` marketplace in this repository
- Cflow artifacts live in the target repository under `.cflow/`
- this source repository does not need `.cflow/` artifacts

## Runtime Model

Cflow has two maintainer concerns:

1. distribution
   - the repository root is the plugin root; each host has its own manifests: `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` for Claude Code, `.codex-plugin/plugin.json` and `.agents/plugins/marketplace.json` for Codex, which reads its own marketplace before Claude Code's
   - both `plugin.json` files share name, version, license and description with `package.json`; Codex-only presentation lives in `.codex-plugin/plugin.json` `interface`
   - the host copies `skills/` as it is, and `skills/` holds only the public skill directories
   - vendored copies of `shared/` files are committed in the consuming skills; `pnpm vendor` writes them, the pre-commit hook blocks a commit where one differs from its source, and the `main` workflow runs the tests on every push and pull request to `main`, the branch the marketplaces install
   - install, update, removal of dropped skills and scope belong to the host; a user receives a new version when `version` changes
   - `cflow-skills migrate` (temporary) moves an installation made by the old installer onto the plugin and changes nothing when run again; `CFLOW_MARKETPLACE=<clone>` points it at a local clone to try it before a release
   - the pack never bootstraps repository `.cflow/` artifacts
2. public runtime flows
   - runtime contracts live in the public `SKILL.md` files, first-level linked references, and vendored shared references loaded by an active runtime reference
   - per-public-skill mirrors hold the sources each rule rests on, quoted and linked; they do not restate the contract

## Repository Layout

```text
.claude-plugin/  Claude Code plugin and marketplace manifests
.codex-plugin/   Codex plugin manifest
.agents/plugins/ Codex marketplace manifest
.githooks/       pre-commit check of vendored copies and manifests
.github/         workflow that runs the tests on main
skills/          the plugin's skills, with their vendored copies
shared/          shared authoring references, scripts, and vendoring config
src/             vendoring, token reports, and the temporary migrate command
bin/             temporary CLI entrypoint (migrate only)
test/            pack.test.mjs (pack-wide checks), skills/ (one file per skill contract), tool tests
docs/            maintainer guide, golden rules, sources/ (one mirror per skill)
```

## Packaged Skills

Public skill entrypoints:

- `cf-architecture`
- `cf-mr-wolf`
- `cf-scenario`
- `cf-deadcode`
- `cf-cognitive`
- `cf-placement`
- `cf-clean`
- `cf-test`
- `cf-docs`
- `cf-brainstorm`

Shared authoring references vendored into consuming skills:

- `shared/references/design-spec-lifecycle.md`
- `shared/references/navigation-cost.md`
- `shared/references/context-gate.md`
- `shared/references/batched-execution.md`
- `shared/references/string-boundaries.md`

Shared authoring scripts vendored into consuming skills:

- `shared/scripts/repo-tree.mjs`
- `shared/scripts/dir-population.mjs`
- `shared/scripts/variant-history.mjs`

## Golden Rules

Pack-wide golden rules live in [golden-rules.md](./golden-rules.md).

## Source Of Truth

- Public skill contracts live in `skills/*/SKILL.md`.
- Shared authoring rules live in `shared/references/`; their committed copies live under the consuming skill's `references/` directory. Architecture criteria (the capability/adapter rule and the brake on new adapters or contracts) live in the body of `cf-architecture/SKILL.md`; no other skill reads them. Brainstorm hands ownership of what a feature adds to architecture instead (see the brainstorm flow). Review and scenario do not load them: two-arm checks found the same lens-4 finding and the same scenario verdict with and without them. Per-flow loading conditions live in the consuming controllers. `cf-architecture` keeps its procedure and its ownership and contract rules in `SKILL.md`. The draft → spec cycle (`.cflow/specs/draft.md`, resume, review, promotion) lives once in `design-spec-lifecycle.md`, shared by brainstorm and architecture; each keeps its own process and spec sections (architecture's in its private `references/spec.md`, so the analysis body stays free of spec instructions).
- Shared deterministic helpers live in `shared/scripts/`; their committed copies live under the consuming skill's `scripts/` directory.
- Shared vendoring configuration lives in `shared/vendor.json`.
- Artifact ownership is declared in the owning skill's `SKILL.md` with an `Owns` bullet naming the `.cflow` path; a contract test rejects any `.cflow` artifact a skill references without an owner. Templates live in public skill `assets/` directories, and any cross-skill use must be an explicit runtime path.
- Codex migration prompts for installations made by the old installer live in `install/codex/`.
- Pack-wide maintainer rules live in [golden-rules.md](./golden-rules.md).

Mirrors (sources of each skill's rules):

- `cf-architecture`: [sources/cf-architecture.md](./sources/cf-architecture.md)
- `cf-mr-wolf`: [sources/cf-mr-wolf.md](./sources/cf-mr-wolf.md)
- `cf-scenario`: [sources/cf-scenario.md](./sources/cf-scenario.md)
- `cf-deadcode`: [sources/cf-deadcode.md](./sources/cf-deadcode.md)
- `cf-cognitive`: [sources/cf-cognitive.md](./sources/cf-cognitive.md)
- `cf-placement`: [sources/cf-placement.md](./sources/cf-placement.md)
- `cf-clean`: [sources/cf-clean.md](./sources/cf-clean.md)
- `cf-test`: [sources/cf-test.md](./sources/cf-test.md)
- `cf-docs`: [sources/cf-docs.md](./sources/cf-docs.md)
- `cf-brainstorm`: [sources/cf-brainstorm.md](./sources/cf-brainstorm.md)

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
- local subpath selection
- artifact field update lists
- execution heuristics
- review and verification lenses
- what each output section holds in that flow

Every first-level runtime reference loaded by `SKILL.md` must be linked from `SKILL.md` with its loading condition.
Vendored shared references may be loaded by an already-active consuming reference, but runtime text must use installed-local paths such as `references/...` or `scripts/...`.
Do not duplicate the same rule in both `SKILL.md` and a reference unless `SKILL.md` needs a compact summary for routing.
When removing a duplicate, prefer keeping the copy in the file the model has open when it acts, usually the flow reference's Output or Verification. Indication, not a measured effect: on cf-split moved tests ran 4/4 on one cell with the Output lines in the flow reference and 1/3 with the same lines only in `SKILL.md`, which suggests but does not separate a position effect. The same line repeated in alternative flow references, one loaded per flow, is not a duplicate.

## Key Design Decisions

- Cflow does not depend on `AGENTS.md` for manual start or artifact-backed resume.
- Each public skill's mirror lives in `docs/sources/<public-skill>.md` and holds the literature each of its rules rests on, with the quote and the link; the contract itself lives only in `SKILL.md` and its references. Measurements stay out of the mirrors.
- `shared/` is authoring source for references and scripts vendored into more than one runtime skill directory; content one skill uses lives in that skill.

## How A Change Is Made

Every change to a runtime line is a trial: an arm with the change, an arm without it, a criterion written before the runs. The pack carries the claim and its numbers; the trial material stays out of the tracked tree, in a git-ignored folder, and no tracked file points to it.

### The cycle

1. **Claim.** Get it from the owner in one sentence: without this, the model does X wrong. A skill's text says what it covers, not what it prevents; a trial measures only the second.
2. **Source.** Find the literature the rule rests on, verify the quote word for word online, and cite it in `docs/sources/cf-<skill>.md`. A rule narrower than its source does harm only when the missing piece sits outside the files the task opens and outside what the model knows; when the bare model is weak on the same point, compare the rule with the source too.
3. **Bed.** A real repository pinned at a commit, or a pinned commit plus a planted patch. Write the oracle from the code, with `file:line`, before any run; never take it from a run. A shipped commit that settled the question is the best oracle: take its parent as the pin and the label from its diff, not its message.
4. **Prompt.** Write it as the user would type it at that point of the flow: name the area by behavior, never the files, the suspicion, the diagnosis, or the step the skill decides. Reach a later branch with the bed's state or a later turn, not by saying it in the prompt.
5. **Arms.** Each arm is a full copy of `skills/`, vendored copies included, with one change: `head` (the current text), the candidate, and the bare model (no pack) when the question is whether a line pays at all. Changing a shared file changes every copy in the arm.
6. **Criterion.** Before the first run, write in the trial folder: what is measured, the accepted outcomes, the decision rule, and what happens on a divergence. Append each outcome to the same file run by run; never change a metric or an exclusion after reading an arm.
7. **One run per arm first.** Replicate only where the arms separate on the endpoint, once on both arms, with the rule written before the replica. A divergence is confirmed when it repeats (2 of 2). Three runs cannot separate 1/3 from 2/3: compute the n a deciding batch needs before buying it.
8. **Read.** Read one raw output per arm before trusting any counter. Check what the model claims (tests run, files read, packages named) in the trace and on the source. Give harm its own endpoint, never hidden in a completeness score.
9. **Decide.** A runtime line stays only with measured harm without it; a stop, a question or a limit stays only when without it the model does wrong work; a rare branch with no harm seen gets no run. When wording sits near 1/3 across every version including `head`, stop rewording and hand the case to the owner.
10. **Port.** Copy the winning text from the arm into `skills/`, run `pnpm vendor` if a shared file changed, and update the skill's test: assert the line, with a comment stating the measured reason in numbers. Update the mirror for any new source. `golden-rules.md` changes only when the owner decides. Run `pnpm test`; commit only when the owner asks.
11. **Report.** Tell the owner in prose: what was checked, described by what it does; how and at what cost; what came out, with the two numbers that matter in the sentence; what changed, or that nothing did; and where the author was wrong. No arm, bed or label names.

### Routing battery

Descriptions are measured by routing, not by reading.

- A labelled prompt set: for each prompt the expected skill and the outcomes accepted (`none` included), covering prompts each skill owns, prompts no skill owns, and the borders between siblings.
- One fresh session per prompt on a fresh copy of the bed, stopped at the first decision: the first skill opened (a skill call, or a read of its `SKILL.md`), the first file write, or the 8th tool call. The endpoint is the first skill opened; a skill the host ships counts as `none`.
- Run both hosts. Change one description per arm: several changed together give misroutes with no attributable cause, and a fix to one moves the error to another skill.
- A non-use clause enters only when a prompt goes to the wrong skill 2 of 2 without it and 0 of 2 with it. Restore the smallest clause that names that prompt, with the destination skill named when there is one: a clause that routes away holds only with its destination. Retest the prompt twice and the skill's own prompts once.
- A misroute whose work is no worse than the right route's, measured on a real bed against its oracle, is a declared border, not a fix.

### Bench

- The bench is the user's environment: network in the sandbox, the user's host config passed back where an isolation flag drops it. Time the repository's own check once inside the bench sandbox before the cells; a check slow or failing there is a bench defect.
- Use the latest installed version of each host and one fixed model per host, recorded with every run. Never mix versions or models in one comparison: an arm made with another version is redone.
- Isolate every run: a fresh clone at the pin; the arm installed as the `cflow` plugin for that invocation only; an isolated `HOME` and host home, so the bare arm is truly empty. Grep each trace for skills you did not install, and reject a run that read another run's logs, homes or sessions.
- Run sequentially. Never edit a driver while it runs. Keep the scripts you reuse in the trial folder, not in a session scratchpad.

### Drivers

Four drivers cover the trials; each saves, per run, the event stream, the answer, the diff of the model's own changes, the skills and references opened, the files read and written, tokens, time and cost.

- **Run**: one or more turns on a fresh clone (resuming the session for each turn), with a pin, an optional base patch committed invisibly, an optional visible patch, untracked files and seeded `.cflow/` state; arm or bare.
- **Routing**: the battery above. On Claude Code a hook returns `continue: false` at the first decision; on Codex, where `codex exec` skips untrusted hooks, the driver reads the JSON stream and stops at the first `SKILL.md` read, file change, or 8th command.
- **Follow-up**: forks a finished base session once per follow-up prompt (Claude Code `--resume <id> --fork-session`) and stops at the first decision, putting the bed's files back after each fork; a full mode runs the follow-up to the end.
- **Score**: per host and arm, passed over total and each prompt outside its accepted outcomes.

On Claude Code: `claude -p --output-format stream-json --plugin-dir <arm plugin> --setting-sources project --strict-mcp-config --settings <cell settings>`. On Codex: an isolated `CODEX_HOME` with the arm installed from a temporary marketplace holding the shipped manifests, `codex exec -s workspace-write -c sandbox_workspace_write.network_access=true`, `auth.json` copied in for each exec and removed after.

## Skill Change Validation

When changing the pack, validate direct human invocation of each public skill.

Checklist:

- `description`: does the public skill metadata still trigger correctly?
- `Flow links`: does each controller `SKILL.md` link every runtime reference inside the flow slice that first uses it?
- `State gates`: are gates based on artifacts and repository state rather than actor identity?
- `Artifact behavior`: do create, refresh, assume, or update rules match the phase?
- `Runtime boundary`: does every runtime rule live in a skill or linked reference, not only in docs?
- `Output contract`: does the output still give the next phase enough state?
- `Sources`: does `docs/sources/<public-skill>.md` cite the source of every rule the change adds or changes?
- `Context map`: does the union of required and conditional files in `src/commands/skill-token-report.context.json` still exactly match reachable runtime Markdown, with same-thread handoffs still accurate?

Token budget report:

```bash
pnpm report
pnpm report -- cf-clean
```

The report recursively inventories Markdown under each skill's `references/` and `assets/`, then separates that inventory from configured flow stacks. `src/commands/skill-token-report.context.json` is local maintainer input: each flow lists required files, conditional files, and handoffs that can add another skill in the same thread. The estimate counts the pack discovery metadata once, adds each activated `SKILL.md`, and reports both required and maximum reachable contract tokens. It excludes system and developer instructions, tools, conversation history, project files, and dynamic command output.

With a context map enabled, the report follows Markdown citations transitively from every public `SKILL.md`. The union of configured required and conditional files must exactly match that reachable set, explicit `### ... Flow` headings must match configured flow names, and direct citations inside those sections must belong to the same flow. Adding or removing a public skill is also an exact-coverage error until the JSON is updated. The validator cannot infer whether a reachable file is required or conditional, so that classification and handoff semantics remain a maintainer decision.

The packaged skills root uses that context map automatically. A custom `--skills-root` keeps the inventory-only report unless `--context-map <path>` is also passed. Budget warnings remain per runtime file and are emitted by `pnpm test`; flow totals are diagnostic estimates for maintainer review, not hard limits.

## Maintainer Workflow

When changing the pack, after the cycle above:

- update the relevant public `SKILL.md`
- update the relevant `references/*.md` the skill links
- update `docs/sources/<public-skill>.md` when a rule is added or changed
- update this document when maintainer rules change
- if artifact structure changes, update the owning skill's `assets/*.template.md`
- if a shared file changes, run `pnpm vendor`
- if the plugin layout or manifests change, run `claude plugin validate .` and update the plugin tests
- keep `README.md` focused on user-facing install and usage

## Testing

Run:

```bash
pnpm test
```

Current automated coverage checks:

- both plugin manifests against `package.json` (name, version, license) and each other (description), and each host's marketplace entry
- `skills/` holding only skill directories
- every vendored copy equal to its `shared/` source, and no skill file pointing at `shared/`
- `migrate`: finds `codex` on PATH or, failing that, the newest one bundled in a Codex IDE extension; changes nothing without one; installs the Codex plugin once, then removes only skills the old installer owned and the friction pieces; changes nothing on a second run; leaves the old skills when the plugin install fails
- structural checks for packaged public skills
- runtime reference, script, and asset links inside each skill
- exact context-map coverage of public skills, declared flows, and transitively reachable runtime Markdown
- packaged routing only to public skills that exist
- every referenced `.cflow` artifact is owned by a skill in the pack
- repository orientation goes through the bundled tree script instead of a stored map
- token budget warnings for packaged runtime files
- a mirror in `docs/sources/` for every public skill, with every link resolving

## Manual Smoke Checks

The most important manual validation is a real target-repo run:

1. install the plugin from a clean clone of the working tree, since a local path also copies untracked files such as the trial folder and `node_modules/`: `claude plugin marketplace add <clone>` and `claude plugin install cflow@clean-flow`, or `codex plugin marketplace add <clone>` and `codex plugin add cflow@clean-flow`
2. exercise each public skill on a real task
3. confirm the host lists the ten skills as `cflow:cf-*`
4. confirm each `.cflow/` artifact is the one the owning `SKILL.md` declares
