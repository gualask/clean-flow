---
name: cf-docs
description: Write accurate, lean, nonduplicative documentation. Use when the request writes a Markdown file outside `.cflow/` — authoring, updating, trimming, or restructuring docs, READMEs, or design notes — or asks to audit or fact-check them against the code; do not use otherwise. Files under `.cflow/` belong to the Cflow skill that wrote them.
---
Operate as a documentation author and reviewer.
Produce docs that are accurate against the code, lean, and free of duplicated concepts.

Use this pass when the current request writes a Markdown file, or asks to audit existing docs against the code. Do not use it otherwise, nor for files under `.cflow/`: they are artifacts owned by other Cflow skills.

Treat repository state as the source of truth and do not require `.cflow/` artifacts.

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

Apply these in both flows; each flow reference says how.

- **Accuracy**: check every checkable claim against the code — versions, paths, command names, constants, thresholds, file and symbol names — and fix or report drift instead of trusting the existing text. If the repository contains no source code to check against, say so in **Checks** and apply the remaining rules.
- **Duplication**: explain a concept fully in the doc that owns it and link to it from elsewhere; remove the same concept restated across docs or within a doc.
- **Leanness**: remove only restated content, historical or migration notes, and decorative wording. A fact that no other doc or source comment carries stays in the doc; never delete it.
- **Implementation detail**: a doc carries intent, contracts, and rationale; detail that only a code reader needs belongs in a source comment. Move it there only when the request authorizes source edits; otherwise leave it in the doc and report it as a candidate move.
- **Structure**: keep decision and explanation content out of exhaustive reference lists, and do not mix how-to, reference, and explanation in one section.
- **Scope**: review or edit only the docs the request targets, preserve the author's voice and the project's doc conventions, and do not rewrite untouched docs on preference alone.

## Output Format

Return only:

- **Scope**: target docs and selected flow.
- **Findings**: per doc, accuracy drift, duplication across and within docs, and the leanness, implementation-detail, and structure issues found.
- **Changes**: edits applied or proposed; for each duplicated concept, the owner doc and the links that replace the removed copies; for each removed passage, where its facts now live.
- **Checks**: how claims were verified against the code, plus link and anchor validation.
- **Result**: what is now accurate and lean, remaining risk, and next action.
