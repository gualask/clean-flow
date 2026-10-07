# Documentation Review

Evaluate existing docs without rewriting them wholesale.
Apply each pass below to the docs in scope, then report findings; edit only when the request asks for changes.

## Accuracy Pass

- Extract every checkable statement: versions, dependency names, file and directory paths, command and script names, function and symbol names, config keys, numeric thresholds, default values.
- Verify each against the repository with native search and file reads, not from memory or from the doc's own wording.
- Report drift explicitly: stale versions, renamed paths, removed flags, numbers that no longer match constants, structures that describe a previous design.
- Prefer pointing the doc at the constant or module that owns a value, so the doc cannot drift again.

## Duplication Pass

- Across docs: keep the full explanation in the doc that owns the concept and reduce the others to one line plus a link.
- Within a doc: keep one occurrence and remove or cross-reference the rest.
- A different angle that adds information — reference and explanation of the same symbol — is not a finding; only the same idea reworded is.

## Leanness Pass

- Mark historical and migration notes, restated context, decorative wording, and multi-paragraph explanations that carry a single idea.
- Before removing a sentence, find where else its fact lives; if nowhere, keep the fact.
- Report implementation detail as a candidate move to a source comment, following the Implementation detail rule.

## Structure Pass

- Separate decision and explanation content from exhaustive reference lists.
- Watch for several sections covering the same surface from overlapping angles; merge or scope them.
- Keep how-to, reference, and explanation from blurring inside one section.

## Verification And Editing

- When the request is review-only, report findings with concrete locations and proposed changes; do not edit.
- When the request asks for fixes or trimming, apply the smallest edits that resolve the findings, preserving the author's voice and the project's conventions.
- Validate that internal links and anchors resolve after any edit.
