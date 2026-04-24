# Maintaining This Pack

## Scope

This repository is the source pack for Cflow.

It is not a target repository that uses Cflow at runtime.

At runtime:

- skills are installed into `.agents/skills` in the target repository, or into `$CODEX_HOME/skills` / `~/.codex/skills` for global install
- Cflow artifacts live in the target repository under `.cflow/`
- this source repository does not need `.cflow/architecture.md` or `.cflow/refactor-brief.md`

## Runtime Model

Cflow has three distinct runtime pieces:

1. distribution
   - `cflow-skills install` copies skill directories plus `_shared` support resources
   - install does not bootstrap `.cflow/`
2. bootstrap
   - `cf-start` is the main supported user-facing workflow entrypoint
   - `cf-architecture-map` is the supported user-facing repository-mapping entrypoint
   - `cf-cognitive` is the supported user-facing file-level cognitive complexity refactor entrypoint, with optional discovery of up to three justified candidates
   - `cf-file-split` is the supported user-facing local file-level split entrypoint, for split evaluation or one scoped behavior-preserving file extraction
   - `cf-architecture-map` creates `.cflow/` when needed
   - `cf-architecture-map` adds `.cflow/` to `.gitignore` when needed
   - `cf-architecture-map` creates or refreshes `.cflow/architecture.md` from the shared asset template when needed
   - `cf-start` creates or refreshes `.cflow/refactor-brief.md` from its asset template when needed
3. execution
   - `cf-start` handles assessment, alignment, and resume
   - `cf-architecture-map` may be reached directly or internally from other skills that need current architecture context
   - `cf-cognitive` discovers up to three justified candidates when needed and performs local source-file refactors sequentially without requiring Cflow artifacts
   - `cf-file-split` evaluates or executes one local file-level split without requiring Cflow artifacts
   - all remaining skills are internal workflow skills
   - internal skills are normally reached from `cf-start`, with context prepared according to each skill contract

For the single-page end-to-end flow, see [workflow-map.md](./workflow-map.md).

## Canonical Artifact Paths

Target repositories use these canonical paths:

- `.cflow/architecture.md`
- `.cflow/refactor-brief.md`

## Source Of Truth

The canonical skill definitions live in `skills/`.
Shared runtime references live in `skills/_shared/` and are copied with the pack, but they are not skills.

Agent-specific install entrypoints live in `install/<agent>/`, for example `install/codex/GLOBAL.md` and `install/codex/LOCAL.md`.

The Codex entrypoints use a temporary shallow clone of this repository for each command. They do not keep a persistent pack checkout under `~/.codex/`.

For bootstrap artifacts, the source templates live inside `cf-start`:

- `skills/cf-start/assets/architecture.template.md`
- `skills/cf-start/assets/refactor-brief.template.md`

Keep `cf-architecture-map`, `cf-start`, and these asset files aligned.

## Repository Layout

```text
skills/          canonical skill source
skills/_shared/  shared runtime references used by multiple skills
src/             sync and fingerprint logic
bin/             CLI entrypoint
test/            filesystem and structure tests
docs/            maintainer documentation
```

## Key Design Decisions

