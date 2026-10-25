# cf-scenario Flow

## Purpose

Document the runtime flow for `cf-scenario`, the public entrypoint for deciding a named change against the scenarios it touches, without changing code. Explaining current behavior alone is outside its scope.

## Runtime Inputs

- Public skill: `skills/cf-scenario/SKILL.md`
- Current request and the repository files the named change touches; the quoted authoritative source when `cf-review` routes a business-alignment candidate
- Target artifacts: none

## High-Level Flow

1. Start from the named change and the question whether it is worth making or what it costs in other scenarios.
2. When the named change would alter stored data or its shape, state what happens to the rows that already exist: a field it introduces is absent on every one of them.
3. When `cf-review` routes a business-alignment candidate, verify the quoted authoritative source, then trace each changed value from the changed line to the result a user sees, written as `file:line` steps, and compare that result with the source's expected behavior, without replacing the source with product intuition or treating implementation code as the intended rule.
4. State only as much current behavior as the decision needs.
5. Return only the `Output Format` slots: **Decision** — `make it`, `do not make it`, or `make it only if` with the condition — then **Cost in other scenarios**, one line per scenario the named change touches with `file:line`, then **Trace** only when `cf-review` routed the change; without implementing, moving files, or writing patches. The slots took the pack's standard form on 2026-10-25 (one run, asked whether to remove a trait with one production implementation: both slots filled, `do not make it`, five scenarios with `file:line`, no Trace, no edit; one run on a review finding that a change raised a documented 30 s threshold to 60 s, where the code compares milliseconds with 60: Trace ran from the constant through the comparison and both callers to the components that show the result, ended on a re-read after 60 ms, and set it against the documented rule; `do not make it`; no edit).
