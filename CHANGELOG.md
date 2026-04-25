# Changelog

## 2026-04-25

- Consolidated workflow execution into `cf-start` as the single Cflow workflow controller.
- Replaced packaged `cf-internal-*` skill entrypoints with `cf-start/references/*` phase references.
- Restored the former internal skill contracts as granular `cf-start` phase playbooks instead of compressed phase summaries.
- Added DOT routing and lifecycle diagrams to `cf-start`.
- Added read-only clean-context reconnaissance subagent protocol to `cf-architecture-map`.
- Added the `cflow_architecture_recon` Codex custom agent source under `skills/_codex_agents` using `gpt-5.4-mini` for read-only architecture reconnaissance.
- Extended install/remove to sync Cflow-owned Codex custom agents alongside packaged skills.
- Tightened `cf-architecture-map` so the controller does not duplicate the reconnaissance scan while the subagent runs.
- Changed `.cflow/architecture.md` output from refactor guidance to observed repository invariants.
- Updated docs and tests for the four-public-skill package shape.

## 2026-04-24

- Added `_shared` support references and installer support for Cflow-owned support directories.
- Added `cf-cognitive` as a standalone public skill for sequential cognitive complexity refactors, including no-file discovery of up to three justified candidates.
- Added `cf-file-split` as a standalone public skill for local file-level split evaluation and scoped behavior-preserving extraction.
- Added a shared local readability review lens for touched-code review and simplification.
- Added shared file split rules for candidate review and placement decisions.
- Slimmed operational internal skill wording to emphasize intervention criteria over procedural checklists.
- Updated workflow docs, contract matrix, trial rules, and maintainer notes for `cf-cognitive`, the local fast lane, and less forced work-unit splitting.
- Added default prompts for packaged skills and test coverage for public entrypoint contracts.

## 2026-04-19

- Started the changelog from the current pack state and intentionally ignored earlier iterations.
- Slimmed down the README and moved version notes out of the main documentation.
- Restructured the repository around `skills/`, `src/`, `bin/`, and `test/`.
- Added a Node-based sync CLI for `install` and `remove`.
- Added automated tests for sync behavior and skill package structure.
