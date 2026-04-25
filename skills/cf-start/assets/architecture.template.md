# .cflow/architecture.md

Use this template as both the artifact shape and the controller review rubric.
Before writing the file, check the subagent report against every section below.

## Purpose

Must identify what the repository exists to do in 2-4 lines.
Should not describe desired future architecture.

## Product shape

Must record the high-level shape in repository terms:
- project type
- domain gravity
- main operational style

## Top-level map

Must list the main packages, crates, apps, modules, or bounded areas and what each one owns.
Exclude generated, vendored, dependency, cache, and build-output directories unless they are intentionally tracked and architecturally relevant.

## Entry points

Must list the user-facing or system-facing entry points:
- CLI commands
- HTTP servers
- UI apps
- workers
- scripts
- libraries / public APIs

## External boundaries

Must list the important runtime boundaries:
- filesystem
- database
- network / HTTP
- browser APIs
- OS APIs
- queues
- storage
- subprocesses
- tool integrations

## Boundary and packaging model

Must record only observed facts:

- Runtime crossings: `<caller area>` -> `<runtime/API boundary>` -> `<owner area>`.
- Ownership boundaries: `<area>` owns `<responsibility>`.
- Dependency direction: `<area>` depends on `<area>`; `<area>` appears independent from `<area>`.
- Physical packaging: code is organized mainly by `<feature/layer/capability/workflow/hybrid>`.

Should not repeat the top-level map directory by directory.

## Observed invariants

Must record existing flows, contracts, and constraints visible in the repository.
Keep this section descriptive; do not add refactor recommendations, future-work caveats, or planning notes.

Keep this document stable and short.
