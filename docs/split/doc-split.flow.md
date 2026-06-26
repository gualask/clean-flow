# cf-split Flow

## Purpose

Document the runtime flow for `cf-split`, the public local entrypoint for evaluating or executing one behavior-preserving file split.

## Runtime Inputs

- Public skill: `skills/cf-split/SKILL.md`
- Runtime references: `skills/cf-split/references/evaluation.md`, `execution.md`
- Shared sources vendored into runtime paths: `skills/_shared/references/file-split-rules.md`, `navigation-cost.md`, `reference-audit.md`; `skills/_shared/scripts/repo-tree.mjs`
- Target artifacts: none

## High-Level Flow

1. Start from one explicit or inferable target source file.
2. Ask one focused question if the target, seam, or placement is ambiguous.
3. Choose evaluation or execution from the current request.
4. Read the target file, relevant imports and exports, call sites, tests, and local folder conventions.
5. In evaluation, identify real extraction seams and stop unless execution is requested.
6. In execution, perform one scoped behavior-preserving split and place extracted ownership according to local conventions.
7. Update affected imports, exports, call sites, tests, and paths.
8. Run the smallest relevant check and report scope, files touched, seam rationale, final placement, and remaining risk.
