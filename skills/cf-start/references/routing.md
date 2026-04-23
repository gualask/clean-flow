# cf-start Routing Reference

Use this reference when the prompt is ambiguous, when fresh assessment needs the full decision rules, or when resume needs an exact routing choice.
Ensure this reference has been read in the current invocation before finalizing any non-trivial fresh assessment path, and before resume routing whenever the next phase is not already obvious from an active current work unit.

## Intent inference

Use these modes:

- `assessment-only`
- `assessment-then-alignment`
- `resume-existing-work`
- `review-or-verify`

Heuristics:

- If there is no live brief or the task looks new, start with assessment.
- If there is a live brief and the user says resume / continue / proceed, resume from the correct phase.
- If the user explicitly asks only for review or verification, bootstrap or refresh prerequisites first and then route internally to that mode.
- For non-trivial fresh work, default to `assessment-then-alignment`.

## Fresh assessment details

Determine:

- whether intervention is justified
- candidate intervention areas worth tracking in the brief
- dominant pressure: concentration | fragmentation | mixed | neither
- intervention mode: soft-split | soft-consolidate | soft-mixed | hard-restructure | no-structural-refactor

Rules:

- Use `cf-architecture-map` whenever `.cflow/architecture.md` is missing, stale, or materially incomplete.
- Use `cf-internal-assessment` when repository-level intervention framing is still needed after architecture context is current.
- For non-trivial work, create or refresh `.cflow/refactor-brief.md`.
- Treat `soft-mixed` as a repository-level outcome, not as one executable step.
- In `soft-mixed`, break the work into bounded work units and assign each unit exactly one `mode`: `split` or `consolidate`.
- For lightweight paths, propose `cf-internal-work-unit-planning` as the next planning phase before local mapping or execution unless the next active unit is already clearly selected and recorded.
- For hard restructure, propose `cf-internal-target-shape` first, then `cf-internal-migration-unit-planning`.
- Do not implement yet.
- Always end fresh assessment at the alignment checkpoint with exactly one focused question.

## Detailed resume routing

Resume from the correct point:

- if `.cflow/architecture.md` is missing, stale, or materially incomplete -> `cf-architecture-map`
- if the brief is stale, or repository changes made the recorded path or work-unit state unreliable -> reassessment
- if repository-level intervention framing is still unclear -> `cf-internal-assessment`
- if hard-path direction is chosen but target shape is still unresolved -> `cf-internal-target-shape`
- if hard-path direction is aligned but migration units are not yet planned -> `cf-internal-migration-unit-planning`
- if `current work unit` is `none` and the next bounded unit is not yet selected and recorded -> `cf-internal-work-unit-planning`
- if an active work unit is selected but not ready -> concentration or fragmentation mapping, or safety-net
- if an active work unit is ready for structural work -> execute by its declared mode:
  - `split` -> split work
  - `consolidate` -> consolidate work
- if structural work is already done -> review or verify based on whether judgment or factual closure is needed

Rules:

- In `soft-mixed`, select the next work unit by local dominant pressure and use that unit's declared mode.
- Do not jump from lightweight assessment directly into local mapping or execution unless the next active work unit is already explicitly selected in the brief or prompt.
- Do not silently switch direction without updating the artifacts.
- Do not execute more than one bounded work unit per invocation unless the user explicitly asked for a broader pass.