- Cflow does not depend on `AGENTS.md` for manual start or artifact-backed resume.
- `cf-start` is the main supported user-facing workflow entrypoint.
- `cf-architecture-map` is the supported standalone repository-mapping entrypoint.
- `cf-cognitive` is the supported standalone file-level cognitive complexity refactor entrypoint, with optional discovery of up to three justified candidates.
- `cf-file-split` is the supported standalone file-level split entrypoint for local behavior-preserving extraction into nearby owned files.
- `cf-architecture-map` owns the supported bootstrap of `.cflow/`, `.gitignore` for `.cflow/`, and `.cflow/architecture.md`.
- `cf-start` owns workflow entry plus supported creation or refresh of `.cflow/refactor-brief.md`.
- `cf-cognitive` does not create or require `.cflow/*` artifacts.
- `cf-cognitive` should route file-level split review or extraction to `cf-file-split` instead of trying to handle it as cognitive cleanup.
- `cf-file-split` does not create or require `.cflow/*` artifacts; broader structural or cross-feature ownership moves still route to `cf-start`.
- `.cflow/*` is Cflow-owned state in the target repository.
- Internal skills are gated by required context, not by actor identity alone.
- Internal skills being non-public does not mean they are explicit-only in Codex; routable Cflow workflow skills should remain implicitly invocable so Codex can enter the next step when the task matches the skill description.
- If an internal workflow skill is invoked without required architecture context, it must stop and route to `cf-architecture-map`.
- If an internal skill is invoked directly and some earlier workflow context beyond architecture is missing, it must stop and route back to `cf-start` or the required earlier phase.
- Existing repository docs may be used as evidence during analysis.
- Files under `docs/` are maintainer documentation, not runtime instructions for models using the skills.
- Do not assume anything under `docs/` is automatically visible to the model at runtime; if a rule must shape behavior, it must live in the relevant `skills/*/SKILL.md`.
- The installer distributes skills; it does not initialize repository state.
- `_shared` is a Cflow pack convention for shared support references, not a standalone skill or an automatic import mechanism.
- `soft-mixed` is a repository-level assessment outcome, not an execution mode for one step.
- Every executable work unit must choose exactly one mode: `split` or `consolidate`.
- A local fast lane may skip work-unit planning when one explicit, local, low-risk, behavior-preserving cohesive unit is already clear enough to map, lock, or execute.
- `cf-internal-work-unit-planning` is the lightweight planning phase for ordering cohesive bounded work units without carrying hard-path structural context.
- Use work-unit planning when multiple candidates, dependency/order decisions, cross-boundary scope, or resumable multi-step work must be sequenced.
- `cf-internal-target-shape` plus `cf-internal-migration-unit-planning` are reserved for broader hard-path restructuring where the target direction itself must be defined and then proved incrementally.
- After a non-trivial fresh assessment, `cf-start` must stop at an alignment checkpoint before execution.
- After that checkpoint, simple confirmation may proceed; any non-trivial reply must enter `cf-internal-brainstorming` until the direction is clear enough.
- In `.cflow/refactor-brief.md`, `current work unit` means the active selected unit only; after a completed safe stop with no new unit selected, it should be `none` rather than the last completed unit.

For per-skill entry, gating, and routing decisions, use [skill-contract-matrix.md](/Users/blazar/Dev/clean-flow/docs/skill-contract-matrix.md).
This document keeps the rules and validation logic; the matrix records the current per-skill contract.

For collaborative validation on real target repositories, use [repo-trial-rules.md](/Users/blazar/Dev/clean-flow/docs/repo-trial-rules.md).
That document defines the user plus LLM trial loop and should stay separate from the pack's internal maintenance rules.

For the shortest runtime-oriented walkthrough of the flow, see [workflow-map.md](./workflow-map.md).

## Using `references/` In Skills

Use `references/` to keep a skill lean without hiding its core contract.

The rule is:

- keep the runtime contract and core workflow in `SKILL.md`
- move detailed reference material into `references/`

Keep in `SKILL.md`:

- what the skill is for
- when it should be used
- the core workflow or phase role
- hard gates and routing rules
- the required output contract
- the minimum artifact behavior the skill must enforce

Move to `references/` only when the content is supportive rather than foundational, for example:

- detailed decision tables
- field-by-field artifact update lists
- long heuristic sets
- large schemas or API-like reference material
- examples or variant-specific guidance

Do not move a rule into `references/` if that rule is required to understand the skill's basic role in the flow.
If removing a paragraph from `SKILL.md` would make the skill's core behavior unclear, that paragraph probably belongs in `SKILL.md`, not in `references/`.

### When To Use `references/`

Add `references/` when one of these is true:

