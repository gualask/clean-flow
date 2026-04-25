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
- current dependency directions
- observed repository invariants that later Cflow skills may rely on

## Language rules

- Use the user's language for conversational output.
- Use the repository's dominant documentation language for `.cflow/architecture.md`.
- If the repository has no dominant documentation language, use the user's language for `.cflow/architecture.md`.

## Preflight

1. Read `.cflow/architecture.md` if it exists.
2. Check whether `.gitignore` already contains `.cflow/`.
3. Read `../cf-start/assets/architecture.template.md`.
4. Check `git status --short` for user-change awareness.
5. Do not map repository architecture during preflight; the reconnaissance subagent owns that scan.

## Clean-Context Reconnaissance

Before creating or refreshing `.cflow/architecture.md`, use the `cflow_architecture_recon` custom agent when available.
It is configured as a read-only, lower-cost reconnaissance agent for this specific scan.

If the custom agent is unavailable, use one equivalent clean-context reconnaissance subagent to inspect the repository and return a read-only architecture report.

The subagent must not:

- edit files
- create `.cflow/*`
- update `.gitignore`
- decide the final architecture map

Give the subagent the repository path and require this report format:

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

## Observed Invariants
Existing flows, contracts, and constraints visible in the repository.

## Evidence
Files read and why they matter.

## Unknowns
Areas the controller should verify before writing `.cflow/architecture.md`.
```

Treat the subagent report as the primary repository scan.
While the subagent is running, do not read manifests, source directories, docs, or implementation files to build a parallel architecture map.
During that wait, the controller may only inspect Cflow artifacts, `.gitignore`, the architecture template, and worktree status.
Do not repeat full reconnaissance unless the report is incomplete, contradictory, or unsupported by its cited evidence.
Spot-check only the evidence needed to trust the report, resolve contradictions, or fill unknowns.
If a full controller-side scan becomes necessary, say why before doing it.
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
- Keep `.cflow/architecture.md` observational: do not add refactor recommendations, target shapes, or prescriptive guidance.
- Map the current shape before judging whether refactor work is justified.
- Do not choose work units, intervention modes, or target shape in this skill.
- If the user also needs refactor planning or resume, recommend `cf-start` after the map is updated.

## Output rules

Return sections: **Repository context**, **External boundaries**, **Current boundary and packaging model**, **Observed invariants**, **Artifacts updated**, **Recommended next action**.

## Artifact updates

Update or create `.cflow/architecture.md` whenever it is missing, stale, or materially incomplete for the current repository state.
