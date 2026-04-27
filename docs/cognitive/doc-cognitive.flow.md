# cf-cognitive Flow

## Purpose

Document the runtime flow for `cf-cognitive`, the standalone local cleanup skill for reducing real cognitive complexity in source files.

## Runtime Inputs

- Public skill: `skills/cf-cognitive/SKILL.md`
- Discovery reference: `skills/cf-cognitive/references/discovery.md`
- Targeted evaluation reference: `skills/cf-cognitive/references/targeted-evaluation.md`
- Execution reference: `skills/cf-cognitive/references/execution.md`
- Shared refactor rules: `skills/_shared/references/local-refactor-rules.md`
- Shared readability review: `skills/_shared/references/local-readability-review.md` when review or simplification needs it
- Cohesion follow-up: `skills/cf-cohesion/SKILL.md` when remaining cost is cross-file placement or navigation
- Target artifacts: none; this skill does not create or update `.cflow/*`

## Flow

1. Trigger `cf-cognitive`.
2. Controller chooses exactly one entry mode from `SKILL.md`.
3. If no explicit file target was provided, controller loads `references/discovery.md`, ranks at most three candidate files, and does not edit.
4. If explicit files were provided and the current request asks to review, assess, or decide whether cleanup is worthwhile, controller loads `references/targeted-evaluation.md` and does not edit.
5. If the current request explicitly asks to refactor, reduce, clean up, fix cognitive complexity, or proceed on a confirmed candidate, controller loads `references/execution.md`.
6. In execution mode, controller reads each whole target file plus relevant tests, call sites, and local conventions.
7. Controller loads `local-refactor-rules.md` before editing in the invocation.
8. Controller edits only when the target has real local cognitive pressure, including wiring/lifecycle callbacks that contain real behavior.
9. Controller keeps behavior stable and prefers local simplification over broad extraction.
10. After each executed file, controller runs the smallest relevant check.
11. Controller stops after the explicit target set or at most three files.
12. Final output reports scope, assessment, changes, checks, and any `cf-split` or `cf-cohesion` next step.

## Review Checks

- No `.cflow/*` artifact should be created or required.
- Discovery, targeted evaluation, and execution modes must stay distinct.
- Discovery and targeted evaluation must not edit.
- Candidate discovery must be evidence-based, not a broad refactor hunt.
- Work is sequential by file; it should not fan out into repo-wide cleanup.
- Edits stay in the target file unless the user explicitly asks otherwise.
- Small methods with guard/runner/callback/try/result branching stacks are valid cleanup candidates when flattening the caller exposes intent.
- Helpers are kept only when they reduce reading cost.
- Wiring, registration, and lifecycle blocks are not automatically exempt when nested callbacks hide branching, state changes, cleanup-sensitive behavior, or multiple side effects.
- If file-level extraction appears appropriate, the next step should be `cf-split`, not unbounded splitting inside `cf-cognitive`.
- If related files are already split but scattered, the next step should be `cf-cohesion`, not local cognitive cleanup.
