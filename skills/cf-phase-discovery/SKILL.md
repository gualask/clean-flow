---
name: cf-phase-discovery
description: Repository-level discovery for Cflow. Analyze context, architecture fit, premise check, and likely intervention modes without implementing code.
---

Do discovery only. Do not implement, move files, or write patches.

## Goal

Decide the right **repository-level strategy frame**.

You must determine:

- repository context
- domain gravity
- current boundary model
- current packaging model
- architecture fit
- whether intervention is actually justified
- which intervention modes are plausible
- whether `architecture.md` and `refactor-brief.md` should be created or refreshed

## Preflight

1. Read `AGENTS.md`.
2. Read `architecture.md` if it exists.
3. Read `refactor-brief.md` if it exists.
4. Re-check the repository.
5. Treat the repository as the source of truth.

## Analyze at repository level

Assess:

- project type: CLI, API, frontend, desktop, worker, library, service, SDK, plugin, etc.
- main external boundaries
- domain gravity: low / medium / high
- current boundary model already present
- current packaging model already present
- architecture fit:
  - adequate but dirty
  - adequate but poorly organized
  - partially mismatched
  - strongly mismatched

## Premise check

Answer these honestly:

1. What concrete problem is this intervention solving now?
2. What is the cost of leaving the current shape as-is for now?
3. Why is the intervention proportionate rather than architecture theater?

For hard restructure also answer:

4. Is repository shape itself the recurring cause of friction?
5. Would a good soft intervention likely remove most of the pain anyway?

## Intervention mode framing

Do not choose the final mode yet, but identify what is plausible:

- soft-split
- soft-consolidate
- soft-mixed
- hard-restructure
- no-structural-refactor

## Artifact behavior

Update or create `architecture.md` when it is missing, stale, or materially incomplete.

Update or create `refactor-brief.md` when the work is non-trivial, risky, multi-step, or likely to resume later.

## Output format

Provide exactly these sections:

1. **Repository context**
2. **Current architecture fit**
3. **Premise check**
4. **Candidate intervention areas**
5. **Plausible intervention modes**
6. **Artifact decision**
7. **Recommended next action**

## Anti-goals

- Do not implement.
- Do not dive into work-unit splitting yet.
- Do not invent an ideal architecture in the abstract.
