# Cflow

Cflow is a skill pack for **behavior-preserving cleanup and refactor work**.

This repository is the **source of truth** for the pack:

- `skills/` contains the canonical skills
- `templates/` contains artifact templates
- `bin/` and `src/` contain the sync CLI
- `test/` covers the sync behavior and the packaged skill structure

Installed repositories still receive the skills in `.agents/skills`.

## Repository layout

```text
skills/   canonical skill source
templates/ artifact templates
src/      sync and fingerprint logic
bin/      CLI entrypoint
test/     filesystem and structure tests
```

## Canonical files

Keep these file names exactly in lowercase:

- `architecture.md`
- `refactor-brief.md`

## Entrypoints

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

Remove only Cflow-owned skills from a target:

```bash
node ./bin/cflow-skills.mjs remove /path/to/repo
node ./bin/cflow-skills.mjs remove --global
```

The sync model is:

- upsert all skills from `skills/`
- prune only skills previously installed by Cflow
- never touch non-Cflow skills with the same path unless they are explicitly adopted in a future version

## Test

```bash
npm test
```

Current automated coverage focuses on:

- install on empty target
- update + prune + preserve foreign skills
- conflict detection on foreign same-name skills
- remove of Cflow-owned skills only
- structural checks for packaged skills

Templates are not wired into the CLI yet. They are kept separately because they need a stricter bootstrap/update policy than the skill sync.

Manual `cf-start` invocation and artifact-backed resume do not depend on `AGENTS.md`.

## Default usage

Normal start:

```text
$cf-start Analyze this repository, propose the right path, and stop at the alignment checkpoint.
```

Resume from artifacts:

```text
$cf-start Read architecture.md and refactor-brief.md, then resume from the correct phase for the current work unit.
```

Practical rule of thumb:

- start with `cf-start`
- expect a mandatory alignment checkpoint after the first assessment
- keep one thread for assessment + alignment + one bounded work unit
- if a split-oriented step is still fuzzy locally, run `cf-phase-concentration-map` before editing
- do not start with a `cf-step-*` skill unless the work unit is already clear

## Language rule

- conversational output follows the user's language
- durable artifacts follow the dominant documentation language of the repository

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