- the skill is becoming dense because of conditional detail rather than true workflow complexity
- the same skill needs a compact main contract plus deeper material that is only relevant in some invocations
- the extracted content is reference-like and can be read on demand without changing the meaning of the main skill

Do not add `references/` just to make a skill shorter on paper.
If the extracted material is always required to understand the core workflow, keep it in `SKILL.md`.

### How To Link `references/` Correctly

Every reference file must be linked directly from `SKILL.md`.
Keep references one level deep from `SKILL.md`; do not rely on nested reference chains.

When linking a reference from `SKILL.md`:

- name the file by role, not by vague topic
- state exactly when it must be read
- prefer trigger-based wording over generic wording
- make the trigger idempotent when repeated passes are likely in one invocation

Good patterns:

- `Ensure you have read references/routing.md in this invocation before finalizing any non-trivial fresh assessment path.`
- `Ensure you have read references/artifacts.md in this invocation before creating .cflow/, touching .gitignore, or deciding required brief updates.`

Weak patterns to avoid:

- `Read this when needed.`
- `See references for more details.`
- `Read this before X.` when the same invocation may pass through `X` multiple times and the wording would encourage unnecessary rereads

If a reference is large:

- add a table of contents when it grows beyond roughly 100 lines
- add grep or search hints from `SKILL.md` when it becomes very large

### `references/` Versus `docs/`

Use `references/` for runtime-adjacent material that the model may need during skill execution.
Use `docs/` for maintainer documentation only.

Do not assume anything under `docs/` is available to the model at runtime.
If a runtime behavior depends on it, that rule must live in `SKILL.md` or in a reference file directly linked from `SKILL.md`.

## Shared Support References

Use `skills/_shared/references/` only for runtime rules that are consumed by multiple skills.

This is a Cflow pack convention, not a native skill import feature.
The installer copies `_shared` next to the installed skill directories, but the model reads shared files only when a consuming `SKILL.md` links them explicitly.
Shared references are the only intentional exception to the per-skill `references/` layout.

Rules:

- `_shared` must not contain `SKILL.md`.
- Shared references must be linked directly from every consuming `SKILL.md`.
- Keep skill-specific workflow, gating, and output contracts inside the consuming skill.
- Do not move a rule into `_shared` unless at least two skills genuinely use the same rule.
- If a skill must work when installed alone outside this pack, keep its required reference material inside that skill instead.

## Skill Reference

This section is a maintainer-facing quick reference.
The source of truth remains each `skills/*/SKILL.md`.

Standalone labels:

- `yes`: direct invocation is a supported user entrypoint
- `no`: the skill is internal and is not a supported direct user entrypoint

### Public Skills

#### `cf-start`

- Does: handles fresh assessment or artifact-backed resume and is the main supported user-facing workflow entrypoint for the pack.
- Use when: starting most cleanup or refactor work, resuming existing work, or re-entering the flow after review or verify needs.
- Expects: repository state only; existing `.cflow/architecture.md` and `.cflow/refactor-brief.md` are optional.
- Produces: a six-section fresh assessment ending at `Alignment checkpoint`, or a six-section resume or reassessment progress report.
- Standalone: `yes`
- Artifacts: creates or refreshes `.cflow/refactor-brief.md` when needed and routes through `cf-architecture-map` when `.cflow/architecture.md`, `.cflow/`, or `.gitignore` bootstrap work is needed.
- Execution-state rule: when a bounded unit is completed and no next unit is selected yet, `current work unit` should be `none`; completed-unit history belongs in `Work units` and handoff sections, not in `current work unit`.
- Typical next step: user simple confirmation into the local fast lane, `cf-internal-work-unit-planning`, or `cf-internal-target-shape`, depending on the proposed path, or `cf-internal-brainstorming` if the user gives any non-trivial reply at the alignment checkpoint.

#### `cf-architecture-map`

