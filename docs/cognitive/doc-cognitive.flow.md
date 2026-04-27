# cf-cognitive Flow

## Purpose

Document the runtime flow for `cf-cognitive`, the standalone local cleanup skill for reducing real cognitive complexity in source files.

## Runtime Inputs

- Public skill: `skills/cf-cognitive/SKILL.md`
- Shared refactor rules: `skills/_shared/references/local-refactor-rules.md`
- Shared readability review: `skills/_shared/references/local-readability-review.md` when review or simplification needs it
- Cohesion follow-up: `skills/cf-cohesion/SKILL.md` when remaining cost is cross-file placement or navigation
- Target artifacts: none; this skill does not create or update `.cflow/*`

## Flow

1. Trigger `cf-cognitive`.
2. If explicit files are provided, controller uses up to three target files in sequence.
3. If no file is provided, controller discovers and ranks up to three justified candidate files from repository evidence, using bundled repo tree output when it can reduce broad context before file selection.
4. Before editing a target file, controller reads the whole file plus relevant tests, call sites, and local conventions.
5. Controller loads `local-refactor-rules.md` before editing in the invocation.
6. Controller edits only when the target has real local cognitive pressure, including wiring/lifecycle callbacks that contain real behavior.
7. Controller keeps behavior stable and prefers local simplification over broad extraction.
8. After each file, controller runs the smallest relevant check.
9. Controller stops after the explicit target set or at most three files.
10. Final output reports files touched, checks run, and any remaining candidate shortlist.

## Review Checks

- No `.cflow/*` artifact should be created or required.
- Candidate discovery must be evidence-based, not a broad refactor hunt.
- Work is sequential by file; it should not fan out into repo-wide cleanup.
- Edits stay in the target file unless the user explicitly asks otherwise.
- Helpers are kept only when they reduce reading cost.
- Wiring, registration, and lifecycle blocks are not automatically exempt when nested callbacks hide branching, state changes, cleanup-sensitive behavior, or multiple side effects.
- If file-level extraction appears appropriate, the next step should be `cf-split`, not unbounded splitting inside `cf-cognitive`.
- If related files are already split but scattered, the next step should be `cf-cohesion`, not local cognitive cleanup.
