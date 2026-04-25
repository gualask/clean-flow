# cf-architecture-map Flow

## Purpose

Document the runtime flow for `cf-architecture-map` so maintainer reviews can catch orchestration flaws before they become skill behavior.

## Runtime Inputs

- Public skill: `skills/cf-architecture-map/SKILL.md`
- Custom agent source: `skills/_codex_agents/cflow_architecture_recon.toml`
- Artifact template and review rubric: `skills/cf-start/assets/architecture.template.md`
- Target artifacts: `.cflow/architecture.md`, `.gitignore`

## Flow

1. Trigger `cf-architecture-map`.
2. Controller preflight reads only existing `.cflow/architecture.md`, `.gitignore`, `architecture.template.md`, and `git status --short`.
3. Controller starts `cflow_architecture_recon` with only repository path and the user mapping request.
4. Custom agent performs read-only reconnaissance from its TOML instructions and returns the architecture report.
5. While the agent runs, controller does not scan manifests, docs, source directories, or implementation files.
6. Controller checks the report against `architecture.template.md` as the artifact rubric.
7. Controller performs only targeted spot-checks for missing, contradictory, generic, prescriptive, or unsupported report content.
8. Controller creates or updates `.cflow/architecture.md` from the template shape and the validated report.
9. Controller adds `.cflow/` to `.gitignore` only when missing.
10. Controller returns the skill output summary and recommends `cf-start` for refactor planning.

## Review Checks

- The spawn prompt must not paste the custom agent TOML instructions or full report format.
- The controller must not duplicate the repository scan while the custom agent is running.
- `architecture.template.md` must remain both artifact shape and review rubric.
- `.cflow/architecture.md` must stay observational: no recommendations, target shapes, future-work caveats, or planning notes.
- Generated, vendored, dependency, cache, and build-output directories must not become top-level architecture areas unless intentionally tracked and architecturally relevant.
- The controller owns artifact writes; the custom agent stays read-only.

