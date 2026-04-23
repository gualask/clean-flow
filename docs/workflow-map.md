# Cflow Workflow Map

This document is the shortest end-to-end view of how Cflow is meant to run in a target repository.
Use it for orientation.
Use [maintaining-this-pack.md](./maintaining-this-pack.md) and [skill-contract-matrix.md](./skill-contract-matrix.md) for the full contract details.

Mermaid is used here because the main thing missing from the docs was branch and resume visibility.
The phase index below is the text fallback if the diagram is not rendered.

## Core Rules

- `cf-start` is the main supported direct user entrypoint for workflow execution and resume.
- `cf-architecture-map` is also a supported direct user entrypoint, but only for standalone repository mapping.
- `cf-cognitive` is a supported direct user entrypoint for local file-level cognitive complexity refactors; it can use an explicit file or discover candidates, and it does not require `.cflow/`.
- `cflow-skills install` only syncs `skills/`; it does not create `.cflow/`.
- All remaining skills are internal workflow steps, not supported user-facing entrypoints.
- Internal workflow skills should still be implicitly invocable in Codex when their descriptions match the current step.
- If an internal workflow skill is reached without required architecture context, it should stop and route to `cf-architecture-map`.
- If an internal workflow skill is reached without some earlier workflow context beyond architecture, it should stop and route to `cf-start` or the required earlier phase.
- `soft-mixed` is allowed only as a repository-level assessment outcome; each executable work unit must still declare exactly one mode: `split` or `consolidate`.
- A local fast lane may skip work-unit planning when one explicit, local, low-risk, behavior-preserving cohesive unit is already clear enough to map, lock, or execute.
- Work-unit planning is required when multiple candidates, dependency/order decisions, cross-boundary scope, or resumable multi-step work must be sequenced.

## End-To-End Flow

