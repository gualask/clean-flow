# Cflow

Cflow is a skill pack for **behavior-preserving cleanup and refactor work**, with artifact-backed resume through `.cflow/architecture.md` and `.cflow/refactor-brief.md`.

## Skills Available

Supported public entrypoints:

- `cf-start`
- `cf-mr-wolf`
- `cf-architecture-map`
- `cf-trace`
- `cf-cognitive`
- `cf-file-split`
- `cf-cohesion`

`cf-start` is the workflow controller.
Its internal phases live as runtime references under `skills/cf-start/references/` and are not installed as separate skill entrypoints.
`cf-mr-wolf` is a public entrypoint for clarifying ambiguous problems with minimal context before implementation or before Cflow assessment.

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

The CLI syncs packaged skills plus shared support resources from `skills/` into `/path/to/repo/.agents/skills`.
It also syncs packaged Codex custom agents into `/path/to/repo/.codex/agents`.

Global install:

```bash
node ./bin/cflow-skills.mjs install --global
```

By default `--global` installs skills into `$CODEX_HOME/skills` or `~/.codex/skills`, and Codex custom agents into `$CODEX_HOME/agents` or `~/.codex/agents`.

Dry run:

```bash
node ./bin/cflow-skills.mjs install /path/to/repo --dry-run
```

## First Use

Installing the pack only syncs packaged skills, shared support resources, and Cflow-owned Codex custom agents into the target location.
It does not create `.cflow/` by itself.

For supported workflow first use and resume, start with `cf-start`.
`cf-start` is the main public workflow entrypoint for assessment, alignment, resume, and work-unit selection.

For ambiguous ideas, unclear feature/refactor goals, or implementation tasks that need focused problem framing before coding, use `cf-mr-wolf`.
When `cf-start` cannot yet assess what problem a cleanup or refactor solves, it routes through `cf-mr-wolf` first.

For standalone repository mapping, use `cf-architecture-map`.
`cf-architecture-map` is the public entrypoint that bootstraps `.cflow/`, updates `.gitignore` for `.cflow/`, and creates or refreshes `.cflow/architecture.md`.
It uses the packaged `cflow_architecture_recon` Codex custom agent for read-only repository reconnaissance when available.

For path reconstruction and workflow flaw analysis, use `cf-trace`.
`cf-trace` is the public entrypoint that creates or refreshes `.cflow/trace.md`, then audits the reconstructed path for sequence, state, ownership, boundary, failure, observability, testability, and instruction-ambiguity issues.
It uses the packaged `cflow_trace_recon` Codex custom agent for read-only path reconstruction when available.
It requires current `.cflow/architecture.md` context and routes through `cf-architecture-map` first when that map is missing or stale.

For local cognitive complexity reduction, use `cf-cognitive`.
It can use explicit files or discover up to three justified candidate files, then works sequentially without requiring `.cflow/` artifacts.

For local file-level split review or execution, use `cf-file-split`.
It evaluates whether one source file has natural extraction boundaries, or executes one scoped behavior-preserving file split.

For local cohesion review or regrouping, use `cf-cohesion`.
It evaluates whether already-related files are scattered across folders, or executes one behavior-preserving local regrouping into a cohesive feature or workflow slice.

When `cf-start` needs architecture context, it routes through `cf-architecture-map` internally before continuing.

The remaining workflow phases are internal references loaded by `cf-start` when their trigger condition is met.
For the `cf-start` flow and phase contracts, see [docs/start/doc-start.flow.md](./docs/start/doc-start.flow.md).

## Uninstall

Remove only Cflow-owned skill and support directories from a target:

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
For public skill flows, see the `docs/<public-skill>/doc-*.flow.md` files.
