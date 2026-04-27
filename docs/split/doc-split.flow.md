# cf-split Flow

## Purpose

Document the runtime flow for `cf-split`, the standalone skill for evaluating or executing one scoped behavior-preserving file split.

## Runtime Inputs

- Public skill: `skills/cf-split/SKILL.md`
- Evaluation reference: `skills/cf-split/references/evaluation.md`
- Execution reference: `skills/cf-split/references/execution.md`
- Split rules: `skills/_shared/references/file-split-rules.md`
- Reference audit rules: `skills/_shared/references/reference-audit.md`
- Target artifacts: none; this skill does not create or update `.cflow/*`

## Flow

1. Trigger `cf-split`.
2. Controller identifies one explicit or inferable target source file, using bundled repo tree output when an area-level target needs file-name context before file selection.
3. If the target or placement is ambiguous, controller asks one focused question.
4. Controller chooses evaluation or execution from the current request.
5. Controller reads `references/evaluation.md` for evaluation mode or `references/execution.md` for execution mode.
6. Controller reads the whole target file, relevant imports and exports, call sites, tests, and local folder conventions.
7. Controller loads `file-split-rules.md` before evaluation or execution, and `reference-audit.md` after moved-code execution.
8. In evaluation mode, controller reports candidate extraction seams and stops unless the current request asks to execute.
9. In execution mode, controller performs one scoped behavior-preserving split.
10. Controller re-checks the resulting local directory shape. If the split creates or extends a related file cluster, controller groups that cluster into the appropriate local subfolder when placement is clear.
11. Controller updates imports, exports, call sites, and tests affected by that split and any placement adjustment.
12. Controller runs the smallest relevant check.
13. Final output reports scope, files touched, seam rationale, final placement, checks, and remaining risks.

## Review Checks

- The skill handles one target file, not a package-wide decomposition.
- Already-split related files that are scattered across folders belong to `cf-cohesion`.
- It should not create or depend on `.cflow/*`.
- Evaluation and execution modes must stay distinct.
- Splits need a real seam: ownership, lifecycle, domain vocabulary, reuse, or testability.
- Placement must be based on the resulting local cluster, not only the new file created by the current split.
- A second or optional split must re-evaluate whether earlier flat extracted files now belong in a local subfolder.
- Placement must follow local conventions and reference audit rules.
- If the seam is not clear enough, stop or ask one focused question instead of inventing a split.
