# Cflow Workflow Map

This document is the shortest end-to-end view of how Cflow is meant to run in a target repository.
Use it for orientation.
Use [maintaining-this-pack.md](./maintaining-this-pack.md) and [skill-contract-matrix.md](./skill-contract-matrix.md) for the full contract details.

Mermaid is used here because the main thing missing from the docs was branch and resume visibility.
The phase index below is the text fallback if the diagram is not rendered.

## Core Rules

- `cf-start` is the main supported direct user entrypoint for workflow execution and resume.
- `cf-architecture-map` is also a supported direct user entrypoint, but only for standalone repository mapping.
- `cf-refine` is also a supported direct user entrypoint, but only for one bounded local refinement pass.
- `cflow-skills install` only syncs `skills/`; it does not create `.cflow/`.
- All remaining skills are internal workflow steps, not supported user-facing entrypoints.
- Internal workflow skills should still be implicitly invocable in Codex when their descriptions match the current step.
- If a skill is reached without required architecture context, it should stop and route to `cf-architecture-map`.
- If a skill is reached without some earlier workflow context beyond architecture, it should stop and route to `cf-start` or the required earlier phase.
- `soft-mixed` is allowed only as a repository-level assessment outcome; each executable work unit must still declare exactly one mode: `split` or `consolidate`.

## End-To-End Flow

```mermaid
flowchart TD
    A[User invokes cf-architecture-map] --> A1[Build or refresh .cflow/architecture.md]
    A1 --> A2[Return map and recommend stop or continue with cf-start]

    B0[User invokes cf-refine] --> B1{Fits one bounded local pass?}
    B1 -- no --> B
    B1 -- yes --> B2{Need safety net before edits?}
    B2 -- yes --> B3[Ensure architecture context with cf-architecture-map]
    B3 --> B4[cf-step-safety-net when confidence is needed]
    B2 -- no --> B5[Local refine pass in cf-refine]
    B4 --> B5
    B5 --> B6{Need review or verify after edits?}
    B6 -- review --> B7[Optional cf-review]
    B6 -- verify --> B8[Optional cf-verify]
    B6 -- none --> B9[Stop after local pass]
    B7 --> B8
    B8 --> B9

    B[User invokes cf-start] --> C{Current architecture map is usable?}
    C -- no or stale --> A1
    C -- yes --> D{Usable refactor brief already exists?}
    A1 --> D
    D -- no or stale --> E[Fresh assessment in cf-start]
    D -- yes --> F{Resume target from brief}

    E --> E1{Dedicated assessment pass needed?}
    E1 -- yes --> E2[cf-phase-assessment]
    E1 -- no --> E3[Concentration lens]
    E2 --> E3
    E3 --> E4[Fragmentation lens]
    E4 --> E5[Path framing and brief updates]
    E5 --> G[Alignment checkpoint]

    G -- simple confirmation --> H{Chosen direction}
    G -- non-trivial steering --> I[cf-phase-brainstorming]
    I --> H

    H -- soft split --> J[cf-phase-work-unit-planning]
    H -- soft consolidate --> J
    H -- soft mixed --> J
    H -- hard restructure --> K[cf-phase-target-shape]
    H -- review only --> R[cf-review]
    H -- verify only --> S[cf-verify]
    H -- no structural refactor --> T[Stop with assessment result]

    K --> L[cf-phase-migration-unit-planning]
    J --> J1{Recommended next work unit}
    J1 -- mode: split --> M[cf-phase-concentration-map when seam needs mapping]
    J1 -- mode: consolidate --> N[cf-phase-fragmentation-map when seam needs mapping]
    J1 -- ready for structural work --> O[cf-step-safety-net]
    M --> O
    N --> O
    L --> O

    O -- mode: split --> P[cf-step-boundary-apply]
    O -- mode: consolidate --> Q[cf-step-consolidate-seam]

    P --> U[Optional cf-step-local-simplify]
    Q --> U
    P --> R
    Q --> R
    U --> R

    R --> S
    R --> V[cf-feedback-intake when review feedback arrives]
    V --> H
    S --> W[Close unit or continue with next bounded unit]

    F -- planning --> J
    F -- mapping split --> M
    F -- mapping consolidate --> N
    F -- safety net --> O
    F -- execution split --> P
    F -- execution consolidate --> Q
    F -- review --> R
    F -- verify --> S
```

## How To Read The Diagram

