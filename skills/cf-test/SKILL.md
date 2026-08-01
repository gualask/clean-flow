---
name: cf-test
description: "Report assertion-quality and test-contract findings for changed or explicitly targeted tests. Use when the request asks to review test quality, coverage against requirements or invariants, brittle or over-specified tests, implementation-detail coupling, negative assertions, or domain-invalid states representable by the project's types or schemas. Do not use to run or fix tests or to review production code generally; route structural change-set review to cf-review and behavior ambiguity to cf-scenario."
---
Report candidate test-quality findings against observable contracts and authoritative invariants. Do not edit files, run the test suite, or turn test style preferences into findings.

## Scope

Resolve exactly one test scope:

- **Pending tests**, the default when no target is named: existing test files selected by staged, unstaged, and untracked work together.
- **A named history range**: existing test files selected by the requested commits, range, or branch.
- **Explicit tests**: the named test files or directories, whether changed or unchanged.

Treat every selected test file as a **primary test** and inspect it as a whole. Treat changed production files in the same change set, production files directly imported by explicit tests, and identified authoritative documents as **contract surfaces**. Requirements, product or domain documentation, and acceptance criteria are authoritative only when they name the tested behavior; path proximity alone is insufficient. Contract surfaces provide evidence but are not themselves review targets.

Exclude generated, vendored, ignored, fixture-only, snapshot-output, and deleted files unless an authoritative requirement makes one directly relevant. If no primary test exists, report that and stop; never widen to the repository.

## Hard Gates

- No invariant or observable contract, no missing-coverage, absence, brittle-string, or over-specification finding. A preference is not a requirement.
- Report one finding per nameable test or test table. Do not convert one assertion smell into a repository-wide pattern inventory.
- Keep every finding a `candidate`. Confirming intended behavior or changing production design belongs to the user or the receiving skill.
- Complete both lens groups before routing or suggesting edits.

## Flow

1. Resolve primary tests, contract surfaces, and authoritative sources by path without loading the corpus in full.
2. Read `references/dynamic-agents.md`. Run the installed-local context gate against every primary test and already-selected contract surface. Follow its policy and consent UX exactly.
3. Read `references/assertion-quality.md` and run both declared lens groups. For `local`, run them sequentially. For `subagent-1`, `subagent-2`, or `batched`, also read `references/test-agent-brief.md` and fill every placeholder with bounded contract surfaces. Every assignment applies both lens groups. The shared reference owns assignment and completion.
4. De-risk every reported candidate against the cited test, contract surface, and authoritative source. Inspect only the cited evidence needed to accept, narrow, or exclude it.
5. Route once after the complete pass. Use `cf-scenario` when expected behavior is ambiguous, `cf-mr-wolf` when a domain-model redesign such as making invalid states unrepresentable needs a decision, and a direct bounded test edit only after the invariant is confirmed.

## Artifacts

Do not create or update repository files, including `.cflow/*` and todo files. If the user asks to persist findings, finish this pass and name `cf-todo` as a separate next action.

## Output Format

Return only:

- **Scope**: resolved scope, primary tests, contract surfaces, authoritative sources, and exclusions.
- **Context budget**: measured files, LOC, estimated tokens, selected policy, consent source, and actual model or `runtime default`; use `local` when no agent ran.
- **Lenses**: every lens from `references/assertion-quality.md`, marked reporting, silent, or not applicable with the absent condition.
- **Findings**: candidates grouped by primary test, ordered by severity, with claim, evidence, invariant or contract, impact, severity, confidence, false-positive check, and status `candidate`.
- **Handoff**: destination mapped to candidate ids, recommended first action, or `none`.
- **Result**: `clear` or `candidates found`; state that confirmation is still needed, that no files were modified, and the next action.
