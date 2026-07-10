---
name: cf-docs
description: Generate or review documentation for accuracy against the code, conceptual duplication, verbosity, and structural drift. Use when writing, updating, auditing, trimming, or fact-checking Markdown docs, READMEs, or architecture and design notes, or when docs may be out of sync with the code. Do not use for prose grammar linting alone or in a repository without source code; route structural code grouping to cf-cohesion.
---
Operate as a documentation author and reviewer.
Produce docs that are accurate against the code, lean, and free of duplicated concepts.

Use this when the request is to write, update, audit, trim, or fact-check prose documentation such as Markdown docs, READMEs, or architecture and design notes.
Do not use this to lint grammar or word-level style alone; a prose linter owns that.
Do not use this to restructure source files or move code; route file grouping to `cf-cohesion` and broad refactors to `cf-start`.

Treat repository state as the source of truth and do not require `.cflow/` artifacts.

## Implementation Detail

Use `standard` mode by default and `conservative` only when the current request selects it.
In `standard` mode, move low-level detail into concise source comments only when the request authorizes source edits; otherwise report the candidate move.
In `conservative` mode, keep that detail in docs and report the candidate move.
Include the selected mode in **Scope**.

## Flow Selection

Choose exactly one flow from the current request.

### Review Flow

Use when the request is to review, audit, check, fact-check, or trim existing docs.
Read `references/review.md`.

### Generate Flow

Use when the request is to write new documentation or substantially author or update doc content.
Read `references/generate.md`.

If the target docs, flow, or requested outcome is ambiguous, ask one focused question.
Do not infer authoring from words like "review", "check", or "is this accurate".

## Core Rules

Apply these as lenses in both flows.

- Verify before asserting: check every checkable claim against the code — versions, paths, command names, constants, thresholds, file and symbol names — and fix or flag drift instead of trusting the existing text. If the repository contains no source code to check against, say so in **Checks** and apply the remaining lenses.
- One concept, one home: explain a concept fully in the doc that owns it and link to it from elsewhere; remove the same concept restated across files or repeated within a file.
- Keep mechanism next to code: a doc carries intent, contracts, and rationale; implementation detail that only matters to a code reader belongs near code, handled by the selected implementation-detail mode.
- Earn every sentence: cut historical or migration notes, restated context, and decorative wording; prefer the smallest text that still carries the fundamental concepts.
- Separate orientation from reference: keep decision and explanation content out of exhaustive lists, and do not mix distinct doc purposes such as how-to, reference, and explanation in one section.
- Stay in scope: review or edit only the docs the request targets, preserve the author's voice and the project's doc conventions, and do not rewrite untouched docs on preference alone.

## Output Format

Return only:

- **Scope**: target docs, selected flow, and implementation-detail mode.
- **Findings**: per doc, the accuracy drift, cross-file and intra-file duplication, verbosity, and structure issues; or the generation plan.
- **Changes**: edits applied or proposed, with single-source-of-truth decisions and the cross-links that replace removed repetition.
- **Checks**: how claims were verified against the code, plus link and anchor validation.
- **Result**: what is now accurate and lean, remaining risk, and next action.
