# cf-review Flow

## Purpose

Document the runtime flow for `cf-review`, the public entrypoint that checks a bounded set of changes against the pack's structure rules and authoritative documented requirements.

It is a detector, not a fixer: it produces candidate findings with evidence and routes them to the skills that own them.

The change set is the reference point that keeps findings verifiable, and it comes from one of two selectors: pending work by default, or a history range the request names. Everything after selection is identical for both.

## Runtime Inputs

- Public skill: `skills/cf-review/SKILL.md`
- Runtime references: `skills/cf-review/references/sweep.md`, `review-agent-brief.md`, `handoff.md`
- Shared sources vendored into runtime paths: `skills/_shared/references/dynamic-agents.md`, `navigation-cost.md`, `reference-audit.md`; `skills/_shared/scripts/repo-tree.mjs`
- Target artifacts: none

## High-Level Flow

1. Resolve one change set: pending work by default (staged, unstaged, and untracked together), or a named history range when the request asks for one. A clean tree never implies a range.
2. Separate selected existing files, deleted entries, external reference or documentation audit surfaces, and authoritative intent sources. Read primary files from the working tree and old deletion names from the diff or range base.
3. Measure primary files and identified authoritative sources before loading them in full, then follow the shared context, consent, and delegation contract.
4. Load the sweep and navigation-cost contracts from the controller; load the reference-audit contract only for move-shaped changes.
5. Run all eleven sweep lenses locally or through the review agent brief. Every assignment applies all lenses; the controller takes the shared contract's completed ledger and verifies its cited evidence.
6. Keep repeated-shape smells out through the bounded-remedy gate, and keep file triggers at one finding while unrelated lenses continue.
7. When findings exist, load the handoff contract to assign finding content, severity, routing, and `hold` or `proceed`; the clean path does not load it.
8. State that test assertion quality was not assessed and recommend running `cf-test` separately against the same pending work or named history range when it adds or changes executable tests. Do not classify or count tests for this recommendation.

## Boundaries

- Does not edit repository files.
- Does not invoke another skill that edits repository files; persistence is a separate user-selected action.
- Keeps selected test files in the structural sweep but does not assess their assertion quality, classify or count them separately, or invoke `cf-test`.
- Never presents an empty structural sweep as an unqualified `clear` or `commit-ready`; test assertion quality remains an explicit coverage limit.
- Does not confirm or fix a candidate; the controller de-risks only its cited evidence and never advances `status: candidate`.
- Does not report a smell whose remedy no nameable unit can clear.
- Does not own `.cflow` state; nothing here is resumable.
- Does not run lint, formatters, type checks, or tests, or hand-check rules those tools enforce.
- Does not claim business correctness when no authoritative requirement source was identified; lack of such a source is a coverage limitation, not a finding.
- Does not run without a change set; no pending work and no named range ends the pass instead of widening it, and a range reaching most of the repository is sent back to be narrowed.
