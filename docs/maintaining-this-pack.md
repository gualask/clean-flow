# Maintaining This Pack

## Scope

This repository is the source pack for Cflow.

It is not a target repository that uses Cflow at runtime.

At runtime:

- skills are installed into `.agents/skills` in the target repository, or into `$CODEX_HOME/skills` / `~/.codex/skills` for global install
- Cflow artifacts live in the target repository under `.cflow/`
- this source repository does not need `.cflow/architecture.md` or `.cflow/refactor-brief.md`

## Runtime Model

Cflow has three distinct runtime pieces:

1. distribution
   - `cflow-skills install` copies the skill directories
   - install does not bootstrap `.cflow/`
2. bootstrap
   - `cf-start` bootstraps the target repository on first use
   - `cf-start` creates `.cflow/` when needed
   - `cf-start` adds `.cflow/` to `.gitignore` when needed
   - `cf-start` creates `.cflow/architecture.md` and `.cflow/refactor-brief.md` from its asset templates when needed
3. execution
   - `cf-start` handles assessment, alignment, and resume
   - phase and step skills assume the Cflow artifacts already exist, unless their own local-scope rules say otherwise

## Canonical Artifact Paths

Target repositories use these canonical paths:

- `.cflow/architecture.md`
- `.cflow/refactor-brief.md`

## Source Of Truth

The canonical skill definitions live in `skills/`.

For bootstrap artifacts, the source templates live inside `cf-start`:

- `skills/cf-start/assets/architecture.template.md`
- `skills/cf-start/assets/refactor-brief.template.md`

Keep `cf-start` bootstrap logic and these asset files aligned.

## Repository Layout

```text
skills/   canonical skill source
src/      sync and fingerprint logic
bin/      CLI entrypoint
test/     filesystem and structure tests
docs/     maintainer documentation
```

## Key Design Decisions

- Cflow does not depend on `AGENTS.md` for manual start or artifact-backed resume.
- `cf-start` is the only bootstrap entrypoint.
- `.cflow/*` is Cflow-owned state in the target repository.
- Existing repository docs may be used as evidence during analysis.
- The installer distributes skills; it does not initialize repository state.

## Maintainer Workflow

When changing the pack:

- update the relevant `SKILL.md` files in `skills/`
- if bootstrap behavior changes, update `skills/cf-start/SKILL.md`
- if bootstrap artifact structure changes, update `skills/cf-start/assets/*`
- if install/remove behavior changes, update `src/` and the filesystem tests
- keep `README.md` focused on user-facing install and usage, not maintainer detail

## Testing

Run:

```bash
npm test
```

Current automated coverage checks:

- install on empty target
- update + prune + preserve foreign skills
- conflict detection on foreign same-name skills
- remove of Cflow-owned skills only
- structural checks for packaged skills
- presence of `cf-start` bootstrap assets

## Manual Smoke Checks

The most important manual validation is still a real target-repo run:

1. install the pack into a target repo
2. invoke `$cf-start`
3. confirm the target repo gets:
   - `.agents/skills/...`
   - `.cflow/`
   - `.cflow/architecture.md` when needed
   - `.cflow/refactor-brief.md` when needed
   - `.gitignore` updated with `.cflow/` when needed

## Related Files

- `README.md`
- `CHANGELOG.md`
- `skills/cf-start/SKILL.md`
- `skills/cf-start/assets/architecture.template.md`
- `skills/cf-start/assets/refactor-brief.template.md`
