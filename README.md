# Cflow

Cflow is a skill pack for **behavior-preserving cleanup and refactor work**, with artifact-backed resume through `.cflow/architecture.md` and `.cflow/refactor-brief.md`.

## Skills Available

Supported public entrypoints:

- `cf-start`
- `cf-architecture-map`

Internal workflow skills:

- `cf-internal-assessment`
- `cf-internal-brainstorming`
- `cf-internal-concentration-map`
- `cf-internal-fragmentation-map`
- `cf-internal-work-unit-planning`
- `cf-internal-target-shape`
- `cf-internal-migration-unit-planning`
- `cf-internal-safety-net`
- `cf-internal-boundary-apply`
- `cf-internal-consolidate-seam`
- `cf-internal-local-simplify`
- `cf-internal-review`
- `cf-internal-verify`
- `cf-internal-feedback-intake`

## Install

For Codex global install, you can say:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/gualask/clean-flow/refs/heads/main/install/codex/GLOBAL.md and install Cflow globally.
```

For Codex local install into the current repository, you can say:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/gualask/clean-flow/refs/heads/main/install/codex/LOCAL.md and install Cflow into the current repository only.
```

For Codex global update, you can say:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/gualask/clean-flow/refs/heads/main/install/codex/GLOBAL.md and update the global Cflow installation.
```

For Codex local update in the current repository, you can say:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/gualask/clean-flow/refs/heads/main/install/codex/LOCAL.md and update Cflow in the current repository only.
```

```bash
node ./bin/cflow-skills.mjs install /path/to/repo
```

The CLI syncs `skills/` into `/path/to/repo/.agents/skills`.

Global install:

```bash
node ./bin/cflow-skills.mjs install --global
```

By default `--global` installs into `$CODEX_HOME/skills` or `~/.codex/skills`.

Dry run:

```bash
node ./bin/cflow-skills.mjs install /path/to/repo --dry-run
```

## First Use

Installing the pack only syncs `skills/` into the target location.
It does not create `.cflow/` by itself.

For supported workflow first use and resume, start with `cf-start`.
`cf-start` is the main public workflow entrypoint for assessment, alignment, resume, and work-unit selection.

For standalone repository mapping, use `cf-architecture-map`.
`cf-architecture-map` is the public entrypoint that bootstraps `.cflow/`, updates `.gitignore` for `.cflow/`, and creates or refreshes `.cflow/architecture.md`.

When `cf-start` needs architecture context, it routes through `cf-architecture-map` internally before continuing.

All remaining skills are internal workflow skills.
They are not meant to be invoked directly by users.

For an end-to-end workflow view, see [docs/workflow-map.md](./docs/workflow-map.md).

## Uninstall

Remove only Cflow-owned skills from a target:

For Codex, you can say:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/gualask/clean-flow/refs/heads/main/install/codex/GLOBAL.md and uninstall Cflow globally.
```

For Codex local uninstall in the current repository, you can say:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/gualask/clean-flow/refs/heads/main/install/codex/LOCAL.md and uninstall Cflow from the current repository only.
```

```bash
node ./bin/cflow-skills.mjs remove /path/to/repo
node ./bin/cflow-skills.mjs remove --global
```

For pack maintenance and runtime design, see [docs/maintaining-this-pack.md](./docs/maintaining-this-pack.md).
For the workflow map, see [docs/workflow-map.md](./docs/workflow-map.md).
