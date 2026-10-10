# cf-cohesion Flow

## Purpose

Document the runtime flow for `cf-cohesion`, the public local entrypoint for evaluating or regrouping already-related files into a clearer feature or workflow slice. Non-code content stays outside this flow.

## Runtime Inputs

- Public skill: `skills/cf-cohesion/SKILL.md`
- Runtime references: `skills/cf-cohesion/references/targeted-evaluation.md`
- Shared script vendored into runtime paths: `skills/_shared/scripts/dir-population.mjs` (discovery count; also used by `cf-review` lens 9)
- Shared sources vendored into runtime paths: `skills/_shared/references/navigation-cost.md`, `reference-audit.md`
- Target artifacts: none

## High-Level Flow

1. Start from the target area the request names (feature, workflow, file cluster, or directory), or from the repository in discovery.
2. Choose discovery, targeted evaluation, or execution from the current request.
3. Route single-file cleanup to `cf-cognitive`, single-file extraction to `cf-split`, and repository structure, module boundaries, cross-feature ownership moves, a folder the language or build would treat as a new package or module, a new architectural layer, or an ordered multi-step migration to `cf-architecture`, even when the request asks for the move. All three are stated as routes so the no-edit rule covers them. When routing, edit nothing, name the route and reason in Result, and end the turn.
4. In discovery, count with the bundled `dir-population.mjs` from the skill root, never a count of its own (it excludes tests, fixtures, snapshots, re-export files, declarations, and generated files); a directory it marks at 10 or more with no sub-grouping is a candidate unless its files already form one owner cluster or no owner cluster in it has three or more members. Decision is `candidates` or `none`. Do not edit.
5. In targeted evaluation, load the targeted-evaluation, reference-audit, and navigation-cost references; audit candidate consumers across repository-controlled code, configuration, and documentation before building the cohesion map. Do not edit.
6. Ask one focused question if target, mode, or requested outcome is ambiguous.
7. In execution, load those same references and complete or refresh the targeted evaluation without emitting intermediate output.
8. Continue only for `recommended` or `optional`; for `keep as-is` or `route`, stop without editing and return the evaluation output. Decision carries the label, or `regrouped` after execution.
9. Move only the files of the owner cluster the evaluation named and update their references; do not split, merge, or rewrite file contents, and do not add barrel or re-export files.
10. Repeat the shared audit for moved names and paths, then run the typecheck or compile and the tests that import the moved files.
11. Keep the regrouping bounded when a hard trigger's remedy belongs to another flow, but report the complete deferred finding required by the canonical navigation-cost contract.
12. Report checks run and their results, or why none ran, alongside placement decision, remaining risk, and next action; claim behavior preservation only when those tests passed.
