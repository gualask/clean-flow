![Clean Flow hero](./public/hero.png)

# Clean Flow

Clean Flow is a skill pack for cleanup and refactor work, for Claude Code and Codex.
It helps an agent understand the repository, choose the right refactor path, and avoid uncontrolled rewrites while still treating hard restructures as first-class when the architecture is the real problem.

Use it when you want the agent to:

- clarify an unclear cleanup or refactor goal before touching code
- judge whether the current structure is right, and plan a repository-level refactor when it is not
- explain the real impact of a bug, behavior, or change through concrete code-grounded scenarios
- write, update, or trim docs so they stay accurate against the code
- track decided next steps and open questions in a lightweight todo file
- review an area for overengineering, duplicated parallel flows, or complexity that no longer earns its place
- split an overloaded file into nearby owned files
- reduce local cognitive complexity in a source file
- regroup related files into a more cohesive local feature slice
- check uncommitted work, or the last few commits, against structure rules and authoritative requirements
- brainstorm a new feature or idea into an approved design spec (explicit invocation only)

## Why Use It

Refactors often fail because the agent starts moving code before it understands the problem, the current boundaries, or the behavior that must stay fixed.
Clean Flow gives the agent a practical operating system for that work:

- **Problem first**: unclear requests are framed before implementation.
- **Repository aware**: structure and evidence are read from the codebase when the work happens, never from a stored map that can drift.
- **Domain-led**: architecture reviews start from product workflows, ownership, and external boundaries before current folders.
- **Clean target first**: recommendations optimize for the cleanest evidence-backed structure, not the easiest low-impact workaround.
- **Low ceremony**: boundaries, abstractions, and layers are justified by real ownership, integration, or risk.
- **Resumable**: design conversations keep their questions and decisions in a `.cflow/specs/draft.md` draft until the spec is approved.
- **Scoped**: local cleanup, file splitting, cohesion work, and broad refactors use different entrypoints.

## Quick Start

Clean Flow installs as the `cflow` plugin from this repository's marketplace. Its skills are named `cflow:cf-clean`, `cflow:cf-docs`, and so on; asking for `cf-clean` by name works too.

Claude Code:

```bash
claude plugin install cflow --marketplace gualask/clean-flow
```

Codex:

```bash
codex plugin marketplace add gualask/clean-flow
codex plugin add cflow@clean-flow
```

Start a new session after installing. A new version reaches you when a release changes the plugin version.

### Updates

Claude Code updates the plugin on its own once auto-update is on: in a session run `/plugin`, open **Marketplaces**, select `clean-flow`, and choose **Enable auto-update**. The update lands when a session starts, and the next session loads it. To update by hand, run `claude plugin update cflow@clean-flow`.

To update in Codex, run these by hand or from a scheduled job of your own:

```bash
codex plugin marketplace upgrade clean-flow
codex plugin add cflow@clean-flow
```

To stay on one release, add the marketplace at its tag: `claude plugin marketplace add gualask/clean-flow#<tag>` or `codex plugin marketplace add gualask/clean-flow --ref <tag>`. Only tags from the first plugin release on carry the marketplace.

### Moving From The Old Installer

`cflow-skills install` and `remove` are gone, and a script that calls them now fails. The copies the old installer wrote to `~/.agents/skills` or `<repo>/.agents/skills` stay behind, and Codex lists them next to the plugin. Move them once, from a checkout of this repository:

```bash
node ./bin/cflow-skills.mjs migrate --global
node ./bin/cflow-skills.mjs migrate /path/to/repo
```

