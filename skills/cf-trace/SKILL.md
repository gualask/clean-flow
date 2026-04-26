---
name: cf-trace
description: Reconstruct and audit an execution, product, or refactor path from repository evidence. Use to identify broken sequences, missing states, unclear ownership, unsafe ordering, weak invariants, failure modes, resume gaps, or test gaps before changing code.
---
Use this skill to reconstruct one concrete path and audit it for orchestration flaws.
Do not implement, move files, or write code patches in this skill.

## Goal

Create or refresh `.cflow/trace.md`, then analyze the reconstructed path from multiple lenses.

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

Do not use this for a generic repository map; use `cf-architecture-map`.
Do not use this for broad refactor planning; use `cf-start` after trace findings justify it.

## Language rules

- Use the user's language for conversational output.
- Use the repository's dominant documentation language for `.cflow/trace.md`.
- If the repository has no dominant documentation language, use the user's language for `.cflow/trace.md`.

## Preflight

1. Identify the requested path, workflow, scenario, or entrypoint.
2. Read `.cflow/architecture.md` if it exists.
3. Read `.cflow/trace.md` if it exists.
4. Check whether `.gitignore` already contains `.cflow/`.
5. Read `assets/trace.template.md`.
6. Check `git status --short` for user-change awareness.
7. Do not reconstruct the path during preflight; the reconnaissance subagent owns that scan.

If the requested path is too ambiguous to trace, ask one focused question before spawning reconnaissance.
If `.cflow/architecture.md` is missing, stale, or materially incomplete, route to `cf-architecture-map` before continuing.

## Clean-Context Trace Reconstruction

Before creating or refreshing `.cflow/trace.md`, use the `cflow_trace_recon` custom agent when available.
It is configured as a read-only, lower-cost reconnaissance agent for reconstructing one path.

If the custom agent is unavailable, use one equivalent clean-context reconnaissance subagent to inspect the repository and return a read-only trace report.

Start the custom agent with only the repository path and the user's trace request.
Do not paste the custom agent's TOML instructions or full report format into the spawn prompt.

Expect the subagent report to contain these sections: **Trace Scope**, **Observed Sequence**, **Inputs and Triggers**, **State and Artifacts**, **External Effects**, **Failure and Resume Paths**, **Evidence**, **Unknowns**.

Treat the subagent report as the primary path reconstruction.
Use `assets/trace.template.md` as the review rubric for whether the report is good enough to write `.cflow/trace.md`.
While the subagent is running, do not read manifests, source directories, docs, or implementation files to build a parallel reconstruction.
During that wait, the controller may only inspect `.cflow/architecture.md`, existing `.cflow/trace.md`, `.gitignore`, the trace template, and worktree status.
Do not repeat full reconnaissance unless the report is incomplete, contradictory, or unsupported by its cited evidence.
Spot-check only the evidence needed to trust the report, resolve contradictions, or fill unknowns.
If the report misses a required section or fills it with generic, prescriptive, or off-scope content, ask the subagent one targeted follow-up or do the smallest evidence spot-check needed.
If a full controller-side scan becomes necessary, say why before doing it.

The subagent produces reconstruction only.
The controller owns artifact writes, audit findings, severity, recommended route, and user-facing output.

## Artifact rules

Use `assets/trace.template.md` as the source template for `.cflow/trace.md`.

When bootstrapping or refreshing the trace artifact:

- create `.cflow/` if it does not exist
- add `.cflow/` to the repository `.gitignore` if the entry is missing
- create `.cflow/trace.md` from `assets/trace.template.md` when the file is missing
- update `.cflow/trace.md` in place when it already exists
- never create root-level `trace.md`
- do not create or refresh `.cflow/architecture.md` or `.cflow/refactor-brief.md`

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
- `cf-architecture-map` when architecture context is missing or stale enough to block interpretation
- `cf-start` when findings justify multi-step cleanup, refactor planning, or resumable execution
- `cf-cognitive` when the issue is local cognitive complexity in up to three files
- `cf-file-split` when the issue is one scoped file-level extraction
- direct fix when the issue is a clear, bounded implementation bug and the user asked to proceed
- `none` when no credible issue is found

## Output rules

Return sections: **Trace**, **Findings**, **Lenses**, **Artifacts updated**, **Recommended route**, **Open questions**.

Findings must be ordered by severity and include evidence.
Do not include a refactor plan unless the recommended route is `cf-start`, and then keep it to one sentence.
