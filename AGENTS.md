# AGENTS.md

Clean Flow (Cflow): source pack of skills for cleanup/refactor flows, distributed as the `cflow` plugin for Claude Code and Codex. This repo authors and distributes the skills; it does not use them at runtime.

## Commands

- Test: `pnpm test` (Node built-in test runner): pack-wide checks in `test/pack.test.mjs`, one skill's contract in `test/skills/<skill>.test.mjs`, tool tests in `test/*.test.mjs`
- Flow token report: `pnpm report` for the full pack; `pnpm report -- cf-clean` to focus output on one skill. The packaged report uses `src/commands/skill-token-report.context.json` and fails when its runtime Markdown coverage drifts from the skill contracts.
- Raw token count: `pnpm count-tokens -- <file...>` for selected files; without file arguments it reads stdin.
- Vendor shared files: `pnpm vendor`; `pnpm vendor -- --check` reports drift without writing.
- Plugin check: `claude plugin validate .` (Claude Code manifests; the Codex ones are covered by `test/plugin.test.mjs`)
- CLI (temporary): `node ./bin/cflow-skills.mjs migrate <repo>|--global [--dry-run]` moves an installation made by the old installer onto the plugin.

## Layout

- `.claude-plugin/` — Claude Code's `plugin.json` (the `cflow` plugin; the repository root is its root) and `marketplace.json` (the `clean-flow` marketplace)
- `.codex-plugin/plugin.json` and `.agents/plugins/marketplace.json` — the same plugin and marketplace for Codex; `interface` holds what only Codex shows
- `.githooks/pre-commit` — blocks a commit whose vendored copies or manifests are out of line; `pnpm install` enables it
- `.github/workflows/main.yml` — runs `pnpm test` on pushes and pull requests to `main`, the branch the marketplaces install
- `skills/` — the plugin's skills (`cf-*`), with their vendored copies committed; nothing else
- `shared/` — content shared across skills (`references/`, `scripts/`) and `vendor.json`
- `src/` — vendoring, token reports, and the temporary `migrate` command (`commands/`, `lib/`)
- `docs/sources/` — one mirror per skill (`cf-<name>.md`) with the sources its rules rest on; `docs/maintaining-this-pack.md` is the guide
- `test/` — Node test suites (`skills/` per skill, `support/` helpers)

## Rules

- ESM only (`.mjs`, `type: module`); pnpm; single dev dep: `tiktoken`.
- Runtime contracts live in `SKILL.md` + linked references. A skill's mirror in `docs/sources/` holds only the literature each rule rests on, quoted and linked: when a rule is added or changed, add or update its source there; never restate the contract.
- Content shared across skills lives once in `shared/` (`references/`, `scripts/`); `shared/vendor.json` maps which skills receive which files. Each shared file has a committed copy in every consuming skill's `references/`/`scripts/`, because the hosts install `skills/` as it is. To share content: author it in `shared/`, map it in `vendor.json`, run `pnpm vendor` — never edit the vendored copies; a test fails when a copy differs from its source.
- Both `plugin.json` files carry the `package.json` `version` and the same `description` (a test checks it); bump all three only when releasing to `main`, since users receive a new version only when it changes.
- `migrate` must stay idempotent; don't bootstrap `.cflow/` here.
- Run `pnpm test` before committing.
- `CHANGELOG.md` is written only when releasing to `main`, from the commits since the previous release; work on `dev` adds nothing to it. Follow Keep a Changelog: one heading per release (`## <version> - <date>`), changes grouped under `Added`, `Changed`, `Fixed`, `Removed`, one short line per user-visible change saying what changed for whoever installs the pack. No measurements, run counts, token counts or rationale.
- Work lands on `dev`; `main` moves only at a release. To release: add one `release: <version>` commit on `dev` with the CHANGELOG entry and the version bump, fast-forward `main` to it without squashing, tag it `<version>` (annotated, no `v` prefix), and push both branches and the tag.