`migrate` installs the Codex plugin first, with `codex` from your PATH or the one bundled in the Codex IDE extension, then removes only the skill directories the old installer wrote; when it finds no `codex` it changes nothing; `--global` also removes the friction logger and its `AGENTS.md` block, keeping the logs. Running it again changes nothing. `--dry-run` shows what it would do. Or ask Codex:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/gualask/clean-flow/refs/heads/main/install/codex/GLOBAL.md and migrate Cflow.
```

After installation, ask the agent to use one of the public entrypoints below.
When the concern is the structure of the repository or a subsystem, start with:

```text
Use cf-architecture to assess the architecture of this repository and recommend the next step.
```

Once a spec is approved, ask the agent to implement it; its own planning and tools carry the work:

```text
Implement the approved spec in .cflow/specs/<date>-<topic>.md.
```

When the concern, lens, or desired outcome is still unclear, frame it first:

```text
Use cf-mr-wolf to frame this cleanup/refactor before assessment.
```

<details>
<summary>Uninstall</summary>

```bash
claude plugin uninstall cflow@clean-flow
codex plugin remove cflow@clean-flow
```

</details>

## Public Entrypoints

### `cf-architecture`

Assesses and proposes the architecture of a repository or subsystem, including exploration without a known problem.
Produces one target tree with what each directory owns and the `file:line` that proves it, for discussion and without a plan; when the user takes up a structural change, it records it as an approved spec through the same draft → spec cycle as `cf-brainstorm`. It does not implement changes. Use `cf-scenario` to judge the worth or impact of a named change.

### `cf-mr-wolf`

<img src="./public/wolf.png" alt="cf-mr-wolf thumbnail" width="96" align="left" hspace="12">

Recovers the goal behind a symptom or a doubt that names nothing to decide on: it reads the code, tells you what it found in your terms, says it does not yet know which part matters to you, and asks.  
It is a gate: it investigates and stops, hands off to the owning skill in one line, or steps aside entirely. It offers no menu of options and recommends nothing until you answer.

<br clear="left">

### `cf-scenario`

Decides a named change against the concrete scenarios it touches, grounded in the code.
Use it when a named change needs a worth-doing decision or its cost in other scenarios weighed, not merely to explain current behavior. It opens with **Decision:** (`make it`, `do not make it`, or `make it only if` a condition), then the cost in each scenario with `file:line`. When a doc, spec, or requirement states the behavior a change alters, it gets a `file:line` trace from the changed line to the result a user sees.

### `cf-deadcode`

Reports which code is unreachable when you ask whether something is unused, dead, or safe to delete.
It closes the pass with a table pairing every name that crosses a boundary as a string — an event, a command, a message type, a job name — with the file and line on each side; an empty cell is a finding. It reports and never removes.

### `cf-cognitive`

Finds or reduces local cognitive complexity in source files.
Use it for overloaded functions, deep nesting, hard-to-scan branching, or local readability pressure.

### `cf-placement`

Splits a source file that has grown too large into nearby files, or regroups scattered related files into one folder, preserving behavior.
Use it when a file mixes responsibilities, when related files are hard to find, or to ask whether a file should be split or files should live together.

### `cf-clean`

Checks code against what the other Cflow skills ask: structure, placement, readability, dead names, dependency direction, ownership, leftovers, and documentation drift, each finding routed to the skill that resolves it.

Invoke it by name or ask for a Cflow cleanup or alignment pass; a generic review request does not trigger it. The target is pending work by default, or a named history range, a path, or the whole repository. It does not hunt bugs: one seen while reading is listed apart, with the note that bugs were not searched for. Test assertion quality remains a separate pass. Findings remain evidenced candidates, are limited to remedies a nameable unit can clear, and are routed without being confirmed or fixed; on the whole repository it first maps the code into areas and sweeps one area per run, tracking coverage in `.cflow/cf-clean-map.md`; its only repository writes are that map and the recap, `.cflow/cf-clean-recap.md`.

### `cf-test`

Reviews pending tests, a named history range, explicit tests, or the existing suite against observable contracts and invariants.
It reports missing invariants, invalid domain states, redundant or over-specified assertions, brittle strings, and implementation-detail coupling, grouped by action (`remove`, `rewrite`, `strengthen`, `redesign`), without running the suite; the only repository write is the batched pass's recap, `.cflow/cf-test-recap.md`.

### `cf-docs`

Writes, updates, trims, and reorganizes Markdown docs, READMEs, and design notes against the code, with one owner doc per fact.
It enters when the request writes a Markdown file or asks to audit existing docs against the code; reading a doc to answer something else never triggers it.
A reorganization proposes the target tree and moves files only after you confirm; a CHANGELOG and AGENTS.md or CLAUDE.md follow their own rules (AGENTS.md always in English).
It also keeps a lightweight `todo.md` of next steps and open questions from an analysis or working session, recorded as the session decided them: a decided action without an observable done criterion is asked about, not written, and completed tasks stay checked in place until a later update adds new tasks to a fully completed list.

### `cf-brainstorm`

Turns a feature or product idea into an approved design spec through collaborative dialogue, one question at a time, before any implementation.
Invoke it explicitly ("let's brainstorm ..."); it never triggers on its own, and ambiguous or worth-building questions stay with `cf-mr-wolf`.

## First Use And Resume

Installing the plugin does not create `.cflow/`.

Skills that own durable artifacts create `.cflow/` only when they need it.
When `.cflow/` is created for the first time, Clean Flow writes a `.cflow/.gitignore` containing `*`, so the directory ignores itself and the repository `.gitignore` is never touched.

The normal lifecycle for a structural change or a new feature:

1. design it with `cf-architecture` (structure) or `cf-brainstorm` (feature) until the spec is approved
2. ask the agent to implement the approved spec
3. check the result against Cflow with `cf-clean`

For direct local work, use `cf-cognitive` or `cf-placement` instead.
To check code against Cflow and route what it finds, use `cf-clean`: pending work before you commit, a history range after the fact, a path, or the whole repository.
To inspect assertion quality, run `cf-test` separately against the same target; `cf-clean` does not classify tests or assess their assertions.
For lightweight follow-up tracking from an analysis or working session, ask `cf-docs` to write or update the todo file.

## Documentation

- [Sources of each skill's rules](./docs/sources/)
- [Maintaining this pack](./docs/maintaining-this-pack.md)
