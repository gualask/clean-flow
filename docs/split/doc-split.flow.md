# cf-split Flow

## Purpose

Document the runtime flow for `cf-split`, the public local entrypoint for evaluating or executing one behavior-preserving file split.

## Runtime Inputs

- Public skill: `skills/cf-split/SKILL.md`
- Runtime references: `skills/cf-split/references/evaluation.md`, `execution.md`
- Shared sources vendored into runtime paths: `skills/_shared/references/file-split-rules.md`, `navigation-cost.md`, `reference-audit.md`, `regression-handling.md`
- Target artifacts: none

## High-Level Flow

1. Start from one explicit or inferable target source file.
2. Ask one focused question if the target, flow, or requested outcome is ambiguous.
3. Choose evaluation or execution from the current request.
4. Load every first-level reference from the selected flow in `SKILL.md`; navigation cost owns hard-trigger values, exemptions, remedies, and report/action separation.
5. Read the target file, relevant imports and exports, call sites, tests, and local folder conventions.
6. In evaluation, identify real extraction seams and stop unless execution is requested.
7. Before execution edits, audit repository-controlled consumers and use external references as compatibility evidence for the seam and placement.
8. Perform one scoped behavior-preserving split, creating extracted files flat next to the source file.
9. After the split, list the containing directory, read its real source files, and settle the final placement with the shared post-split re-check: the owner-directory rule applies even when a placement count fails, and a folder that would change module or package boundaries keeps the files flat with the owner group deferred to `cf-architecture`. No bundled script: on 2026-10-04 the model's own listing gave the same counts, verdicts, and placement as `repo-tree.mjs` in 6 of 6 pairs (directory count, split, area target).
10. Once placement is settled, move the tests of each extracted unit into a test file next to its new file, leaving in the original test file only the tests of code that stayed; then repeat the reference audit for moved names and paths, fixing stale code, configuration, and documentation references.
11. Run the smallest relevant check, then the test files that now cover the moved code; report that command and its result, or `tests not run` with the reason, and claim behavior preservation only when it passed.
12. Keep the split bounded when a hard trigger's remedy belongs to another flow, but report the complete deferred finding required by the canonical navigation-cost contract.
13. Report scope, files touched, seam rationale, final placement, and remaining risk.