- Does: builds or refreshes `.cflow/architecture.md` from repository state without planning work units or implementing code.
- Use when: the user wants standalone repository mapping, or another Cflow skill needs current architecture context before it can proceed safely.
- Expects: repository state only; existing `.cflow/architecture.md` is optional.
- Produces: a six-section repository map covering context, boundaries, current structure, fit, artifacts updated, and recommended next action.
- Standalone: `yes`
- Artifacts: creates or refreshes `.cflow/architecture.md`, bootstraps `.cflow/`, updates `.gitignore` for `.cflow/`, and never creates or refreshes `.cflow/refactor-brief.md`.
- Typical next step: stop after mapping, or continue into `cf-start` when the user wants assessment, planning, or resume.

#### `cf-cognitive`

- Does: finds or refactors up to three source files sequentially to reduce real cognitive complexity while preserving behavior.
- Use when: the user asks for local cognitive complexity reduction, with or without explicit file paths.
- Expects: repository state; up to three explicit source file targets are optional. `.cflow/architecture.md` and `.cflow/refactor-brief.md` are not required.
- Produces: a four-section report covering files, changes, checks, and result.
- Standalone: `yes`
- Artifacts: does not create or update `.cflow/*`.
- Typical next step: continue through the shortlisted candidates, stop after file three, route to `cf-file-split` for file-level split review or extraction, or route to `cf-start` if the work grows beyond local file-by-file cleanup.

#### `cf-file-split`

- Does: evaluates or executes one local behavior-preserving file-level split from a source file into nearby owned files.
- Use when: the user asks whether a file should be split into files, or asks to perform a scoped local file extraction.
- Expects: repository state and one explicit or inferable target source file. `.cflow/architecture.md` and `.cflow/refactor-brief.md` are not required.
- Produces: a four-section report covering scope, decision, checks, and result.
- Standalone: `yes`
- Artifacts: does not create or update `.cflow/*`.
- Typical next step: stop after evaluation, execute the selected split when explicitly asked, or route to `cf-start` if the split becomes broader than a local file-level extraction.

Mixed-path rule:

- `soft-mixed` is allowed only as a repository-level outcome.
- In `soft-mixed`, `cf-start` breaks the work into bounded work units only when there is more than one cohesive intervention.
- Each work unit must declare exactly one execution mode: `split` or `consolidate`.
- There is no `mixed` execution step.

### Internal Skills

#### `cf-internal-assessment`

- Does: performs repository-level assessment and intervention framing using current architecture context without implementing code.
- Use when: `cf-start` needs a dedicated assessment pass before choosing or refining the next path.
- Expects: existing `.cflow/architecture.md`; existing `.cflow/refactor-brief.md` is optional.
- Produces: a five-section assessment report covering premise check, candidate areas, plausible modes, artifact decision, and next action.
- Standalone: `no`
- Artifacts: may create or refresh `.cflow/refactor-brief.md`; it must route to `cf-architecture-map` instead of creating or refreshing `.cflow/architecture.md`.
- Typical next step: `cf-internal-brainstorming`, the local fast lane, `cf-internal-work-unit-planning`, or `cf-internal-target-shape`.

#### `cf-internal-brainstorming`

- Does: resolves user decisions that materially change scope, exclusions, risk, or direction after assessment.
- Use when: `cf-start` already assessed the repository and the user gave a non-trivial reply at the alignment checkpoint.
- Expects: repository facts plus an assessed direction or live decision to resolve; existing artifacts may already exist depending on the path.
- Produces: either one focused question when a decision is still open, or a four-section alignment report.
- Standalone: `no`
- Artifacts: may update existing `.cflow/architecture.md` guidance and create or refresh `.cflow/refactor-brief.md` once enough decisions are aligned to route without another alignment pass.
- Typical next step: the local fast lane, `cf-internal-work-unit-planning`, `cf-internal-target-shape`, or the chosen bounded execution path only when the next cohesive local unit and its immediate next phase are already explicit.

#### `cf-internal-concentration-map`

