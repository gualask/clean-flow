# Cflow

Cflow is a skill pack for **behavior-preserving cleanup and refactor work**, with artifact-backed resume through `.cflow/architecture.md` and `.cflow/refactor-brief.md`.

## Skills Available

Public:

- `cf-start`
- `cf-review`
- `cf-verify`
- `cf-feedback-intake`

Advanced analysis:

- `cf-phase-discovery`
- `cf-phase-brainstorming`
- `cf-phase-concentration-map`
- `cf-phase-fragmentation-map`
- `cf-phase-target-shape`
- `cf-phase-migration-units`

Advanced execution:

- `cf-step-safety-net`
- `cf-step-boundary-apply`
- `cf-step-consolidate-seam`
- `cf-step-local-simplify`

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
