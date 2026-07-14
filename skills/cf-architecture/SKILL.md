---
name: cf-architecture
description: Build or refresh `.cflow/architecture.md` from repository state. Use as a standalone repository-mapping entrypoint or when other Cflow skills need current architecture context before proceeding. Do not use to judge or plan interventions; route those to cf-mr-wolf or cf-start.
---
Use this skill for repository mapping.
It may also be used internally by other Cflow skills when architecture context is missing or stale.
Do not implement, move files, or write patches in this skill.

## Artifacts

This skill works with these Cflow artifacts:

- `.cflow/architecture.md`: owned here; create it from `../cf-start/assets/architecture.template.md` when missing, or refresh it in place when stale or materially incomplete.
- `.cflow/refactor-brief.md`: owned by `cf-start`; never create or update it here.

Before creating an owned `.cflow/*` artifact, create `.cflow/` if needed and write `.cflow/.gitignore` containing a single `*` line if missing; never edit the repository `.gitignore`.

## Goal

Produce a current repository architecture map only.

You must determine:

- repository context
- project type
- main external boundaries
- domain gravity
- core domain vocabulary, conceptual boundaries, business invariants, workflows, and data ownership visible in code or docs
- current boundary and packaging model
- observed ownership of named representations and global re-export surfaces
- observed repository invariants that later Cflow skills may rely on

## Language rules

Write `.cflow/architecture.md` in the repository's dominant documentation language; if none exists, use the current conversation language.

## Delegated Reconnaissance Guard

If the current task carries the state marker `delegated terminal evidence-only reconnaissance`, do not enter this controller flow, run the Reconnaissance Gate, invoke any skill, resolve routes, or delegate again. Inspect the assigned repository scope directly with read-only tools, record missing prerequisites under **Unknowns**, and return one report to the controller.

## Preflight

1. If the current context already has another in-flight repository-mapping run for this repository, await it and reuse its result; do not start a second controller or reconnaissance agent.
2. Read `.cflow/architecture.md` if it exists.
3. Read `../cf-start/assets/architecture.template.md`.
4. Check `git status --short` for worktree-change awareness.
5. Do not map repository architecture during preflight.

## Reconnaissance Gate

After Preflight, stop before source scanning and ask:

Use subagents? Reply `y` or `n`.

- `y`: use read-only `cflow_architecture_recon` for independent mapping.
- `n`: map in this context and report no clean-context independence.

Use `subagent` mode for `y` and `local` mode for `n`. Include the selected mode in the final summary.

## Clean-Context Reconnaissance

When `subagent` mode is selected, apply `references/clean-context-recon.md` with `cflow_architecture_recon` before writing the architecture map.
When `local` mode is selected, produce the same report shape locally and mark the final summary as local-mode reconnaissance.
Expected report sections: **Repository Context**, **Entry Points**, **Top-Level Map**, **External Boundaries**, **Boundary and Packaging Model**, **Observed Invariants**, **Evidence**, **Unknowns**.
Use `../cf-start/assets/architecture.template.md` as the review rubric.
Allowed controller context while the agent runs: existing architecture artifact, architecture template, and worktree status.

## Analysis rules

- Keep this skill repository-level.
- Describe the repository as it is now, not as an idealized architecture.
- Keep `.cflow/architecture.md` observational: do not add refactor recommendations, target shapes, prescriptive guidance, future-work caveats, or planning notes.
- Map domain gravity and current shape before judging whether refactor work is justified.
- Do not choose work units, intervention modes, or target shape in this skill.
- If the current request also needs refactor planning or resume, recommend `cf-start` after the map is updated.

## Output rules

Return sections: **Repository context**, **External boundaries**, **Current boundary and packaging model**, **Observed invariants**, **Artifacts updated**, **Recommended next action**.
