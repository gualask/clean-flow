# cf-split Flow

## Purpose

Document the runtime flow for `cf-split`, the public local entrypoint for evaluating or executing one behavior-preserving file split.

## Runtime Inputs

- Public skill: `skills/cf-split/SKILL.md`
- Runtime references: `skills/cf-split/references/evaluation.md`, `execution.md`
- Shared sources vendored into runtime paths: `skills/_shared/references/file-split-rules.md`, `navigation-cost.md`, `reference-audit.md`, `regression-handling.md`; `skills/_shared/scripts/dir-population.mjs`
- Target artifacts: none

## High-Level Flow

1. Start from one explicit or inferable target source file.
2. Ask one focused question if the target, flow, or requested outcome is ambiguous.
3. Choose evaluation or execution from the current request.
4. Load every first-level reference from the selected flow in `SKILL.md`; navigation cost owns hard-trigger values, exemptions, remedies, and the report/action rule.
5. Read the target file, relevant imports and exports, call sites, tests, and local folder conventions.
6. In evaluation, identify file-level split candidates, classify each one with `file-split-rules.md`, and stop unless execution is requested.
7. Before execution edits, audit repository-controlled consumers and use external references as compatibility evidence for the candidate and placement; complete it for each candidate before choosing the one to extract.
8. Perform one scoped behavior-preserving split, creating extracted files flat next to the source file.
9. After the split, count the containing directory with the bundled `dir-population.mjs --include <directory>`, read its real source files, and settle the final placement with the shared post-split re-check: the owner-folder rule applies even when a placement count fails, and a folder that would change module or package boundaries keeps the files flat with the owner cluster deferred to `cf-architecture`. The count used to be the model's own listing (6 of 6 pairs matched `repo-tree.mjs` on 2026-10-04); since 2026-10-12 it is the script shared with `cf-cohesion` and `cf-review`, which the model ran from the skill path in 4 of 4 runs that counted a directory (three splits and one evaluation), with no count of its own.
10. Once placement is settled, move the tests of each extracted unit into a test file next to its new file, leaving in the original test file only the tests of code that stayed; then repeat the reference audit for moved names and paths, fixing stale code, configuration, and documentation references.
11. Run the smallest relevant check, then the test files that now cover the moved code; report that command and its result, or `tests not run` with the reason, and claim behavior preservation only when it passed.
12. Keep the split bounded when a hard trigger's remedy belongs to another flow, but report the complete deferred finding required by the canonical navigation-cost contract. Each function past 20 logical lines in a file the split modified is also a Deferred finding routed to `cf-cognitive`, as in cf-review's lens 8 and cf-execute's review: when function length became a soft signal (2026-10-24), the split of a 330-line TS model kept the same shape but its Deferred went from the 74-line reducer to `none` (1 run each, 2026-10-25); with the line it named the reducer and the three functions of 23–26 lines, left them untouched, suite green (1 run).
13. Report scope, files touched, the reason for the extracted candidate, final placement, and remaining risk.
