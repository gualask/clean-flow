# cf-scenario Flow

## Purpose

Document the runtime flow for `cf-scenario`, the public entrypoint for explaining concrete code-grounded behavior, impact, and nearby unaffected paths without changing code.

## Runtime Inputs

- Public skill: `skills/cf-scenario/SKILL.md`
- Current request, relevant repository files, nearby code paths, and authoritative requirement or primary external documentation when the scenario depends on documented expected behavior
- Target artifacts: none

## High-Level Flow

1. Start from the requested bug, change, behavior, comparison, or scenario.
2. Inspect the relevant code paths before drawing conclusions.
3. Ask one focused question only if the scenario or target path is too ambiguous to verify.
4. When `cf-review` supplies a business-alignment candidate, verify its authoritative source and state the sourced expected behavior beside the changed path's actual behavior.
5. Compare nearby flows when they may share implementation or prove the impact boundary.
6. Distinguish verified behavior from inference where the code does not fully prove the conclusion.
7. Explain what the user, caller, UI, CLI, database, job, event, or external system observes.
8. Return a focused walkthrough and practical conclusion without implementing, moving files, or writing patches.
