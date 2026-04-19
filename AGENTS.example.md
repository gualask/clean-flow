# AGENTS.md

## Cflow defaults

- Use the user's language for conversational output.
- Use the repository's dominant documentation language for durable artifacts.
- If the repository has no dominant documentation language, use the user's language for artifacts too.
- Preserve observable behavior unless a behavior change is explicitly requested.
- Never propose a big-bang rewrite.
- Keep refactors bounded, reviewable, and reversible.
- Prefer soft cleanup by default.
- Recommend hard refactor only when the repository shape itself is a recurring cause of friction.
- Do not force DDD, hexagonal, modular monolith, feature-first, or vertical slices as universal defaults.
- Reduce mixed responsibilities by separating:
  - entry points
  - orchestration
  - integrations
  - pure logic
- Prefer local helpers over generic shared utilities unless reuse is clearly real and stable.
- Do not treat "more files" as automatic improvement.
- If a service or module hides multiple workflows, split by workflow first, then by role.
- Run the smallest relevant validation after meaningful changes: tests, lint, typecheck, build, or smoke checks.
- If validation cannot be run, say so explicitly.

## Repository map contract

- `architecture.md` must always exist.
- Treat `architecture.md` as the stable repository map for both humans and LLMs.
- Read `architecture.md` before Cflow discovery, review, or refactor work.
- If `architecture.md` is missing, create it during Phase A before locking a non-trivial refactor direction.
- Keep `architecture.md` concise, stable, and architectural.
- Do not turn `architecture.md` into a changelog or a refactor diary.
- Update `architecture.md` when repository structure, dependency direction, entry points, or architectural guidance materially changed.

## Two-phase contract

- Phase A = analysis and definition.
- Phase B = execution.
- In Phase A:
  - read `AGENTS.md`
  - read `architecture.md`
  - analyze the repository
  - decide soft vs hard
  - stop for user alignment only when a material decision is still open
  - create or refresh `refactor-brief.md` when the work is non-trivial
- In Phase B:
  - map the current work unit
  - establish a safety net
  - apply the bounded refactor
  - simplify locally if needed
  - review
  - verify

## Premise check contract

- Before recommending a hard refactor, confirm that the repository shape itself is the recurring source of friction.
- Reassess the conclusion when new evidence weakens the original motivation.
- Do not elaborate architecture just because the codebase is messy.
- If a soft cleanup would likely remove most of the pain, say so.

## Brainstorming contract

- After discovery, use brainstorming whenever a material choice is still open.
- Ask only the questions that materially change the cleanup direction, risk, or scope.
- Prefer repository evidence first; do not ask what can already be inferred from the codebase.
- Ask one question at a time.
- Offer at most two concrete options with trade-offs and a recommendation.
- If the decision space is not yet well-framed, use a short deliberation first.
- Once enough decisions are aligned, create or refresh `refactor-brief.md`.
- If the user did not clearly say whether to stop after analysis or continue into execution, ask after Phase A.

## Refactor brief contract

- `refactor-brief.md` is the intervention document for the current cleanup or refactor.
- Treat `refactor-brief.md` as a living document when it exists.
- If `refactor-brief.md` exists, read it before starting work.
- The repository is the source of truth. Verify the brief against the real codebase before acting on it.
- If the brief is stale, incomplete, or contradicted by the code, update it.
- Do not wait for the user to ask. Skills that change understanding, code, or completion status must update the brief before stopping.
- Keep work units concise. Describe intent, risk, and validation, not pseudo-code.
- If no brief exists and the task is tiny and local, entry skills may continue without creating one.
- If no brief exists and the task is non-trivial, multi-step, risky, or likely to resume in a fresh context, create or refresh `refactor-brief.md`.

## Architecture file update rules

Update `architecture.md` when any of these materially changed:

- repository purpose or top-level module map
- entry points
- external boundaries
- boundary model
- packaging model
- dependency direction
- architectural rules for future refactors

Do not update `architecture.md` for narrow local work that does not change repository understanding.

## Step skill contract

- Treat `cf-step-*` skills as fail-closed execution skills.
- If a `cf-step-*` skill has no brief and no explicit local behavior-preserving scope in the prompt, it must stop before implementation and route to `cf-start` or `cf-phase-discovery`.
- Do not let step skills invent missing strategy, missing work units, or broad scope.

## Safety net contract

- Before structural moves, identify the smallest credible behavior lock for the touched area.
- Prefer existing tests or checks first.
- Add characterization tests only when they materially reduce refactor risk.
- Characterization tests lock current behavior, not ideal behavior.
- If automated checks are not practical, define the narrowest believable smoke checks or invariants.
- Do not turn the safety-net phase into broad test design work.
- Do not weaken tests to make a refactor pass.

## Reference audit contract

- When a refactor moves, renames, splits, or re-exports symbols, run a separate reference audit before declaring completion.
- Check direct code references, string-based references, dynamic imports, re-exports, and tests or mocks as relevant.
- Record gaps explicitly if the audit could not be completed.

## Resume-safe behavior

- Assume prior chat context may be missing.
- Any skill in this pack must be able to resume from the repository plus `architecture.md` and `refactor-brief.md` when present.
- Durable file guidance matters more than chat history.
- Before stopping, leave the next session enough information to continue safely.
