# AGENTS.md

## Cflow defaults

- Use the user's language for conversational output.
- Use the repository's dominant documentation language for durable artifacts.
- If the repository has no dominant documentation language, use the user's language for artifacts too.
- Preserve observable behavior unless a behavior change is explicitly requested.
- Never propose a big-bang rewrite.
- Keep refactors bounded, reviewable, and reversible.
- Prefer soft intervention by default.
- Recommend hard restructure only when the repository shape itself is a recurring cause of friction.
- Do not force DDD, hexagonal, modular monolith, feature-first, or vertical slices as universal defaults.
- Prefer evidence from the repository over generic clean-code doctrine.

## Repository map contract

- `architecture.md` must always exist.
- Treat `architecture.md` as the stable repository map for both humans and LLMs.
- Read `architecture.md` before Cflow assessment, review, or refactor work.
- If `architecture.md` is missing or materially incomplete, create or refresh it during assessment before locking a non-trivial direction.
- Keep `architecture.md` concise, stable, and architectural.
- Do not turn `architecture.md` into a changelog or refactor diary.
- Update `architecture.md` when repository structure, dependency direction, entry points, external boundaries, or architectural guidance materially changed.

## Assessment contract

- Initial assessment always happens before non-trivial execution.
- After assessment, always present an **alignment checkpoint** to the user.
- The checkpoint is lightweight by default:
  - if the user confirms, continue with the proposed path
  - if the user changes scope, risk, exclusions, or direction, switch into brainstorming
- Resume is not a phase. Resume must re-enter the correct assessment or execution phase from artifacts and repository evidence.

## Pressure model contract

Assess both lenses before locking structural work:

### Concentration pressure
Look for:
- god files
- mixed responsibilities
- hidden workflows
- orchestration / integration confusion
- scattered I/O
- dense files that resist local understanding

### Fragmentation pressure
Look for:
- too many micro-files with no real boundary
- pass-through wrappers
- high hop count for simple workflows
- artificial boundaries
- modules split for style rather than responsibility
- indirection that hides rather than clarifies the flow

Conclude with one of:
- `soft-split`
- `soft-consolidate`
- `soft-mixed`
- `hard-restructure`
- `no-structural-refactor`

Rules:
- If concentration dominates, split.
- If fragmentation dominates, consolidate.
- If both dominate, usually consolidate the fake boundaries first, then split where pressure remains.
- If neither dominates, avoid structural refactor.
- Before a split-oriented structural move on a local seam, map:
  - hidden workflows
  - role classification:
    - entry points
    - orchestration
    - integrations
    - pure logic
  - the safest split direction for that seam

## Premise check contract

- Before recommending a hard path, confirm that the repository shape itself is the recurring source of friction.
- Reassess the conclusion when new evidence weakens the original motivation.
- Do not elaborate architecture just because the codebase is messy.
- If a soft intervention would likely remove most of the pressure, say so.

## Brainstorming contract

- Brainstorming is triggered by the alignment checkpoint whenever the user does not simply confirm the proposed path.
- Ask one question at a time.
- Ask only when the answer materially changes scope, risk, exclusions, direction, or non-goals.
- Prefer repository evidence first; do not ask what can already be inferred from the codebase.
- Offer at most two concrete options with trade-offs and a recommendation.
- Keep brainstorming lightweight; do not turn it into a spec-writing phase.

## Refactor brief contract

- `refactor-brief.md` is the intervention document for the current cleanup or refactor.
- Treat `refactor-brief.md` as a living document when it exists.
- If `refactor-brief.md` exists, read it before starting work.
- The repository is the source of truth. Verify the brief against the real codebase before acting on it.
- If the brief is stale, incomplete, or contradicted by the code, update it.
- Skills that change understanding, code, or completion status must update the brief before stopping.
- Keep work units concise. Describe intent, risk, and validation, not pseudo-code.
- Keep a short skill trace in the brief:
  - flow stage
  - last active skill
  - current work unit
  - next expected entrypoint

## Skill observability contract

- When a Cflow skill responds, make the active skill explicit in the response body.
- Keep `Execution state.last active skill` and `Execution state.next expected entrypoint` current in `refactor-brief.md`.

## Context hygiene contract

- Prefer one thread for assessment + alignment + one work unit.
- Prefer a fresh context for a new seam reassessment or after a long implementation trace.
- Do not depend on hidden chat history when artifacts and the repository can carry the state more safely.

## Step skill contract

- Treat `cf-step-*` skills as fail-closed execution skills.
- If a `cf-step-*` skill has no brief and no explicit local behavior-preserving scope in the prompt, it must stop before implementation and route to `cf-start` or the correct `cf-phase-*` skill.
- Do not let step skills invent missing strategy, missing work units, or broad scope.
- If a split-oriented step does not yet have a clear local seam map, route to `cf-phase-concentration-map` before editing.
- If a consolidate-oriented step does not yet have a clear artificial-boundary diagnosis, route to `cf-phase-fragmentation-map` before editing.

## Safety net contract

- Before structural moves, identify the smallest credible behavior lock for the touched area.
- Prefer existing tests or checks first.
- Add characterization tests only when they materially reduce refactor risk.
- Characterization tests lock current behavior, not ideal behavior.
- If automated checks are not practical, define the narrowest believable smoke checks or invariants.
- Do not turn safety-net work into a broad testing initiative unless the user asked for that.

## Verification contract

- Run the smallest relevant verification after meaningful changes: tests, lint, typecheck, build, or smoke checks.
- If names, files, or paths moved, run a focused reference audit.
- When a reference audit is needed, search categories separately when relevant:
  - direct calls and type references
  - string literals containing old names or paths
  - dynamic imports / requires
  - re-exports and barrel files
  - tests, fixtures, mocks, and helpers
- If validation cannot be run, say so explicitly and record the gap.

## Review contract

- Review should judge proportionality, boundary clarity, and whether pressure really went down.
- Review should also detect cleanup mania:
  - pointless extra files
  - fake abstractions
  - artificial boundaries
  - unnecessary indirection
- Stop when the remaining seams no longer have strong evidence.