- Does: maps concentration pressure in a repository area or local seam and identifies the safest split direction.
- Use when: the current work unit or path points to a `split` move and the seam still needs mapping.
- Expects: `.cflow/architecture.md`, optional `.cflow/refactor-brief.md`, and either a selected seam from the active plan or an explicit local or repo-level scope when allowed by the flow.
- Produces: a seven-section seam map covering scope, dense seams, workflow map, role classification, split direction, risks, and next action.
- Standalone: `no`
- Artifacts: updates the brief when it exists or is created in the active flow.
- Typical next step: `cf-internal-safety-net` or `cf-internal-boundary-apply`.

#### `cf-internal-fragmentation-map`

- Does: maps fragmentation pressure caused by pass-through wrappers, artificial boundaries, or excessive hop count.
- Use when: the current work unit or path points to a `consolidate` move and the seam still needs boundary analysis.
- Expects: `.cflow/architecture.md`, optional `.cflow/refactor-brief.md`, and either a selected seam from the active plan or an explicit local or repo-level scope when allowed by the flow.
- Produces: a six-section fragmentation report covering scope, artificial boundaries, indirection cost, consolidation candidates, risks, and next action.
- Standalone: `no`
- Artifacts: updates the brief when it exists or is created in the active flow.
- Typical next step: `cf-internal-safety-net` or `cf-internal-consolidate-seam`.

#### `cf-internal-work-unit-planning`

- Does: turns assessed cleanup or refactor pressure into a lightweight ordered backlog of cohesive bounded work units before implementation.
- Use when: assessment or alignment surfaced multiple credible candidates, dependency/order decisions, cross-boundary scope, or resumable multi-step work that needs sequencing without invoking hard-path planning.
- Expects: `.cflow/architecture.md`, optional `.cflow/refactor-brief.md`, and either sequencing pressure or an explicit bounded scope to order. If assessment context is still missing, route to `cf-start`; if one cohesive local unit is already clear, use the local fast lane instead; if a broader boundary or packaging decision is still unresolved, route to `cf-internal-target-shape` instead.
- Produces: a six-section planning report covering scope, candidate units, ordering logic, recommended next unit, artifacts updated, and next action.
- Standalone: `no`
- Artifacts: may create or update `.cflow/refactor-brief.md` while ordering work units, recording dependencies, and setting either an active current work unit or exactly one recommended next unit.
- Typical next step: `cf-internal-concentration-map`, `cf-internal-fragmentation-map`, or `cf-internal-safety-net`.

#### `cf-internal-target-shape`

- Does: defines the bounded target direction for a hard restructure when soft intervention is not enough.
- Use when: assessment and alignment already justify a broader hard-path change and the repository needs a concrete target shape.
- Expects: existing `.cflow/architecture.md`, existing `.cflow/refactor-brief.md`, and an already justified hard-path direction. If hard restructure is not justified, route to `cf-start`; if unresolved user steering still blocks target-shape decisions, route to `cf-internal-brainstorming`.
- Produces: a six-section target-shape report covering rationale, boundary model, packaging direction, migration constraints, artifacts updated, and next action.
- Standalone: `no`
- Artifacts: updates existing artifacts and leaves one explicit target boundary model plus one explicit packaging direction for the current hard path.
- Typical next step: `cf-internal-migration-unit-planning`.

#### `cf-internal-migration-unit-planning`

- Does: breaks a hard restructure into bounded, reviewable migration units before implementation.
- Use when: the hard-path target direction is already aligned and you need concrete migration units instead of a big-bang rewrite.
- Expects: existing `.cflow/architecture.md`, existing `.cflow/refactor-brief.md`, and an already aligned hard-path target. If hard-path planning is justified but the target direction is not aligned yet, route to `cf-internal-target-shape`; otherwise route to `cf-start`.
- Produces: a five-section migration plan covering strategy, migration units, what stays unchanged, artifacts updated, and next action.
- Standalone: `no`
- Artifacts: updates existing artifacts and leaves either an active current work unit or exactly one recommended next migration unit.
- Typical next step: `cf-internal-safety-net` for the first bounded migration unit.

