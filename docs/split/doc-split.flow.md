# cf-split Flow

## Purpose

Document the runtime flow for `cf-split`, the public local entrypoint for evaluating or executing one behavior-preserving file split.

## Runtime Inputs

- Public skill: `skills/cf-split/SKILL.md`
- Runtime references: `skills/cf-split/references/evaluation.md`, `execution.md`
- Shared sources vendored into runtime paths: `skills/_shared/references/file-split-rules.md`, `navigation-cost.md`, `reference-audit.md`, `regression-handling.md`; `skills/_shared/scripts/repo-tree.mjs`
- Target artifacts: none

## High-Level Flow

1. Start from one explicit or inferable target source file.
2. Ask one focused question if the target, seam, or placement is ambiguous.
3. Choose evaluation or execution from the current request.
4. Load every first-level reference from the selected flow in `SKILL.md`; navigation cost owns hard-trigger values, exemptions, remedies, and report/action separation.
5. Read the target file, relevant imports and exports, call sites, tests, and local folder conventions.
6. In evaluation, identify real extraction seams and stop unless execution is requested.
7. Before execution edits, audit repository-controlled consumers and use external references as compatibility evidence for the seam and placement.
8. Perform one scoped behavior-preserving split and place extracted ownership according to local conventions.
9. After the split, re-check the containing directory with the bundled repo-tree script, evaluate the resulting owner group against the shared placement guardrails, and settle the final placement there.
10. Where a folder would change module or package boundaries, keep the files flat and defer the owner group to `cf-start` instead of deciding the boundary here.
11. Once placement is settled, repeat the reference audit for moved names and paths, fixing stale code, configuration, and documentation references.
12. Run the smallest relevant check.
13. Keep the split bounded when a hard trigger's remedy belongs to another flow, but report the complete deferred finding required by the canonical navigation-cost contract.
14. Report scope, files touched, seam rationale, final placement, and remaining risk.