- Fresh non-trivial work always stops at the alignment checkpoint before implementation.
- `cf-start` ensures architecture context is current before fresh assessment or resume; when it is not, it routes through `cf-architecture-map` first.
- `cf-architecture-map` can also be used standalone and stop cleanly after updating `.cflow/architecture.md`.
- `cf-refine` is a separate public path for one bounded local pass. If the task becomes structural, multi-step, or architecture-shaping, it must route to `cf-start` instead of stretching the refine pass.
- A short approval can continue directly from the checkpoint.
- Any non-trivial steering after the checkpoint must go through `cf-phase-brainstorming` first.
- Repository-level assessment framing may stay inside `cf-start` or use `cf-phase-assessment` when a dedicated pass is needed.
- Lightweight work normally enters `cf-phase-work-unit-planning` before local mapping or execution so the brief records the ordered backlog and the recommended next unit.
- Hard-path work must define target shape and migration units before code edits.
- Resume is not its own phase; `cf-start` re-enters the correct phase using the brief, the current architecture map, and repository state.

## Phase Index

| Stage | Skills | What happens | May edit code |
| --- | --- | --- | --- |
| Architecture mapping and bootstrap | `cf-architecture-map` | Creates or refreshes `.cflow/architecture.md`, bootstraps `.cflow/`, updates `.gitignore` for `.cflow/`, and returns without planning work units. | No |
| Local refine entry | `cf-refine` | Applies one bounded local cleanup pass, or routes to `cf-start` when the work is really structural, multi-step, or architecture-shaping. | Yes |
| Workflow entry and resume | `cf-start` | Uses current artifacts, ensures architecture context is current, and decides whether this is fresh assessment, resume, review, or verify. | Indirectly, only by routing into execution later |
| Repository assessment | `cf-start`, `cf-phase-assessment` | Checks whether intervention is justified, records candidate intervention areas, and frames plausible direction using the current architecture map. | No |
| Alignment | `cf-start`, `cf-phase-brainstorming` | Stops after fresh assessment, then resolves user steering before execution continues. | No |
| Work-unit planning | `cf-phase-work-unit-planning` | Orders credible bounded work units, records dependencies, and chooses the recommended next unit without invoking hard-path structural planning. | No |
| Local mapping | `cf-phase-concentration-map`, `cf-phase-fragmentation-map` | Maps the active seam and clarifies whether the next bounded unit should split or consolidate. | No |
| Hard-path planning | `cf-phase-target-shape`, `cf-phase-migration-unit-planning` | Defines a repository-fitting target direction and breaks it into bounded migration units that prove that direction incrementally. | No |
| Safety lock | `cf-step-safety-net` | Chooses the smallest credible behavior lock before structural work. | No |
| Structural execution | `cf-step-boundary-apply`, `cf-step-consolidate-seam` | Applies exactly one bounded structural unit, preserving behavior. | Yes |
| Local cleanup | `cf-step-local-simplify` | Improves naming and local readability after a structural step without reopening architecture. | Yes |
| Judgment and evidence | `cf-review`, `cf-verify`, `cf-feedback-intake` | Reviews structural quality, gathers factual verification, and turns feedback into a verified next action. | No |

## Typical Sequences

### Standalone Architecture Map

`cf-architecture-map` -> update `.cflow/architecture.md` -> stop or continue with `cf-start`

### Local Refine

`cf-refine` -> optional `cf-architecture-map` -> optional `cf-step-safety-net` -> local refine pass -> optional `cf-review` -> optional `cf-verify`

### Soft Split

`cf-start` -> alignment checkpoint -> `cf-phase-work-unit-planning` -> `cf-phase-concentration-map` -> `cf-step-safety-net` -> `cf-step-boundary-apply` -> optional `cf-step-local-simplify` -> `cf-review` -> `cf-verify`

### Soft Consolidate

`cf-start` -> alignment checkpoint -> `cf-phase-work-unit-planning` -> `cf-phase-fragmentation-map` -> `cf-step-safety-net` -> `cf-step-consolidate-seam` -> optional `cf-step-local-simplify` -> `cf-review` -> `cf-verify`

### Hard Restructure

`cf-start` -> alignment checkpoint -> `cf-phase-target-shape` -> `cf-phase-migration-unit-planning` -> `cf-step-safety-net` -> one bounded execution unit -> `cf-review` -> `cf-verify`

### Resume

`cf-start` -> ensure current `.cflow/architecture.md` -> re-enter work-unit planning, mapping, safety-net, execution, review, or verify based on `.cflow/refactor-brief.md` and current repository state

## Artifacts Through The Flow

- Installer output lives in the target skill directory: `.agents/skills/` for local install, or `$CODEX_HOME/skills` / `~/.codex/skills` for global install.
- Runtime state lives in the target repository under `.cflow/`.
- The canonical runtime artifacts are:
  - `.cflow/architecture.md`
  - `.cflow/refactor-brief.md`
- `cf-architecture-map` owns bootstrap of `.cflow/`, updates `.gitignore` when needed, and creates or refreshes `.cflow/architecture.md`.
- `cf-refine` does not create `.cflow/*` itself; it may route through `cf-architecture-map` when internal safety, review, or verify skills need architecture context.
- `cf-start` owns workflow entry plus creation or refresh of `.cflow/refactor-brief.md` when needed.
- Execution, review, and verification skills keep the brief current as the handoff record between invocations.
