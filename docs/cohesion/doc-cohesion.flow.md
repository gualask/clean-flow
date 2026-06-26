# cf-cohesion Flow

## Purpose

Document the runtime flow for `cf-cohesion`, the public local entrypoint for evaluating or regrouping already-related files into a clearer feature or workflow slice.

## Runtime Inputs

- Public skill: `skills/cf-cohesion/SKILL.md`
- Runtime references: `skills/cf-cohesion/references/discovery.md`, `targeted-evaluation.md`, `execution.md`
- Shared sources vendored into runtime paths: `skills/_shared/references/navigation-cost.md`, `reference-audit.md`; `skills/_shared/scripts/repo-tree.mjs`
- Target artifacts: none

## High-Level Flow

1. Start from the requested feature, workflow, file cluster, or discovery area.
2. Choose discovery, targeted evaluation, or execution from the current request.
3. In discovery, return at most three candidate clusters and do not edit.
4. In targeted evaluation, build the cohesion map and do not edit unless a move is explicitly requested.
5. Ask one focused question if target, mode, or requested outcome is ambiguous.
6. In execution, move exactly one clear local cluster and keep broadly shared files outside the slice.
7. Update affected imports, exports, call sites, tests, and local paths; audit moved names and paths.
8. Run the smallest relevant check and report placement decision, behavior preservation, and any broader route needed.
