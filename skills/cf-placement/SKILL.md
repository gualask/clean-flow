---
name: cf-placement
description: Split a source file that has grown too large into nearby files, or regroup scattered related files into one folder, preserving behavior. Use when a file is too long or mixes responsibilities, when related files are scattered or hard to find, or when asked whether a file should be split or files should live together. Do not use for non-code content; route cleanup inside functions to cf-cognitive and module or package boundaries to cf-architecture.
---
Split a source file into nearby files, or regroup related files into owner folders, while preserving behavior.

With no file or area named, count the direct source files per directory with the bundled `scripts/dir-population.mjs`, resolved from the active skill root, and name the best candidate. When a regrouping would create a folder the language or build treats as a new package or module, move files across features, or change module boundaries, do not edit: name `cf-architecture` and the reason in **Result**, and end the turn.

A split extracts named owners (a hook, component, adapter, parser, policy) into files next to the source, kept flat where a folder would be a new package or module. A regrouping moves whole files without rewriting them. Move the tests of each moved unit next to its new file, update every reference, then run those tests and the checks a move can break (types, lint, unused exports), scoped to what changed.

## Output Format

Return only:

- **Assessment**: each file created or moved with the test file that now covers it, or `no tests`; in evaluation or discovery, the candidates.
- **Checks**: commands run and results; the test command and its result, or `tests not run` with the reason.
- **Defects**: behavior defects noticed against the code's documented rules, with file and line, or `none` naming what you checked against.
- **Deferred**: each function past 20 logical lines in a file you modified, routed to `cf-cognitive`; each owner cluster kept flat because a folder would be a new package or module, routed to `cf-architecture`; or `none`.
- **Result**: behavior preservation, claimed only when the tests passed; the route and its reason when one applies.
