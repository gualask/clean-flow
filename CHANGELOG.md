# Changelog

## 0.5.1 - 2026-11-09

### Added

- `cf-architecture` checks a proposed tree before you approve it, when you ask: it looks in entry points and adapters for rules left without an owner and drops new directories nothing justifies.

### Changed

- `cf-architecture` lists what the structure has to serve, compares the form the code has with at least two others, each with a drawback, and proposes the target tree of the form that wins.
- `cf-architecture` proposes a layer, a split into modules, an application service, a port or a separate package only when the repository shows the condition that calls for it.

## 0.5.0 - 2026-11-08

### Added

- Cflow installs as the `cflow` plugin from the `clean-flow` marketplace, in Claude Code and Codex; a release reaches you when it changes the plugin version, and a tag pins one release.
- `cflow-skills migrate` moves an installation made by the old installer onto the Codex plugin, removing only the skills that installer wrote and the friction logger.
- `cf-architecture` assesses a repository or subsystem, proposes a target tree, checks the code against the structure the repository states, and records a structural change you take up as an approved spec.
- `cf-mr-wolf` takes requests to fix a defect, first checking whether the same cause shows up elsewhere in the repository.
- `cf-test` reports duplicated setup, nondeterministic tests, and cases repeated across layers.
- `cf-docs` reorganizes docs after you confirm the target tree, and follows the rules of CHANGELOG, AGENTS.md and CLAUDE.md files.

### Changed

- `cf-review` is now `cf-clean`: it checks pending work, commits, a path, or the whole repository against every Cflow skill and routes each finding; on the whole repository it sweeps one area per run. It no longer looks for bugs.
- `cf-split` and `cf-cohesion` are merged into `cf-placement`, which splits an oversized file into nearby files or regroups scattered related files into one folder.
- `cf-todo` is merged into `cf-docs`, which keeps the todo file of next steps and open questions.
- `cf-cognitive` measures nesting and length before judging, refactors inside the file, and claims behavior is preserved only when the tests pass.
- `cf-scenario` opens with a decision on the named change and traces it to the result a user sees when a doc or spec states the behavior it alters.
- `cf-mr-wolf` investigates and asks when a request does not name what should change, and hands a request that does to the skill that owns it.
- `cf-brainstorm` opens when you ask to brainstorm or explore an idea, writes the draft only once the design is settled, and hands ownership decisions to `cf-architecture`.
- `cf-clean` and `cf-test` run every pass themselves, splitting a large target into batches, instead of delegating to subagents.
- `cf-deadcode` reports only the boundary names missing a sender or a receiver.
- Skill descriptions say only when to use each skill, so a skill opens on fewer unrelated requests.

### Removed

- `cflow-skills install` and `remove`: install the plugin instead.
- `cf-start`: ask the agent to implement an approved spec directly.
- The optional friction logger.

## 0.4.4 and earlier

- Public skills: `cf-start` (refactor controller: assessment, target shape, planning, execution, review, resume), `cf-mr-wolf` (gate for changes nobody has decided yet), `cf-scenario` (decides a named change against the scenarios it touches), `cf-cognitive`, `cf-split`, `cf-cohesion` (local cleanup), `cf-review` (read-only review of pending work or a history range), `cf-test`, `cf-docs`, `cf-todo`, explicit-only `cf-brainstorm` (design specs), `cf-deadcode` (producer/consumer table for names crossing boundaries as strings).
- Navigation cost as the shared cleanup objective, with hard triggers on file length and directory population.
- Shared references and scripts authored once in `skills/_shared` and vendored at install; materialized installation into `.agents/skills`; self-ignoring `.cflow/`; optional friction logger outside repositories.
- Token reporting with per-flow context stacks checked against the runtime contracts.
- Removed along the way: `cf-clarify`, `cf-trace`, an earlier `cf-architecture`, `cf-simplify`, the packaged de-risk agent, and support for legacy `.codex/skills` installations.

Detailed history: `git log -- CHANGELOG.md`.
