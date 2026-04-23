---
name: cf-cognitive
description: Find or refactor one source file at a time to reduce cognitive complexity by simplifying tangled local flow and extracting cohesive file-local helpers while preserving behavior. Use when the user asks for local cognitive-complexity cleanup, with or without an explicit file target.
---
This is a supported public entrypoint for local file-level cognitive complexity refactors.

Use this for one source file at a time.
Do not bootstrap or require `.cflow/` artifacts.
If no file is provided, discover candidate files from repository evidence, choose the best first file, and refactor only that file in the current invocation.
If the request is really about repository structure, module boundaries, ownership moves, or a broad multi-file refactor, route to `cf-start` instead.

Reduce cognitive complexity in one target file while preserving behavior.

If the user provides a numeric complexity threshold, treat it as the goal when the repository has a native tool that can measure it.
If no metric tooling exists, reduce the obvious complexity drivers and report the result qualitatively instead of pretending to prove a number.

## Preflight

1. Use the explicit file target when provided; otherwise discover and rank candidate files from repository evidence.
2. Select exactly one target file for this invocation.
3. If candidate selection is ambiguous between similarly safe files, ask one focused question before editing.
4. Read the whole target file, nearby tests, and relevant call sites when they clarify behavior.
5. Check local conventions for helper placement, naming, static/private/local functions, async style, and error handling.
6. Identify the dominant complexity hotspots before editing.
7. If no file can be safely improved as one local unit, stop and route to `cf-start` or report that no good local candidate was found.

## Discovery Mode

Use discovery mode when the user asks for cognitive cleanup without naming a file.

Find candidates with cheap repository checks:

- source file size, dense functions, and repeated branching clusters
- lint or complexity reports when the repository already provides them
- recent user-mentioned areas, failing checks, or changed files when relevant
- nearby tests or smoke-checkable behavior

When discovery finds several good candidates:

- keep a short ordered candidate list in the output
- edit only the best first file in the current invocation
- recommend the next candidate as follow-up only after verification

Do not edit multiple files just because discovery found a group.
Touch other files only for minimal import/export or test adjustments required by the selected file's behavior-preserving refactor.

## Complexity Pressure

Look for:

- deeply nested conditionals
- long `if` / `else if` or `switch` chains
- complex boolean expressions
- loops with embedded branching or repeated code blocks
- validation, type-specific handling, transformations, or calculations mixed into orchestration
- several functions repeating the same local decision pattern

## Refactor Rules

- Preserve exported API and observable behavior unless the user explicitly asks to change them.
- Preserve validation behavior, exception types, exception messages, return values, side effects, and evaluation order.
- Keep the refactor scoped to the target file unless a minimal import/export update is required by a behavior-preserving local change.
- Do not move responsibilities to new files or shared utilities in this skill.
- Reduce nesting with guard clauses only when that preserves behavior and improves readability.
- Extract helpers only when they name a real responsibility, such as validation, predicates, case-specific handling, repeated transformations, or calculations.
- Prefer cohesive file-local helpers over many tiny wrappers.
- Keep helpers near the code that uses them unless the repository already has a stronger local convention.
- Use `private`, `static`, local functions, or module-private helpers according to the language and surrounding style.
- Keep async behavior intact; do not add or remove `async` unless the implementation requires it.
- Avoid helpers with large parameter lists; if extraction requires too much context, the split is probably wrong.
- Do not chase every small issue in the file. Prefer one coherent pass over the dominant hotspots.
- Do not continue into a second file in the same invocation unless the user explicitly asks and the next file is independently safe.
- Do not fix discovered behavior bugs as part of this refactor unless the user explicitly asks.

Bad extraction candidates:

- a one-line condition whose helper name merely restates the code
- pass-through wrappers
- generic `process`, `handle`, `helper`, or `util` methods
- helpers that hide important side effects
- splits that make the call flow harder to follow
- new abstractions created only to satisfy a metric

## File Shape

After refactoring, the target file should be easier to scan:

1. public/exported entry points remain recognizable
2. complex local decisions have intention-revealing names
3. repeated local patterns are consolidated without creating indirection
4. helper order follows the file's existing convention when one exists

Do not force a new layout if the existing domain flow is clearer another way.

## Verification

Run the smallest relevant verification available:

- targeted tests for the file or surrounding feature
- typecheck or compile
- lint when it is meaningful for the touched code
- a narrow smoke check if no automated test exists

Use the repository's native success criteria: command exit status, compiler output, test runner output, or explicit failure messages.
Do not require a specific `failed=0` style summary unless that is how the repository's test runner reports results.

If a relevant check fails:

- decide whether the failure is caused by the refactor
- fix refactor-caused failures and re-run the relevant check
- report unrelated or pre-existing failures clearly

If no relevant check can be run, say that explicitly.

## Output Format

Return sections: **Candidate selection**, **Target file**, **Complexity hotspots**, **Refactor applied**, **Behavior preservation**, **Checks run**, **Complexity result and remaining risk**.
