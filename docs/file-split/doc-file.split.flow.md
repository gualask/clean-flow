# cf-file-split Flow

## Purpose

Document the runtime flow for `cf-file-split`, the standalone skill for evaluating or executing one scoped behavior-preserving file split.

## Runtime Inputs

- Public skill: `skills/cf-file-split/SKILL.md`
- Split rules: `skills/_shared/references/file-split-rules.md`
- Reference audit rules: `skills/_shared/references/reference-audit.md`
- Target artifacts: none; this skill does not create or update `.cflow/*`

## Flow

1. Trigger `cf-file-split`.
2. Controller identifies one explicit or inferable target source file.
3. If the target or placement is ambiguous, controller asks one focused question.
4. Controller decides whether the user is asking for evaluation or execution.
5. Controller reads the whole target file, relevant imports and exports, call sites, tests, and local folder conventions.
6. Controller loads `file-split-rules.md` and `reference-audit.md` before evaluation or execution.
7. In evaluation mode, controller reports candidate extraction seams and stops unless the user asks to execute.
8. In execution mode, controller performs one scoped behavior-preserving split.
9. Controller updates imports, exports, call sites, and tests affected by that split.
10. Controller runs the smallest relevant check.
11. Final output reports scope, files touched, seam rationale, checks, and remaining risks.

## Review Checks

- The skill handles one target file, not a package-wide decomposition.
- It should not create or depend on `.cflow/*`.
- Evaluation and execution modes must stay distinct.
- Splits need a real seam: ownership, lifecycle, domain vocabulary, reuse, or testability.
- Placement must follow local conventions and reference audit rules.
- If the seam is not clear enough, stop or ask one focused question instead of inventing a split.

