# Changelog

## 2026-10-03

- `cf-cognitive` runs the tests that cover its target after editing and claims behavior preservation only when they pass; otherwise it reports `tests not run` and says the change is not verified by tests.
- `repo-tree.mjs` keeps three views: the folder tree (`--depth`), `--largest N`, and `--context-budget`, all narrowed by `--include`; `--mode`, `--max-nodes`, `--full`, `--no-gitignore`, and `--root` are gone. Only `cf-cognitive` (discovery, `--depth 3` then `--largest 15`), `cf-review`, and `cf-test` receive it; `cf-split`, `cf-cohesion`, and `cf-execute` list and count files themselves, which gave the same results in paired runs.
- `cf-cognitive` discovery ranks functions, not files, and a file past the length trigger gets `cf-cognitive first` when long functions make its length (it is checked again after slimming) or `cf-split` when distinct responsibilities do.
- `cf-cognitive` asks which three files to take when a request names more than three.
- `cf-split` moves the tests of extracted code next to its new files, runs them, and claims behavior preservation only when they pass; placement is settled after the split, where an owner directory overrides the count guardrails, an approved spec's location wins, and a folder that would change package boundaries stays flat and goes to `cf-architecture`.

## 2026-09-28

- Added `cf-architecture`: it assesses a repository or subsystem from code evidence (owners of state and coordinators, what entry points decide, shared modules whose meaning belongs to one capability) and proposes one target tree with the smallest evidenced change. Ownership and contract rules live in its `SKILL.md`.
- Added a shared draft → spec cycle, `design-spec-lifecycle.md`, used by `cf-brainstorm` and `cf-architecture`: one draft with an owner, questions settled only by the user, and promotion that ends the turn by naming the planning skill. The architecture spec adds a `Moves` table with `file:line` evidence.
- Replaced `cf-start` with `cf-execute`: it plans and implements an approved spec, structural or feature, in `split`, `consolidate`, or `feature` units; keeps state in `.cflow/execution-plan.md`; runs the repository's full check before a unit is done; and asks before starting the next unit. Without a spec it hands the request to the skill that designs one. The installer prunes an installed `cf-start`.
- Rerouted structure and broad-refactor requests to `cf-architecture`, including `cf-review` lens 4. `cf-docs` no longer claims files under `.cflow/`.

## Up to 0.4.4 (2026-05-05 – 2026-09-08)

- Public skills: `cf-start` (refactor controller: assessment, target shape, planning, execution, review, resume), `cf-mr-wolf` (gate for changes nobody has decided yet), `cf-scenario` (decides a named change against the scenarios it touches), `cf-cognitive`, `cf-split`, `cf-cohesion` (local cleanup), `cf-review` (read-only review of pending work or a history range), `cf-test`, `cf-docs`, `cf-todo`, explicit-only `cf-brainstorm` (design specs), `cf-deadcode` (producer/consumer table for names crossing boundaries as strings).
- Navigation cost as the shared cleanup objective, with hard triggers on file length and directory population.
- Shared references and scripts authored once in `skills/_shared` and vendored at install; materialized installation into `.agents/skills`; self-ignoring `.cflow/`; optional friction logger outside repositories.
- Token reporting with per-flow context stacks checked against the runtime contracts.
- Removed along the way: `cf-clarify`, `cf-trace`, an earlier `cf-architecture`, `cf-simplify`, the packaged de-risk agent, and support for legacy `.codex/skills` installations.

Detailed history: `git log -- CHANGELOG.md`.