#### `cf-internal-safety-net`

- Does: establishes the smallest credible behavior lock before structural work.
- Use when: the current work unit or cohesive local unit is clear and you need a go or no-go decision before editing code.
- Expects: `.cflow/architecture.md`, optional `.cflow/refactor-brief.md`, and a clearly described refactoring surface from the active work unit, local fast lane, or explicit local scope.
- Produces: a six-section safety-net report covering refactoring surface, behavior to lock, protections, remaining gaps, and next action.
- Standalone: `no`
- Artifacts: updates the brief when it exists or is created in the active flow.
- Typical next step: `cf-internal-boundary-apply` or `cf-internal-consolidate-seam`.

#### `cf-internal-boundary-apply`

- Does: applies one bounded split-oriented structural refactor step while preserving behavior.
- Use when: the active work unit is `mode: split`, or the local fast lane has one cohesive split-oriented unit, the seam is mapped enough, and a credible safety net exists.
- Expects: `.cflow/architecture.md`, optional `.cflow/refactor-brief.md`, and enough seam mapping to name workflows, safe split direction, and file placement. In the normal planned flow, the active work unit should be `mode: split`; in the local fast lane, the prompt or brief must make the cohesive local unit explicit.
- Produces: a six-section execution report covering current state, work executed, checks, artifacts, remaining work, and next action.
- Standalone: `no`
- Artifacts: updates the brief when it exists or is created in the active flow.
- Typical next step: `cf-internal-local-simplify`, `cf-internal-review`, or `cf-internal-verify`.

#### `cf-internal-consolidate-seam`

- Does: applies one bounded consolidation-oriented step to reduce over-fragmentation while preserving behavior, avoids ownership moves with weak payoff, and surfaces discovered bugs separately instead of silently folding them into the same structural pass.
- Use when: the active work unit is `mode: consolidate`, the local fast lane has one cohesive consolidation-oriented unit, or the prompt already gives an explicit local seam where the artificial boundary is clear, and a credible safety net exists.
- Expects: `.cflow/architecture.md`, optional `.cflow/refactor-brief.md`, and either a consolidation-ready seam or enough local clarity to tell that the current boundary is artificial. If that boundary is still unclear, route to `cf-internal-fragmentation-map` instead of guessing. In the normal planned flow, the active work unit should be `mode: consolidate`; in the local fast lane, the prompt or brief must make the cohesive local unit explicit.
- Produces: a six-section execution report covering current state, work executed, checks, artifacts, remaining work, and next action.
- Standalone: `no`
- Artifacts: updates the brief when it exists or is created in the active flow.
- Typical next step: `cf-internal-local-simplify`, `cf-internal-review`, or `cf-internal-verify`.

#### `cf-internal-local-simplify`

- Does: improves naming, control flow, and helper shape in the touched area without reopening architecture.
- Use when: a bounded structural step is already done and local readability can still improve.
- Expects: `.cflow/architecture.md`, optional `.cflow/refactor-brief.md`, and the touched area from the active work unit or local fast lane.
- Produces: a six-section simplification report covering current state, simplifications applied, checks, artifacts, remaining work, and next action.
- Standalone: `no`
- Artifacts: updates existing artifacts when the brief exists.
- Typical next step: `cf-internal-review` or `cf-internal-verify`.

#### `cf-internal-review`

- Does: reviews one completed bounded refactor step and judges whether it reduced pressure without over-engineering, including whether ownership moves simplified the caller, entry points stayed thin, and dead-weight wrappers were avoided.
- Use when: structural work already happened and you want judgment before acceptance or final verification.
- Expects: `.cflow/architecture.md`, optional `.cflow/refactor-brief.md`, and a clearly touched area to inspect.
- Produces: a seven-section review covering improvements, remaining mixing, over-engineering, boundary clarity, fragmentation, risk, and next action.
- Standalone: `no`
- Artifacts: updates existing artifacts when the brief exists.
- Typical next step: `cf-internal-verify`, one more bounded step, or `cf-internal-feedback-intake`.