```mermaid
flowchart TD
    X[User invokes cf-cognitive] --> X0{File target provided?}
    X0 -- yes --> X1[Refactor selected source file]
    X0 -- no --> X3[Discover and rank candidate files]
    X3 --> X1
    X1 --> X2[Run the smallest relevant checks and stop]

    A[User invokes cf-architecture-map] --> A1[Build or refresh .cflow/architecture.md]
    A1 --> A2[Return map and recommend stop or continue with cf-start]

    B[User invokes cf-start] --> C{Current architecture map is usable?}
    C -- no or stale --> A1
    C -- yes --> D{Usable refactor brief already exists?}
    A1 --> D
    D -- no or stale --> E[Fresh assessment in cf-start]
    D -- yes --> F{Resume target from brief}

    E --> E1{Dedicated assessment pass needed?}
    E1 -- yes --> E2[cf-internal-assessment]
    E1 -- no --> E3[Concentration lens]
    E2 --> E3
    E3 --> E4[Fragmentation lens]
    E4 --> E5[Path framing and brief updates]
    E5 --> G[Alignment checkpoint]

    G -- simple confirmation --> H{Chosen direction}
    G -- non-trivial steering --> I[cf-internal-brainstorming]
    I --> H

    H -- local fast lane --> J0{One cohesive local unit}
    H -- soft split needing sequencing --> J[cf-internal-work-unit-planning]
    H -- soft consolidate needing sequencing --> J
    H -- soft mixed needing sequencing --> J
    H -- hard restructure --> K[cf-internal-target-shape]
    H -- review only --> R[cf-internal-review]
    H -- verify only --> S[cf-internal-verify]
    H -- no structural refactor --> T[Stop with assessment result]

    K --> L[cf-internal-migration-unit-planning]
    J0 -- mode: split --> M
    J0 -- mode: consolidate --> N
    J0 -- ready for structural work --> O
    J --> J1{Recommended next work unit}
    J1 -- mode: split --> M[cf-internal-concentration-map when seam needs mapping]
    J1 -- mode: consolidate --> N[cf-internal-fragmentation-map when seam needs mapping]
    J1 -- ready for structural work --> O[cf-internal-safety-net]
    M --> O
    N --> O
    L --> O

    O -- mode: split --> P[cf-internal-boundary-apply]
    O -- mode: consolidate --> Q[cf-internal-consolidate-seam]

    P --> U[Optional cf-internal-local-simplify]
    Q --> U
    P --> R
    Q --> R
    U --> R

    R --> S
    R --> V[cf-internal-feedback-intake when review feedback arrives]
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
- A short approval can continue directly from the checkpoint.
- Any non-trivial steering after the checkpoint must go through `cf-internal-brainstorming` first.
- Repository-level assessment framing may stay inside `cf-start` or use `cf-internal-assessment` when a dedicated pass is needed.
- Lightweight work uses the local fast lane when one cohesive local unit is already clear enough to continue.
- Lightweight work enters `cf-internal-work-unit-planning` when sequencing, dependencies, cross-boundary scope, or resumable multi-step state matters.
- Hard-path work must define target shape and migration units before code edits.
- Resume is not its own phase; `cf-start` re-enters the correct phase using the brief, the current architecture map, and repository state.

## Phase Index

| Stage | Skills | What happens | May edit code |
| --- | --- | --- | --- |
| Architecture mapping and bootstrap | `cf-architecture-map` | Creates or refreshes `.cflow/architecture.md`, bootstraps `.cflow/`, updates `.gitignore` for `.cflow/`, and returns without planning work units. | No |
| Local cognitive complexity | `cf-cognitive` | Finds or refactors one source file at a time to reduce cognitive complexity without bootstrapping Cflow artifacts. | Yes |
| Workflow entry and resume | `cf-start` | Uses current artifacts, ensures architecture context is current, and decides whether this is fresh assessment, resume, review, or verify. | Indirectly, only by routing into execution later |
| Repository assessment | `cf-start`, `cf-internal-assessment` | Checks whether intervention is justified, records candidate intervention areas, and frames plausible direction using the current architecture map. | No |
| Alignment | `cf-start`, `cf-internal-brainstorming` | Stops after fresh assessment, then resolves user steering before execution continues. | No |
| Work-unit planning | `cf-internal-work-unit-planning` | Orders credible cohesive work units, records dependencies, and chooses the recommended next unit without invoking hard-path structural planning. | No |
| Local mapping | `cf-internal-concentration-map`, `cf-internal-fragmentation-map` | Maps the active seam and clarifies whether the next bounded unit should split or consolidate. | No |
| Hard-path planning | `cf-internal-target-shape`, `cf-internal-migration-unit-planning` | Defines a repository-fitting target direction and breaks it into bounded migration units that prove that direction incrementally. | No |
| Safety lock | `cf-internal-safety-net` | Chooses the smallest credible behavior lock before structural work. | No |
| Structural execution | `cf-internal-boundary-apply`, `cf-internal-consolidate-seam` | Applies exactly one bounded structural unit, preserving behavior. | Yes |
| Local cleanup | `cf-internal-local-simplify` | Improves naming and local readability after a structural step without reopening architecture. | Yes |
| Judgment and evidence | `cf-internal-review`, `cf-internal-verify`, `cf-internal-feedback-intake` | Reviews structural quality, gathers factual verification, and turns feedback into a verified next action. | No |

## Typical Sequences

### Standalone Architecture Map

`cf-architecture-map` -> update `.cflow/architecture.md` -> stop or continue with `cf-start`

### Local Cognitive Complexity

`cf-cognitive` -> use explicit file or discover candidates -> refactor one selected source file -> run smallest relevant checks -> stop

### Soft Split

`cf-start` -> alignment checkpoint -> optional `cf-internal-work-unit-planning` when sequencing is needed -> `cf-internal-concentration-map` -> `cf-internal-safety-net` -> `cf-internal-boundary-apply` -> optional `cf-internal-local-simplify` -> `cf-internal-review` -> `cf-internal-verify`

### Soft Consolidate

`cf-start` -> alignment checkpoint -> optional `cf-internal-work-unit-planning` when sequencing is needed -> `cf-internal-fragmentation-map` -> `cf-internal-safety-net` -> `cf-internal-consolidate-seam` -> optional `cf-internal-local-simplify` -> `cf-internal-review` -> `cf-internal-verify`

### Hard Restructure

`cf-start` -> alignment checkpoint -> `cf-internal-target-shape` -> `cf-internal-migration-unit-planning` -> `cf-internal-safety-net` -> one bounded execution unit -> `cf-internal-review` -> `cf-internal-verify`

### Resume

`cf-start` -> ensure current `.cflow/architecture.md` -> re-enter local fast lane, work-unit planning, mapping, safety-net, execution, review, or verify based on `.cflow/refactor-brief.md` and current repository state

## Artifacts Through The Flow

- Installer output lives in the target skill directory: `.agents/skills/` for local install, or `$CODEX_HOME/skills` / `~/.codex/skills` for global install.
- Runtime state lives in the target repository under `.cflow/`.
- The canonical runtime artifacts are:
  - `.cflow/architecture.md`
  - `.cflow/refactor-brief.md`
- `cf-architecture-map` owns bootstrap of `.cflow/`, updates `.gitignore` when needed, and creates or refreshes `.cflow/architecture.md`.
- `cf-start` owns workflow entry plus creation or refresh of `.cflow/refactor-brief.md` when needed.
- Execution, review, and verification skills keep the brief current as the handoff record between invocations.
