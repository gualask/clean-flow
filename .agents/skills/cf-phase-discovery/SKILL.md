---
name: cf-phase-discovery
description: Phase-A repository discovery for Cflow. Analyze repository context, architecture fit, and whether the right path is soft or hard. Use when you want repo-level cleanup analysis without executing the refactor.
---

Do discovery only. Do not implement, move files, or write patches.

## Goal

Decide the right **cleanup strategy** at a repository level.

You must determine:

- repository context
- domain gravity
- current boundary model
- current packaging model
- architecture fit
- whether intervention is actually justified
- the most credible path: soft or hard
- whether brainstorming is needed before locking the direction
- whether `architecture.md` and `refactor-brief.md` should be created or refreshed

## Preflight

1. Read `AGENTS.md`.
2. Read `architecture.md` if it exists.
3. Read `refactor-brief.md` if it exists.
4. Re-check the repository.
5. Treat the repository as the source of truth.

## Analyze at repository level

Assess all of the following:

- project type: CLI, API, frontend, desktop, worker, library, service, SDK, plugin, etc.
- main external boundaries: HTTP, UI, command line, IPC, DB, filesystem, browser APIs, OS APIs, queues, storage, child processes, network
- domain gravity:
  - low = mostly tech-driven tooling or infrastructure logic
  - medium = some domain rules but not strongly domain-centered
  - high = strong business rules, workflows, invariants, states, policies, or bounded contexts
- current boundary model already present in the repository, if any:
  - layered
  - use-case oriented
  - hexagonal-ish / ports-and-adapters-ish
  - modular monolith
  - DDD-ish
  - mixed / unclear
- current packaging model already present in the repository, if any:
  - by layer
  - by feature
  - by workflow
  - hybrid
  - ad hoc / unclear
- architectural fit:
  - adequate but dirty
  - adequate but poorly organized
  - partially mismatched to the product or domain
  - strongly mismatched to the product or domain

## Pressure mapping at discovery level

At this phase, keep pressure mapping repo-level.

Identify:

- major dense or risky areas
- recurring choke points
- whether the pain is mostly local or repository-shaped
- whether the current architecture is fundamentally wrong or mostly just stressed
- whether future work would benefit from a clearer stable architecture note

Do not fully decompose a work unit here.
That belongs to `cf-phase-pressure-map`.

## Premise check

Answer these honestly:

1. What concrete problem is this cleanup solving right now?
2. What is the cost of leaving the current shape as-is for now?
3. Why is the intervention proportionate rather than architecture theater?

For the hard option also answer:

4. Is the repository shape itself the recurring cause of friction?
5. Would a well-executed soft cleanup likely remove most of the pressure anyway?

## Brainstorming trigger

Brainstorming is needed when one or more are true:

- soft and hard are both plausible and the trade-off is real
- scope, risk, or exclusions are not yet aligned
- a structural choice would be costly to undo and is not clearly implied by repository evidence
- the user likely needs to choose appetite for change
- the decision is not yet framed cleanly enough for a simple yes or no

## Artifact behavior

Update or create `architecture.md` when:

- it is missing
- it is stale
- it does not yet explain the repository well enough for future maintainers
- discovery materially changed repository understanding

Update or create `refactor-brief.md` when the work is non-trivial, risky, multi-step, or likely to resume later.

If brainstorming is still needed, do not lock speculative details as final.

## Output format

Provide exactly these sections:

1. **Repository context**
2. **Current architecture fit**
3. **Premise check**
4. **Candidate intervention areas**
5. **Soft cleanup option**
6. **Hard refactor option**
7. **Brainstorming trigger**
8. **Artifact decision**
9. **Recommended path**
10. **Recommended next action**

## Anti-goals

- Do not implement.
- Do not dive into file-level splitting unless a first work unit is already obvious.
- Do not invent an ideal architecture in the abstract.
- Do not give generic clean-code advice without tying it to this repository.
