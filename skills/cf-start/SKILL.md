---
name: cf-start
description: Main public workflow entrypoint for Cflow. Use to start, assess, align, resume, plan, execute, review, or verify behavior-preserving cleanup and refactor work through `.cflow/architecture.md` and `.cflow/refactor-brief.md`.
---

This is the main public workflow entrypoint for the pack and the controller for the Cflow workflow.
It runs the internal phases itself by loading the relevant references in `references/`.
Do not tell the user to invoke phase references directly.
Do not behave like a router that only suggests another step.
When the next phase is clear from repository state and Cflow artifacts, advance into it yourself.

## Goal

Handle fresh assessment, artifact-backed resume, or review/verify re-entry through `cf-start`.

For fresh work after assessment and alignment:

- local fast lane may skip work-unit planning when the scope is explicit, local, low-risk, behavior-preserving, and already has one cohesive stop condition
- lightweight cleanup or refactor must use the planning phase before local mapping or execution when there are multiple credible candidates, dependency/order decisions, cross-boundary scope, or resumable multi-step work
- hard-path restructuring must define target shape and migration units before implementation

## Entry routing

Use this diagram as the runtime routing contract.

```dot
digraph cflow_entry {
  "local cognitive cleanup?" -> "cf-cognitive" [label="yes"];
  "file split only?" -> "cf-file-split" [label="yes"];
  "standalone architecture map?" -> "cf-architecture-map" [label="yes"];
  "cleanup/refactor workflow" -> "cf-start";

  "cf-start" -> "architecture current?";
  "architecture current?" -> "cf-architecture-map" [label="no"];
  "architecture current?" -> "fresh or resume?" [label="yes"];
  "fresh or resume?" -> "assessment" [label="fresh"];
  "fresh or resume?" -> "resume from brief" [label="resume"];
}
```

## Workflow lifecycle

Use this diagram as the lifecycle contract after architecture context is current.

```dot
digraph cflow_lifecycle {
  "assessment" -> "alignment checkpoint";
  "alignment checkpoint" -> "planning" [label="multi-unit or ordering"];
  "alignment checkpoint" -> "mapping" [label="one clear local unit"];
  "alignment checkpoint" -> "target shape" [label="hard path"];
  "target shape" -> "migration planning";
  "planning" -> "mapping";
  "migration planning" -> "safety net";
  "mapping" -> "safety net";
  "safety net" -> "execution";
  "execution" -> "local simplify" [label="optional"];
  "execution" -> "review";
  "local simplify" -> "review";
  "review" -> "verify";
  "verify" -> "close or next unit";
  "feedback" -> "alignment checkpoint";
}
```

## Hard rule

For non-trivial fresh work, always stop at an **alignment checkpoint** after the initial assessment.
Do this even when you already have a recommendation.

At the checkpoint:

- if the user replies with simple confirmation only, continue with the proposed path
- if the user gives a reply that may materially change the path, stay in the alignment phase first

Simple confirmation means short approval with no new steering.
A reply is non-trivial when it may materially change scope, exclusions, invariants, risk appetite, direction, or whether to continue.
Questions that do not affect those decisions can be answered briefly before continuing.

## Language rules

- Use the user's language for conversational output.
- Use the repository's dominant documentation language for `.cflow/architecture.md` and `.cflow/refactor-brief.md`.
- If the repository has no dominant documentation language, use the user's language for those artifacts too.

## Preflight

1. Read `.cflow/architecture.md` if it exists.
2. Read `.cflow/refactor-brief.md` if it exists.
3. Re-check the repository state.
4. Treat the repository as the source of truth.

## Reference map

Ensure you have read these references in this invocation when their trigger condition is met:

- Ensure you have read [references/routing.md](references/routing.md) before choosing the entry mode when assessment vs resume vs review-or-verify is not trivially obvious from the prompt and repository state.
- Ensure you have read [references/routing.md](references/routing.md) before finalizing the proposed path for any non-trivial fresh assessment.
- Ensure you have read [references/routing.md](references/routing.md) before resume routing whenever the next phase is not already obvious from an active current work unit.
- Ensure you have read [references/artifacts.md](references/artifacts.md) before creating or refreshing `.cflow/refactor-brief.md`, or deciding which brief fields must be updated.
- Ensure you have read [references/assessment.md](references/assessment.md) before fresh assessment, premise checks, or post-assessment alignment.
- Ensure you have read [references/planning.md](references/planning.md) before sequencing multiple work units, defining hard-path target shape, or planning migration units.
- Ensure you have read [references/mapping.md](references/mapping.md) before mapping concentration pressure, fragmentation pressure, split direction, or consolidation direction.
- Ensure you have read [references/execution.md](references/execution.md) before choosing a safety lock, applying a split or consolidation step, or doing local post-structural simplification.
- Ensure you have read [references/closure.md](references/closure.md) before review, verification, or feedback intake.

Use `assets/refactor-brief.template.md` as the source template whenever brief bootstrap is required.

## Fresh assessment

Use [references/routing.md](references/routing.md) for intent inference, fresh assessment details, and path selection.
Use [references/assessment.md](references/assessment.md) for premise checks and alignment behavior.

At a high level:

1. ensure architecture context is current
2. assess repository-level intervention pressure
3. apply concentration and fragmentation lenses
4. frame the proposed path
5. update artifacts when needed

Do not implement during fresh assessment.
Always end non-trivial fresh assessment at the alignment checkpoint with exactly one focused question.

## Resume

Resume is not a phase. Re-enter the correct phase using the brief and the repository.

Use the brief, repository state, and [references/routing.md](references/routing.md) to resume from the correct phase.
Do not silently switch direction without updating artifacts.
Do not execute more than one cohesive bounded unit per invocation unless the user explicitly asked for a broader pass.

## Output rules

User-facing output is a progress summary, not a brief mirror.
Keep durable state in `.cflow/refactor-brief.md`.
Return only the relevant format below.

### For fresh assessment
Return only:

- **Repository assessment**: the intervention decision and the evidence that matters.
- **Pressure**: concentration, fragmentation, mixed, or none.
- **Proposed path**: the recommended path and why.
- **Artifacts**: created or updated files, one line.
- **Alignment checkpoint**: exactly one focused question.

End with exactly one focused question.

### For execution or resume progress
Return only:

- **Done**: what changed in code or assessment.
- **Checks**: commands run and pass/fail result.
- **Artifacts**: created or updated files, one line.
- **Remaining**: only blockers, risks, or real follow-up work.
- **Next action**: one immediate action or `none`.

### For reassessment without code changes
Return only:

- **Current state**: one sentence.
- **Reassessment result**: the decision and why.
- **Artifacts**: created or updated files, one line.
- **Next action**: one immediate action or `none`.

## Artifact update baseline

Do not create or refresh `.cflow/architecture.md` directly in this skill.
Use `cf-architecture-map` when the architecture map is missing or stale.

If `.cflow/refactor-brief.md` exists or is created, update the fields required by [references/artifacts.md](references/artifacts.md).

- In `Execution state`, keep `current work unit` as the active selected unit only; use `none` at a safe stopping point with no next unit selected.
- In `Execution state`, set `recommended next work unit` whenever the near-term next unit is known but not yet completed.
