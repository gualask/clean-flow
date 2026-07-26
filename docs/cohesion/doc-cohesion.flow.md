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
4. In targeted evaluation, load the targeted-evaluation, reference-audit, and navigation-cost references; audit candidate consumers across repository-controlled code, configuration, and documentation before building the cohesion map. Do not edit.
5. Ask one focused question if target, mode, or requested outcome is ambiguous.
6. In execution, load those references plus execution and complete or refresh the targeted evaluation without emitting intermediate output.
7. Continue only for `recommended` or `optional`; for `keep as-is` or `route`, stop without editing and return the evaluation output.
8. Use external consumers to keep files with broader ownership outside the selected cluster.
9. Move exactly one clear local cluster and keep files with broader reuse or ownership outside the slice.
10. Update affected references and repeat the shared audit for moved names and paths.
11. Keep the regrouping bounded when a hard trigger's remedy belongs to another flow, but report the complete deferred finding required by the canonical navigation-cost contract.
12. Run the smallest relevant check and report placement decision, behavior preservation, and any broader route needed.
