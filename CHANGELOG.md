# Changelog

## 2026-04-24

- Added `cf-cognitive` as a standalone public skill for one-file-at-a-time cognitive complexity refactors, including no-file candidate discovery.
- Updated workflow docs, contract matrix, trial rules, and maintainer notes for `cf-cognitive`, the local fast lane, and less forced work-unit splitting.
- Added default prompts for packaged skills and test coverage for public entrypoint contracts.

## 2026-04-19

- Started the changelog from the current pack state and intentionally ignored earlier iterations.
- Slimmed down the README and moved version notes out of the main documentation.
- Restructured the repository around `skills/`, `src/`, `bin/`, and `test/`.
- Added a Node-based sync CLI for `install` and `remove`.
- Added automated tests for sync behavior and skill package structure.
