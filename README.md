![Clean Flow hero](./public/hero.png)

# Clean Flow

Clean Flow is a skill pack for cleanup and refactor work, for Claude Code and Codex.
It helps an agent understand the repository, choose the right refactor path, and avoid uncontrolled rewrites while still treating hard restructures as first-class when the architecture is the real problem.

## Why Use It

Refactors often fail because the agent starts moving code before it understands the problem, the current boundaries, or the behavior that must stay fixed.
Clean Flow gives the agent a practical operating system for that work:

- **Problem first**: unclear requests are framed before implementation.
- **Repository aware**: structure and evidence are read from the codebase when the work happens, never from a stored map that can drift.
- **Ownership first**: architecture reviews start from who decides what and which abstractions earn their place, not from directory styles.
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

`migrate` installs the Codex plugin first, with `codex` from your PATH, then removes only the skill directories the old installer wrote; without `codex` on PATH it changes nothing; `--global` also removes the friction logger and its `AGENTS.md` block, keeping the logs. Running it again changes nothing. `--dry-run` shows what it would do. Or ask Codex:

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

When you have a symptom or a doubt but not yet the change to make, start with:

```text
Use cf-mr-wolf: this module feels hard to change and I don't know why.
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

Assesses the architecture of a repository or subsystem and proposes a target structure, with the evidence for each part.

### `cf-mr-wolf`

Recovers the goal behind a symptom or a doubt, asking what matters to you before recommending anything.
Asked to fix a defect, it first checks whether the same cause shows up elsewhere in the repository.

### `cf-scenario`

Decides whether a named change is worth making, weighing what it costs in each scenario it touches.

### `cf-deadcode`

Reports which code is unused or unreachable.

### `cf-cognitive`

Finds and reduces local cognitive complexity in source files, such as overloaded functions or deep nesting.

### `cf-placement`

Splits a file that has grown too large into nearby files, or regroups scattered related files into one folder.

### `cf-clean`

Checks pending work, commits, a path, or the whole repository against what the other Cflow skills ask, and routes each finding to the skill that resolves it; call it by name or ask for a Cflow cleanup pass.

### `cf-test`

Reviews tests for assertion quality against observable contracts and invariants.

### `cf-docs`

Writes, updates, trims, and audits Markdown docs against the code, and keeps a lightweight todo file of next steps and open questions.

### `cf-brainstorm`

Turns a feature or product idea into an approved design spec through dialogue, one question at a time.

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
