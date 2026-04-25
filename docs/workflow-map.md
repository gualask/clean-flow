# Cflow Workflow Map

This document is the maintainer navigation map for Cflow runtime flows.
It intentionally does not restate public skill flow steps.

Use the per-public-skill flow docs as the reference for runtime sequencing and review checks:

- `cf-start`: [start/doc-start.flow.md](./start/doc-start.flow.md)
- `cf-architecture-map`: [architecture-map/doc-architecture.map.flow.md](./architecture-map/doc-architecture.map.flow.md)
- `cf-cognitive`: [cognitive/doc-cognitive.flow.md](./cognitive/doc-cognitive.flow.md)
- `cf-file-split`: [file-split/doc-file.split.flow.md](./file-split/doc-file.split.flow.md)

Use [skill-contract-matrix.md](./skill-contract-matrix.md) for phase-reference ownership.
Use [maintaining-this-pack.md](./maintaining-this-pack.md) for maintainer rules.
Use [repo-trial-rules.md](./repo-trial-rules.md) for real target-repo validation.

## Runtime Entry Map

| User intent | Public skill flow reference |
| --- | --- |
| Start, resume, plan, execute, review, verify, or handle feedback for the main workflow | [cf-start flow](./start/doc-start.flow.md) |
| Build or refresh repository architecture context | [cf-architecture-map flow](./architecture-map/doc-architecture.map.flow.md) |
| Reduce local cognitive complexity in source files | [cf-cognitive flow](./cognitive/doc-cognitive.flow.md) |
| Evaluate or execute one source-file split | [cf-file-split flow](./file-split/doc-file.split.flow.md) |

## Cross-Flow Handoffs

- `cf-start` may hand off to `cf-architecture-map` when architecture context is missing or stale.
- `cf-architecture-map` may recommend continuing with `cf-start` after the architecture artifact is usable.
- `cf-cognitive` and `cf-file-split` are standalone local flows; they are not workflow-resume phases.
- `cf-start` phase details live under `skills/cf-start/references/*.md` and are indexed in [skill-contract-matrix.md](./skill-contract-matrix.md).

## Artifact Behavior

Runtime artifact behavior belongs in the relevant public skill flow doc.
Installer-owned outputs are covered by [maintaining-this-pack.md](./maintaining-this-pack.md).
