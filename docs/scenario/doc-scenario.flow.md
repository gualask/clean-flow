# cf-scenario Flow

## Purpose

Document the runtime flow for `cf-scenario`, the public entrypoint for deciding a named change against the scenarios it touches, without changing code. Explaining current behavior alone is outside its scope.

## Runtime Inputs

- Public skill: `skills/cf-scenario/SKILL.md`
- Current request, relevant repository files, nearby code paths, and authoritative requirement or primary external documentation when the scenario depends on documented expected behavior
- Target artifacts: none

## High-Level Flow

1. Start from the named target and proposed change whose value or impact needs a decision.
2. Inspect the relevant code paths before drawing conclusions.
3. Ask one focused question only if the scenario or target path is too ambiguous to verify.
4. When `cf-review` supplies a business-alignment candidate, verify its authoritative source and state the sourced expected behavior beside the changed path's actual behavior.
5. Compare nearby flows when they may share implementation or prove the impact boundary.
6. Distinguish verified behavior from inference where the code does not fully prove the conclusion.
7. When the change under discussion would alter stored data or its shape, state what happens to the rows that already exist.
8. Explain only the current behavior and affected or unaffected paths needed to weigh the change.
9. Return a practical conclusion about whether to make the change and what it costs elsewhere, without implementing, moving files, or writing patches.