#### `cf-internal-verify`

- Does: collects factual evidence that a bounded unit still works after refactor.
- Use when: a bounded cleanup or migration unit is finished and needs tests, lint, typecheck, build, smoke checks, or reference audits.
- Expects: `.cflow/architecture.md`, optional `.cflow/refactor-brief.md`, and a touched area with a credible verification path.
- Produces: a five-section verification report covering attempted checks, passed checks, skipped checks, confidence, and next action.
- Standalone: `no`
- Artifacts: updates existing artifacts when the brief exists.
- Typical next step: close the unit or route back to the last step skill if the evidence is not yet strong enough.

#### `cf-internal-feedback-intake`

- Does: turns review feedback into a verified next action instead of implementing it blindly.
- Use when: refactor feedback already exists and you need to validate it against the repository and current plan.
- Expects: `.cflow/architecture.md`, optional `.cflow/refactor-brief.md`, the feedback itself, and the touched repository area.
- Produces: a five-section feedback assessment covering restatement, repository evidence, assessment, path impact, and next action.
- Standalone: `no`
- Artifacts: updates existing artifacts when the brief exists.
- Typical next step: accept, narrow, reject, or route the feedback into `cf-internal-review`, `cf-internal-verify`, or a bounded execution skill.

## Skill Change Validation

When changing any part of a skill, validate it in both of these scenarios:

1. invocation by the agent inside the Cflow workflow
2. explicit invocation by a human

These two scenarios are mandatory even when only one of them is officially supported.

### Scenario Contract

- `cf-start` must work as the main supported direct human workflow entrypoint.
- `cf-architecture-map` must work as the supported direct human repository-mapping entrypoint.
- `cf-cognitive` must work as the supported direct human file-level cognitive complexity refactor entrypoint, including no-file discovery mode with up to three justified candidates.
- `cf-file-split` must work as the supported direct human file-level split entrypoint, including evaluation-only and execution modes.
- Every remaining skill is an internal workflow skill and is not a supported direct human entrypoint.
- Internal skills must still remain readable when opened or invoked directly by a human, even when the correct next action is to route to `cf-architecture-map`, `cf-start`, or another earlier required phase.
- Internal skills may still work when invoked directly if their required context already exists.
- Internal skills must stop only on missing required context, not merely because the invoker is human.
- If the only missing prerequisite is architecture context, the correct route is `cf-architecture-map`, not automatically `cf-start`.

### Validation Checklist

For each skill change, ask all of these:

- `Description`: does the `description:` still describe the real situation in both scenarios?
- `Role wording`: if the text says `user`, `human`, `reviewer`, or `agent`, does that actor identity materially change the skill behavior?
- `State wording`: if actor identity does not matter, rewrite the text in state-based terms such as existing feedback, selected work unit, open decision, or touched area.
- `Entrypoint clarity`: is it clear whether the skill is public or internal?
- `Codex invocation policy`: does `agents/openai.yaml` use the right `allow_implicit_invocation` value for this skill, and is that choice consistent with the intended workflow routing?
- `Gate type`: is the gate state-based rather than actor-based?
- `Preflight`: do the preflight rules make sense both when the skill is reached from flow and when a human reads or invokes it directly?
- `Artifact behavior`: do create, refresh, assume, or update rules match the actual contract of the skill?
- `Runtime prompt boundary`: if a rule is needed for runtime behavior, does it still live in `SKILL.md` rather than only in `docs/`?
- `No docs leakage assumption`: did you avoid treating `docs/` content as if it were automatically available to the model using the skill?
- `Output contract`: does the output still make sense for the next step in the workflow?
- `Reference sync`: does the `Skill Reference` section still say the same thing as the skill file?
- `Matrix sync`: does [skill-contract-matrix.md](/Users/blazar/Dev/clean-flow/docs/skill-contract-matrix.md) still reflect the same contract?

