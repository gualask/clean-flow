---
name: cf-architecture-map
description: Build or refresh `.cflow/architecture.md` from repository state. Use as a standalone repository-mapping entrypoint or when other Cflow skills need current architecture context before proceeding.
---
This is a supported public entrypoint for repository mapping.
It may also be used internally by other Cflow skills when architecture context is missing or stale.
Do not implement, move files, or write patches in this skill.

## Goal

Create or refresh `.cflow/architecture.md` only.

You must determine:

- repository context
- project type
- main external boundaries
- domain gravity
- current boundary model
- current packaging model
- current architecture fit
- repository guidance that later Cflow skills may rely on

## Language rules

- Use the user's language for conversational output.
- Use the repository's dominant documentation language for `.cflow/architecture.md`.
- If the repository has no dominant documentation language, use the user's language for `.cflow/architecture.md`.

## Preflight

1. Read `.cflow/architecture.md` if it exists.
2. Re-check the repository.
3. Treat the repository as the source of truth.

## Clean-Context Reconnaissance

Before creating or refreshing `.cflow/architecture.md`, use one clean-context reconnaissance subagent to inspect the repository and return a read-only architecture report.

The subagent must not:

- edit files
- create `.cflow/*`
- update `.gitignore`
- decide the final architecture map

Give the subagent the repository path and this report format:

```md
## Repository Context
Project type, product shape, dominant language, and dominant docs language.

## Entry Points
CLI commands, apps, APIs, workers, scripts, package exports, or public library APIs.

## Top-Level Map
Main directories, packages, crates, apps, modules, or bounded areas and what each owns.

## External Boundaries
Filesystem, database, network, browser APIs, OS APIs, queues, storage, subprocesses, or tool integrations.

## Boundary Model
Current architecture style, important dependency directions, and ownership boundaries.

## Packaging Model
How code is organized: capability, layer, feature, workflow, or hybrid.

## Refactor Guidance
Stable rules future Cflow phases should respect.

## Evidence
Files read and why they matter.

## Unknowns
Areas the controller should verify before writing `.cflow/architecture.md`.
```

Treat the subagent report as the primary repository scan.
Do not repeat full reconnaissance unless the report is incomplete, contradictory, or unsupported by its cited evidence.
Spot-check only the evidence needed to trust the report, resolve contradictions, or fill unknowns.
You still own artifact writes, `.gitignore`, final interpretation, and the user-facing output.

## Bootstrap rules

Use `../cf-start/assets/architecture.template.md` as the source template for `.cflow/architecture.md`.

When bootstrapping or refreshing the architecture map:

- create `.cflow/` if it does not exist
- add `.cflow/` to the repository `.gitignore` if the entry is missing
- create `.cflow/architecture.md` from `../cf-start/assets/architecture.template.md` when the file is missing
- update `.cflow/architecture.md` in place when it already exists
- never create root-level `architecture.md`
- never create or refresh `.cflow/refactor-brief.md` in this skill

## Analysis rules

- Keep this skill repository-level.
- Describe the repository as it is now, not as an idealized architecture.
- Map the current shape before judging whether refactor work is justified.
- Do not choose work units, intervention modes, or target shape in this skill.
- If the user also needs refactor planning or resume, recommend `cf-start` after the map is updated.

## Output rules

Return sections: **Repository context**, **External boundaries**, **Current boundary and packaging model**, **Architecture fit**, **Artifacts updated**, **Recommended next action**.

## Artifact updates

Update or create `.cflow/architecture.md` whenever it is missing, stale, or materially incomplete for the current repository state.
