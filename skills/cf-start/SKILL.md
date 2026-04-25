---
name: cf-start
description: Main workflow entrypoint for Cflow. Use to start, assess, align, resume, plan, execute, review, or verify behavior-preserving cleanup and refactor work through `.cflow/architecture.md` and `.cflow/refactor-brief.md`. Route upstream ambiguity to `cf-mr-wolf` when the problem, goal, scope, or success criteria are not clear enough for Cflow assessment.
---

This is the main workflow controller for Cflow.
It runs the internal phases itself by loading the relevant references in `references/`.
Do not tell the user to invoke phase references directly.
Do not behave like a router that only suggests another step.
When the next phase is clear from repository state and Cflow artifacts, advance into it yourself.

## Goal

Handle fresh assessment, artifact-backed resume, or review/verify re-entry through `cf-start`.
Use `references/routing.md` for path decisions after the initial repository read.
If the request needs upstream problem shaping before Cflow can assess it, route to `cf-mr-wolf`.

## Entry routing

Use this diagram as the runtime routing contract.

```dot
digraph cflow_entry {
  "problem unclear?" -> "cf-mr-wolf" [label="yes"];
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

Read each reference in this invocation when its trigger is met:

| Reference | Trigger |
| --- | --- |
| [references/routing.md](references/routing.md) | ambiguous entry mode, upstream problem-shaping handoff, non-trivial fresh path selection, or resume routing that is not obvious from an active current work unit |
| [references/artifacts.md](references/artifacts.md) | creating or refreshing `.cflow/refactor-brief.md`, or deciding required brief field updates |
| [references/assessment.md](references/assessment.md) | fresh assessment, premise checks, or intervention framing |
| [references/alignment.md](references/alignment.md) | user steering after assessment may change scope, exclusions, risk, direction, or whether to continue |
| [references/work-unit-planning.md](references/work-unit-planning.md) | sequencing multiple soft-path work units |
| [references/target-shape.md](references/target-shape.md) | hard restructure target direction is justified but unresolved |
| [references/migration-unit-planning.md](references/migration-unit-planning.md) | hard-path target is aligned and needs bounded migration units |
| [references/concentration-map.md](references/concentration-map.md) | mapping concentration pressure or split direction |
| [references/fragmentation-map.md](references/fragmentation-map.md) | mapping fragmentation pressure or consolidation direction |
| [references/safety-net.md](references/safety-net.md) | choosing a behavior lock before structural edits |
| [references/split-execution.md](references/split-execution.md) | applying one bounded split-oriented structural step |
| [references/consolidation-execution.md](references/consolidation-execution.md) | applying one bounded consolidation-oriented structural step |
| [references/local-simplify.md](references/local-simplify.md) | local readability cleanup after structural execution |
| [references/review.md](references/review.md) | reviewing a completed bounded refactor step |
| [references/verify.md](references/verify.md) | verifying a completed bounded unit with factual checks |
| [references/feedback-intake.md](references/feedback-intake.md) | validating refactor feedback before acting |

## Fresh assessment

Use [references/routing.md](references/routing.md) for intent inference, fresh assessment details, and path selection.
Use [references/assessment.md](references/assessment.md) for premise checks and intervention framing.

Do not implement during fresh assessment.
If the problem, goal, scope, or success criteria are not clear enough to assess as Cflow work, route to `cf-mr-wolf` before creating or updating Cflow artifacts.
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

`cf-architecture-map` owns `.cflow/architecture.md`.
`cf-start` owns `.cflow/refactor-brief.md`; update it through [references/artifacts.md](references/artifacts.md).
