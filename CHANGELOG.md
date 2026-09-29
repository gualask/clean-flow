# Changelog

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
