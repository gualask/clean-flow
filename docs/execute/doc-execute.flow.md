# cf-execute Flow

## Purpose

Maintainer summary for `cf-execute`, which plans and implements an approved spec: a structural spec from `cf-architecture` or a feature spec from `cf-brainstorm`. Runtime behavior belongs to `skills/cf-execute/SKILL.md` and its linked references; keep this file descriptive, not authoritative.

## Runtime Inputs

- Public skill: `skills/cf-execute/SKILL.md`
- Phase references: `skills/cf-execute/references/*.md`
- Shared sources vendored into runtime paths: configured `skills/_shared/references/*.md` and `skills/_shared/scripts/repo-tree.mjs` (linked by `navigation-cost.md`)
- Artifact template: `skills/cf-execute/assets/execution-plan.template.md`
- Input artifact: the approved spec under `.cflow/specs/`, owned by the skill that wrote it
- Target artifact: `.cflow/execution-plan.md`

## Maintainer Notes

- Controller runtime stays in `skills/cf-execute/SKILL.md`; phase rules stay in `skills/cf-execute/references/*.md`.
- Three cross-phase rules are stated once in `SKILL.md`: spec authority (read, never edit or redesign; a conflict is named and asked), execution authorization (one explicitly requested accepted unit), and scope (spec or unit, repository over artifacts). Phases are reference lists; references say only where to record a deviation.
- The Spec Gate replaces cf-start's Frame Gate, assessment, and target shape. It looks for the spec and plan with `ls` (`.cflow` is git-ignored, so `rg` skips it). Without an approved spec or accepted plan it does not plan: it hands the request to `cf-architecture`, `cf-mr-wolf`, or a local skill and follows that skill in the same turn (measured: the no-spec refactor request ran architecture's first turn, no files; a bounded edit ran `cf-cognitive`, no plan). An undesigned feature goes to `cf-mr-wolf`, not `cf-brainstorm`: brainstorm accepts only an explicit user request and handed it back to mr-wolf (1 run); pointed at mr-wolf directly, the same request got mr-wolf's question with no plan and no files (1 run, 2026-09-30).
- A `draft.md` is never an approved spec: the Spec Gate hands it back to its `owner`, which promotes it. Measured: "Va bene, procedi." after architecture asked to approve the spec sent the model into execute planning from the draft, skipping promotion.
- `.cflow/execution-plan.md` names the spec path and records units, state, and drift. It does not copy the spec's design; the former `Assessment summary` and `Target direction` fields are gone. The template keeps only fields a reference reads, plus the two pressure sections: without them every structural unit was planned `feature` (1 run); with them and the mode definition, two structural plans gave the same five `split` units at 96–98 lines against 122–141 with the full template, and WU-01 ran the split path to `done` with the suite green (2026-10-01).
- Planning: a structural spec with target and `Moves` goes through `migration-unit-planning.md`, any other spec through `work-unit-planning.md`. A small spec can be one unit. Units are `split`, `consolidate`, or `feature`, defined once in `SKILL.md` Planning by what the unit does to existing code: the structural chain reads only `migration-unit-planning.md`, which never named the modes, and the pack labeled the same contract move `split` in one run and `consolidate` in another.
- Keep planning and execution as separate gates; execute one accepted unit per invocation unless asked otherwise. On resume, the recommended next unit is named and confirmed before execution; a continue request runs only the active unit (measured: "Riprendiamo il lavoro" otherwise executed the recommended unit).
- `split`/`consolidate` units run map, safety net, execution, and closure. `feature` units run safety net for preserved behavior, implement with tests for the introduced behavior, and close through `structural-closure.md`.
- No architecture criteria in execution: placement decisions belong to the spec. Measured: on a brainstorm-style feature spec that left placement open, execution put the shared state in the VS Code adapter with and without `architecture-principles.md` (1v1, 2026-09-29).
- Migration-unit planning surfaces the plan's most fragile assumption before approval.
- Closure runs the repository's full check command (`test` script or CI command) before a unit is marked `done`; a failing full check keeps the unit `active`. Measured: a split unit that ran only the plan's narrower validation left lint failing and was marked `done`.
- When a safety lock or check breaks during execution, `regression-handling.md` (shared, vendored) gates further edits: root-cause sentence, three-hypothesis hard stop, scope blast after the fix.
