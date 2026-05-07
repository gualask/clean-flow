---
name: cf-architecture
description: Build or refresh `.cflow/architecture.md` from repository state. Use as a standalone repository-mapping entrypoint or when other Cflow skills need current architecture context before proceeding.
---
Use this skill for repository mapping.
It may also be used internally by other Cflow skills when architecture context is missing or stale.
Do not implement, move files, or write patches in this skill.

## Artifacts

This skill works with these Cflow artifacts:

- `.cflow/architecture.md`: owned here; create it from `../cf-start/assets/architecture.template.md` when missing, or refresh it in place when stale or materially incomplete.
- `.cflow/refactor-brief.md`: owned by `cf-start`; never create or update it here.

Before creating an owned `.cflow/*` artifact, if `.cflow/` does not exist, create it and add `.cflow/` to `.gitignore`, creating `.gitignore` if needed.

## Goal

Produce a current repository architecture map only.

You must determine:

- repository context
- project type
- main external boundaries
- domain gravity
- current boundary and packaging model
- observed ownership of named representations and global re-export surfaces
- observed repository invariants that later Cflow skills may rely on

## Language rules

Write `.cflow/architecture.md` in the repository's dominant documentation language; if none exists, use the current conversation language.

## Preflight

1. Read `.cflow/architecture.md` if it exists.
2. Read `../cf-start/assets/architecture.template.md`.
3. Check `git status --short` for worktree-change awareness.
4. Do not map repository architecture during preflight; the reconnaissance subagent owns that scan.

## Clean-Context Reconnaissance

Apply [clean-context-recon.md](../_shared/references/clean-context-recon.md) with `cflow_architecture_recon` before writing the architecture map.
Expected report sections: **Repository Context**, **Entry Points**, **Top-Level Map**, **External Boundaries**, **Boundary and Packaging Model**, **Observed Invariants**, **Evidence**, **Unknowns**.
Use `../cf-start/assets/architecture.template.md` as the review rubric.
Allowed controller context while the agent runs: existing architecture artifact, architecture template, and worktree status.

## Analysis rules

- Keep this skill repository-level.
- Describe the repository as it is now, not as an idealized architecture.
- Keep `.cflow/architecture.md` observational: do not add refactor recommendations, target shapes, prescriptive guidance, future-work caveats, or planning notes.
- Map the current shape before judging whether refactor work is justified.
- Do not choose work units, intervention modes, or target shape in this skill.
- If the current request also needs refactor planning or resume, recommend `cf-start` after the map is updated.

## Output rules

Return sections: **Repository context**, **External boundaries**, **Current boundary and packaging model**, **Observed invariants**, **Artifacts updated**, **Recommended next action**.
