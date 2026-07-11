---
name: cf-trace
description: Reconstruct and audit an execution, product, or refactor path from repository evidence. Use to identify broken sequences, missing states, unclear ownership, unsafe ordering, weak invariants, failure modes, resume gaps, or test gaps before changing code.
---
Use this skill to reconstruct one concrete path and audit it for orchestration flaws.
Do not implement, move files, or write code patches in this skill.

## Artifacts

This skill works with these Cflow artifacts:

- `.cflow/architecture.md`: input only; route to `cf-architecture` when missing, stale, or materially incomplete.
- `.cflow/trace.md`: owned here; create it from `assets/trace.template.md` when missing, or refresh it in place when it already exists.

Before creating an owned `.cflow/*` artifact, create `.cflow/` if needed and write `.cflow/.gitignore` containing a single `*` line if missing; never edit the repository `.gitignore`.

## Goal

Produce a current path reconstruction, then analyze it from multiple lenses.

You must determine:

- trace scope
- ordered observed and inferred sequence
- inputs and triggers
- state and artifacts
- external effects
- failure and resume paths
- evidence-backed audit findings
- recommended route

Use this for:

- user-visible or API workflows
- CLI command paths
- install, sync, migration, import, export, or background job paths
- refactor workflows or Cflow skill flows
- any multi-step behavior where the likely failure is sequence, state, ownership, or missing validation

Do not use this for a generic repository map; use `cf-architecture`.
Do not use this for broad refactor planning; use `cf-start` after trace findings justify it.

## Language rules

Write `.cflow/trace.md` in the repository's dominant documentation language; if none exists, use the current conversation language.

## Delegated Reconnaissance Guard

If the current task carries the state marker `delegated terminal evidence-only reconnaissance`, do not enter this controller flow, run the Reconnaissance Gate, invoke any skill, resolve routes or prerequisites, or delegate again. Inspect the assigned repository scope directly with read-only tools, record missing prerequisites under **Unknowns**, and return one report to the controller.

## Preflight

1. Identify the requested path, workflow, scenario, or entrypoint.
2. Read `.cflow/architecture.md` if it exists.
3. Read `.cflow/trace.md` if it exists.
4. Read `assets/trace.template.md`.
5. Check `git status --short` for user-change awareness.
6. If the requested path is too ambiguous to trace, ask one focused question before spawning reconnaissance.
7. If `.cflow/architecture.md` is missing, stale, or materially incomplete, suspend this flow and route to exactly one `cf-architecture` run, or await the in-flight run already known to the current context. Do not run the mapping and trace controller flows or their reconnaissance agents concurrently. Resume only after the architecture artifact is current and has been read again.
8. Do not reconstruct the path during preflight.

## Reconnaissance Gate

After Preflight has resolved the architecture prerequisite, stop before implementation scanning and ask:

Use subagents? Reply `y` or `n`.

- `y`: use read-only `cflow_trace_recon` for independent reconstruction.
- `n`: reconstruct in this context and report no clean-context independence.

Use `subagent` mode for `y` and `local` mode for `n`. Include the selected mode in **Trace**.

## Clean-Context Trace Reconstruction

When `subagent` mode is selected, apply `references/clean-context-recon.md` with `cflow_trace_recon` before writing the trace artifact.
When `local` mode is selected, reconstruct the same report shape locally and mark **Trace** as local-mode reconstruction.
Expected report sections: **Trace Scope**, **Observed Sequence**, **Inputs and Triggers**, **State and Artifacts**, **External Effects**, **Failure and Resume Paths**, **Evidence**, **Unknowns**.
Use `assets/trace.template.md` as the review rubric.
Allowed controller context while the agent runs: `.cflow/architecture.md`, existing trace artifact, trace template, and worktree status.

## Reconstruction rules

Keep the reconstruction section factual.
Every reconstructed step must be marked as observed or inferred.
Use inferred only when the evidence makes the step likely and name what would verify it.

## Audit lenses

After the reconstruction is written or updated, audit it through every applicable lens:

- sequence correctness: missing, duplicated, reversed, or unsafe steps
- state and resume: idempotency, stale state, partial writes, retry, rollback, and resume gaps
- invariants: assumptions that are relied on but not checked
- ownership: unclear module, file, service, or artifact responsibility
- boundary contracts: CLI, API, UI, filesystem, process, network, database, or agent contract mismatches
- failure modes: error handling, cleanup, fallback, timeout, cancellation, and concurrency risks
- observability: missing logs, summaries, artifacts, or diagnostics needed to debug the path
- testability: missing coverage for the path, edge cases, or state transitions
- instruction ambiguity: places where an agent or maintainer could choose the wrong next step

Do not invent findings.
If a lens has no evidence-backed issue, record `none found from current evidence`.

## Routing after audit

Recommend exactly one immediate route:

- `cf-mr-wolf` when the problem, expected behavior, or success criteria need upstream clarification
- `cf-architecture` when architecture context is missing or stale enough to block interpretation
- `cf-simplify` when findings point to overengineering, unnecessary file sprawl, or a behavior or interface choice that may be worth simplifying before refactor planning
- `cf-start` when findings justify multi-step cleanup, refactor planning, or resumable execution
- `cf-cognitive` when the issue is local cognitive complexity in up to three files
- `cf-split` when the issue is one scoped file-level extraction
- `cf-cohesion` when the issue is a local cluster of related files scattered across folders
- direct fix when the issue is a clear, bounded implementation bug and the user asked to proceed
- `none` when no credible issue is found

## Output rules

Return sections: **Trace**, **Findings**, **Lenses**, **Artifacts updated**, **Recommended route**, **Open questions**.

Findings must be ordered by severity and include evidence.
Do not include a refactor plan unless the recommended route is `cf-start`, and then keep it to one sentence.
