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

Provide exactly these sections:

1. **Repository context**
2. **External boundaries**
3. **Current boundary and packaging model**
4. **Architecture fit**
5. **Artifacts updated**
6. **Recommended next action**

## Artifact updates

Update or create `.cflow/architecture.md` whenever it is missing, stale, or materially incomplete for the current repository state.
