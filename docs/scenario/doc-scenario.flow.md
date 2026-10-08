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
5. Open with **Decision:** — `make it`, `do not make it`, or `make it only if` with the condition — then **Cost in other scenarios:**, one line per scenario the named change touches with `file:line`, without implementing, moving files, or writing patches.
