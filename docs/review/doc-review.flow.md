# cf-review Flow

## Purpose

Document the runtime flow for `cf-review`, the public entrypoint that checks a bounded set of changes for bugs, contradicted requirements, unfinished changes, stale documentation, and structure.

It is a detector, not a fixer: it produces candidate findings with evidence and routes them to the skills that own them.

The change set is the reference point that keeps findings verifiable, and it comes from one of two selectors: pending work by default, or a history range the request names. Everything after selection is identical for both.

## Runtime Inputs

- Public skill: `skills/cf-review/SKILL.md`
- Runtime references: `skills/cf-review/references/sweep.md`, `review-agent-brief.md`, `handoff.md`
- Shared sources vendored into runtime paths: `skills/_shared/references/dynamic-agents.md`, `delegated-execution.md`, `navigation-cost.md`, `reference-audit.md`; `skills/_shared/scripts/repo-tree.mjs`, `dir-population.mjs`
- Owned artifact: `.cflow/cf-review-recap.md`, under the shared delegated-execution contract

## High-Level Flow

1. Resolve one change set: pending work by default (staged, unstaged, and untracked together), or a named history range when the request asks for one. A clean tree never implies a range; with nothing pending and no range the pass stops. A range covering the whole repository is reviewed like any other.
2. Separate selected existing files, deleted entries, external reference or documentation audit surfaces, and authoritative sources. Read primary files from the working tree and old deletion names from the diff or range base.
3. Select the focus. Twelve lenses form three foci: **Bugs and requirements** (1 bugs, 2 behavior drift under a refactor claim, 3 requirement alignment), **Leftovers and docs** (4 stale references in code after a move, 5 incomplete transition, 6 documentation drift), **Structure** (7 declared invariants, 8 structural pressure, 9 placement and directory population, 10 dependency direction, 11 local anti-patterns, 12 responsibility and ownership), plus **All**. A request that names a focus gets it; otherwise the pass answers with one fixed question (change set in one line, the four foci, the default sentence) and stops; accepting without choosing selects Bugs and requirements. Measured: the question in prose or with descriptions after a colon came back as bare focus names 3 of 3 and a parenthesized "recommended" was dropped, so the foci carry self-explaining names and the default is its own sentence.
4. Measure primary files and identified authoritative sources before loading them in full, then follow the shared context, consent, and delegation contract. The gate leaves lockfiles out and lists them as `generated`; they stay out of the corpus (before: `pnpm-lock.yaml` a primary file in 3 of 3 range reviews, read in full by an agent). Measured on a 12-commit range: batched locally in three batches, each appended to the recap before the next was read; a fresh session on that recap checked only the first entry and stopped; with consent from the repository's `AGENTS.md` one agent returned every brief field and the controller verified its citations.
5. Load the sweep contract; load navigation-cost only for Structure or All, and reference-audit only for move-shaped changes under Leftovers and docs or All.
6. Run every lens of the focus locally or through the review agent brief; lenses outside it are marked `not selected`. Every assignment applies every lens of the focus. Lens 1 reports code that fails or returns a wrong result for an input it accepts, routed to `cf-mr-wolf` (measured on a division by a zero subtotal: the previous structural-only sweep missed it in 1 of 1, the model without the pack found it, the focused pass found it 7 of 7). Lens 5 counts an old module kept only to forward to its replacement as an incomplete transition (missed 0 of 2 when the line said "paths", found 2 of 2 after). Lens 9 counts directories with `dir-population.mjs` from the skill root. The ownership lens requires the owner of the information that determines a derived value to derive it and remain its single source of truth; consumers must not redefine it. The dependency lens also reports state, cache, run coordination, cancellation, or result-acceptance policy added to a module bound to one delivery environment when more than one entry point uses it, routed to `cf-architecture`. A stale path in documentation belongs to lens 6, never lens 4. Never interrupt a dispatched agent or replace it locally because it seems slow; only an explicit current user request authorizes interruption, and a missing report leaves the sweep incomplete. The controller takes the shared contract's completed ledger and verifies its cited evidence.
7. Keep repeated-shape smells out through the bounded-remedy gate, and keep file triggers at one finding while the other lenses of the focus continue.
8. When findings exist, load the handoff contract to assign finding content, severity, routing, and `hold` or `proceed`; the clean path does not load it. The handoff maps routes and recommends a single finding across all routes (worded per route, one run recommended one per route); the fixed routes, the `cf-mr-wolf` default, and "route, do not invoke" stay in `SKILL.md` as routing law. The agent brief lists the same finding fields under the same names. A handoff to mr-wolf carries the checked rule (for a bug, the triggering input), evidence, limits, and unresolved decision; it does not claim a frame that mr-wolf would otherwise gate.
9. State that test assertion quality was not assessed and recommend running `cf-test` separately against the same pending work or named history range when it adds or changes executable tests. Do not classify or count tests for this recommendation.

## Boundaries

- Does not edit repository files apart from its batched pass's recap; persisting findings elsewhere belongs to `cf-todo`, which may write in the same turn when the request asks for it.
- Keeps selected test files in the structural sweep but does not assess their assertion quality, classify or count them separately, or invoke `cf-test`.
- Never presents an empty structural sweep as an unqualified `clear` or `commit-ready`; test assertion quality and every focus not run remain explicit coverage limits.
- Does not confirm or fix a candidate; the controller de-risks only its cited evidence and never advances `status: candidate`.
- Does not report a smell whose remedy no nameable unit can clear.
- Owns only its recap. A request about an existing recap follows the shared contract's work-through path instead of rerunning the corpus; other `.cflow` state and todo files stay outside this skill.
- Does not claim requirement alignment when no authoritative source was identified or sources conflict; that is a coverage limitation, not a finding.
- A request to review an unchanged file opens the skill, which stops for lack of a change set instead of routing (2 of 2).
