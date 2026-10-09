# Changelog

## 2026-10-09

- `cf-todo` writes in the language of the repository's existing docs even when the request uses another language, asks for a missing done criterion instead of writing the task, records an open question's impact and direction only when the session stated them, extends an existing todo file in its own shape, names the ADR or owning doc for a decided question's durable rationale in **Changes** (routed to `cf-docs`), and uses one name per concept (todo file, task, done criterion, checked-task rollover).

## 2026-10-08

- `cf-test` reports only and never edits a test, names the action each lens produces (`strengthen`, `remove`, `rewrite`, `redesign`) so candidates group under the skill's own labels, gives every candidate the same fields as the agent brief with route `cf-mr-wolf` or `none`, names its scopes in the `description` (pending tests, a named history range, explicit tests, the existing suite), leaves persisting candidates to `cf-todo`, and uses one name per concept (authoritative source, invariant, observable contract, test case, candidate).
- `cf-scenario` traces a business-alignment candidate from `cf-review` as `file:line` steps from the changed line to the result a user sees before comparing it with the source, opens with **Decision:** (`make it`, `do not make it`, `make it only if` a condition) followed by the cost in each other scenario with `file:line`, and uses one name per concept (named change, cost in other scenarios). `cf-test` routes ambiguous expected behavior to `cf-mr-wolf`.

## 2026-10-07

- `cf-deadcode` no longer excludes removal requests in its `description`: asked to remove unused code, the model opens it and removes what its table finds.
- `cf-docs` drops the `standard`/`conservative` modes: implementation detail stays in the doc and is reported as a candidate move unless the request authorizes source edits. Trimming removes only restated content, history, and decoration, never a fact no other doc carries; each rule is stated once, under the same name in rules, passes, and output. Its trigger now excludes `.cflow/` in the predicate itself, and new docs follow the language of the repository's existing docs.
- `cf-cohesion` routes without editing (a new package goes to `cf-architecture` even when the move is requested), counts files per directory in discovery with a bundled script, moves only the evaluated cluster without splitting or adding barrels, runs the moved files' tests, and uses one name per concept.

## 2026-10-03

- `cf-cognitive` ranks functions by length and nesting, measures before and after editing, and runs the target's tests.
- `cf-split` moves and runs the tests of extracted code, and settles placement after the split.
- `repo-tree.mjs` keeps three views (folder tree, `--largest`, `--context-budget`) and ships only to `cf-cognitive`, `cf-review`, and `cf-test`.

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