### Wording Rule

Prefer state-based wording over actor-based wording.

Good examples:

- `Use when refactor feedback already exists and you want to verify it before acting.`
- `Use when the current work unit or cohesive local unit is clear and a behavior lock is needed before edits.`

Use actor-based wording only when the actor identity changes the skill behavior.

Example:

- `cf-internal-brainstorming` may refer to the user because the trigger is specifically that the user is steering the direction instead of merely confirming it.

## Maintainer Workflow

When changing the pack:

- update the relevant `SKILL.md` files in `skills/`
- treat `skills/*/SKILL.md` as the runtime source of truth; do not remove runtime instructions from a skill just because similar guidance exists under `docs/`
- if a skill contract changes, update both its `SKILL.md` and the `Skill Reference` section in this document
- if a skill contract changes, update [skill-contract-matrix.md](/Users/blazar/Dev/clean-flow/docs/skill-contract-matrix.md) too
- if you add a new routable workflow skill, give it `agents/openai.yaml` metadata and keep `allow_implicit_invocation: true` unless there is a documented exception
- if architecture bootstrap behavior changes, update `skills/cf-architecture-map/SKILL.md`, `skills/cf-start/assets/architecture.template.md`, and this document
- if brief bootstrap behavior changes, update `skills/cf-start/SKILL.md`, `skills/cf-start/assets/refactor-brief.template.md`, and this document
- if the allowed execution modes or work-unit contract changes, update `skills/cf-start/SKILL.md`, `skills/cf-start/assets/refactor-brief.template.md`, and this document
- if bootstrap artifact structure changes, update the relevant asset files and both bootstrap entrypoints
- if install/remove behavior changes, update `src/` and the filesystem tests
- keep `README.md` focused on user-facing install and usage, not maintainer detail

## Testing

Run:

```bash
npm test
```

Current automated coverage checks:

- install on empty target
- update + prune + preserve foreign skills
- conflict detection on foreign same-name skills
- remove of Cflow-owned skill and support directories only
- structural checks for packaged skills
- Codex implicit invocation policy for shipped Cflow skills
- presence of `cf-start` bootstrap assets
- public entrypoint bootstrap and routing ownership split

## Manual Smoke Checks

The most important manual validation is still a real target-repo run:

1. install the pack into a target repo
2. invoke `$cf-start` as the standard workflow first-use path
3. optionally invoke `$cf-architecture-map` as the standalone repository-mapping path
4. optionally invoke `$cf-cognitive` with explicit source file targets and once without a file target in a disposable target repo
5. optionally invoke `$cf-file-split` once in evaluation mode and once with an explicit local split in a disposable target repo
6. confirm the target repo gets:
   - `.agents/skills/...`
   - `.cflow/`
   - `.cflow/architecture.md` when needed
   - `.cflow/refactor-brief.md` when needed
   - `.gitignore` updated with `.cflow/` when needed
7. if you changed an internal skill contract, confirm that invoking it without the required architecture context routes to `cf-architecture-map`, and that invoking it without some earlier workflow context routes to `cf-start` or the required earlier phase instead of bootstrapping state on its own

## Related Files

- `README.md`
- `CHANGELOG.md`
- `skills/cf-architecture-map/SKILL.md`
- `skills/cf-architecture-map/agents/openai.yaml`
- `skills/cf-cognitive/SKILL.md`
- `skills/cf-cognitive/agents/openai.yaml`
- `skills/cf-file-split/SKILL.md`
- `skills/cf-file-split/agents/openai.yaml`
- `skills/cf-start/SKILL.md`
- `skills/cf-start/assets/architecture.template.md`
- `skills/cf-start/assets/refactor-brief.template.md`
- `skills/cf-start/references/routing.md`
- `skills/cf-start/references/artifacts.md`
- `skills/cf-internal-assessment/SKILL.md`
