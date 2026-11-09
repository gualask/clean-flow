![Clean Flow hero](./public/hero.png)

# Clean Flow

Clean Flow is a skill pack for cleanup and refactor work.
It helps an agent understand the repository, choose the right refactor path, and avoid uncontrolled rewrites while still treating hard restructures as first-class when the architecture is the real problem.

## Why Use It

Refactors often fail because the agent starts moving code before it understands the problem, the current boundaries, or the behavior that must stay fixed. Clean Flow keeps that work in check:

- **Problem first**: when a request does not say what should change, the agent reads the code and asks what matters to you before touching anything.
- **Clear ownership**: architecture reviews weigh candidate forms against what the system must guarantee, and every boundary has to earn its place.
- **Low ceremony**: a new boundary, abstraction, or layer is proposed only when the code already needs it.
- **Behavior preserved**: refactors run the tests that cover what they change, and claim behavior is preserved only when those pass.
- **Report before change**: checks report and route what they find; they do not edit your code.
- **Scoped**: local cleanup, splitting or regrouping files, and broad refactors use different skills.
- **Grounded**: the rules on code (complexity, ownership, modularity, test quality, documentation) rest on established software-engineering literature, cited per skill in [docs/sources](./docs/sources/).

## Install

Clean Flow installs as the `cflow` plugin from this repository's marketplace. Its skills are named `cflow:cf-clean`, `cflow:cf-docs`, and so on; asking for `cf-clean` by name works too.
Start a new session after installing. A new version reaches you when a release changes the plugin version.

<details>
<summary>Claude Code</summary>

**Install**

```bash
claude plugin install cflow --marketplace gualask/clean-flow
```

**Update**: turn on auto-update once: in a session run `/plugin`, open **Marketplaces**, select `clean-flow`, and choose **Enable auto-update**. The update lands when a session starts, and the next session loads it. To update by hand:

```bash
claude plugin update cflow@clean-flow
```

**Stay on one release**: add the marketplace at its tag with `claude plugin marketplace add gualask/clean-flow#<tag>`. Only tags from the first plugin release on carry the marketplace.

**Uninstall**

```bash
claude plugin uninstall cflow@clean-flow
```

</details>

<details>
<summary>Codex</summary>

**Install**

```bash
codex plugin marketplace add gualask/clean-flow
codex plugin add cflow@clean-flow
```

**Update**: run these by hand or from a scheduled job of your own:

```bash
codex plugin marketplace upgrade clean-flow
codex plugin add cflow@clean-flow
```

**Stay on one release**: add the marketplace at its tag with `codex plugin marketplace add gualask/clean-flow --ref <tag>`. Only tags from the first plugin release on carry the marketplace.

**Move from the old installer**: `cflow-skills install` and `remove` are gone, and a script that calls them now fails. The copies the old installer wrote to `~/.agents/skills` or `<repo>/.agents/skills` stay behind, and Codex lists them next to the plugin. Move them once, from a checkout of this repository:

```bash
node ./bin/cflow-skills.mjs migrate --global
node ./bin/cflow-skills.mjs migrate /path/to/repo
```

`migrate` installs the Codex plugin first, with `codex` from your PATH, then removes only the skill directories the old installer wrote; without `codex` on PATH it changes nothing; `--global` also removes the friction logger and its `AGENTS.md` block, keeping the logs. Running it again changes nothing. `--dry-run` shows what it would do. Or ask Codex:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/gualask/clean-flow/refs/heads/main/install/codex/GLOBAL.md and migrate Cflow.
```

**Uninstall**

```bash
codex plugin remove cflow@clean-flow
```

</details>

## Skills

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

## Workflow

A structural change or a new feature follows three steps:

1. design it with `cf-architecture` (structure) or `cf-brainstorm` (feature) until the spec is approved
2. ask the agent to implement the approved spec
3. check the result against Cflow with `cf-clean`

Skills that keep work across sessions (design drafts, approved specs, recaps) store it in `.cflow/`, created only when needed and ignored by git through its own `.gitignore`.

## Documentation

- [Sources of each skill's rules](./docs/sources/)
- [Maintaining this pack](./docs/maintaining-this-pack.md)
