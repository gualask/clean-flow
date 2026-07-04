# AGENTS.md

Clean Flow (Cflow): source pack of Codex skills for cleanup/refactor flows. This repo authors and distributes the skills; it does not use them at runtime.

## Commands

- Test: `pnpm test` (Node built-in test runner, `test/*.test.mjs`)
- Token report: `pnpm report` · Count tokens: `pnpm count-tokens`
- CLI: `node ./bin/cflow-skills.mjs install <repo>|--global [--dry-run]`

## Layout

- `skills/` — authoring source for public skills (`cf-*`), `_shared/` (vendored references/scripts, `vendor.json`), `_codex_agents/` (custom agents)
- `src/` — install/materialize/sync logic (`commands/`, `lib/`)
- `docs/` — maintainer mirrors of the runtime flows; `docs/maintaining-this-pack.md` is the guide
- `test/` — Node test suites

## Rules

- ESM only (`.mjs`, `type: module`); pnpm; single dev dep: `tiktoken`.
- Runtime contracts live in `SKILL.md` + linked references; keep `docs/` mirrors in sync when changing them.
- Content shared across skills lives once in `skills/_shared` (`references/`, `scripts/`); `vendor.json` maps which skills receive which files. At install time each shared file is copied into the consuming skills' `references/`/`scripts/`, replacing a placeholder file that must exist there and start with a `Cflow vendored placeholder: <relative-path>` comment. To share content: author it in `_shared`, map it in `vendor.json`, add the placeholder in each consuming skill — never edit the vendored copies.
- Install must stay idempotent; don't bootstrap `.cflow/` here.
- Run `pnpm test` before committing.
