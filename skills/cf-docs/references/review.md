# Documentation Review

Evaluate existing docs without rewriting them wholesale.
Apply each pass below to the docs in scope, then report findings and apply fixes only where the request asks for changes.

## Accuracy Pass

Treat the code as the source of truth and the doc as a claim to verify.

- Extract every checkable statement: versions, dependency names, file and directory paths, command and script names, function and symbol names, config keys, numeric thresholds, default values.
- Verify each against the repository with native search and file reads, not from memory or from the doc's own wording.
- Flag drift explicitly: stale versions, renamed paths, removed flags, numbers that no longer match constants, structures that describe a previous design.
- Prefer pointing the doc at the constant or module that owns a value, so the doc cannot drift again.

## Redundancy Pass

Find the same concept expressed more than once.

- Cross-file: the same explanation living in two docs. Keep the full version in the doc that owns the concept and reduce the others to one line plus a link.
- Intra-file: a value, rule, or idea restated in two sections. Keep one authoritative occurrence and remove or cross-reference the rest.
- Distinguish legitimate overlap (a different angle that adds information) from duplication (the same idea reworded). Only the latter is a finding.

## Leanness Pass

Reduce text to the fundamental concepts.

- Cut historical and migration notes, restated context, and decorative wording.
- Collapse multi-paragraph explanations that carry a single idea.
- For implementation detail that only a code reader needs, follow the mode selected in the `SKILL.md` Mode Gate: in `standard` mode move it into a concise source comment; in `conservative` mode leave it in prose and report the candidate move.

## Structure Pass

Check that each section has one purpose.

- Separate orientation and decision content from exhaustive reference lists.
- Watch for several sections covering the same surface from overlapping angles; merge or scope them.
- Keep distinct doc purposes — how-to, reference, explanation — from blurring inside one section.

## Verification And Editing

- Validate that internal links and anchors resolve after any edit.
- When the request is review-only, report findings with concrete locations and proposed changes; do not edit.
- When the request asks for fixes, apply the smallest edits that resolve the findings and preserve the author's voice and the project's conventions.
