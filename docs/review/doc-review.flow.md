# cf-review Flow

## Purpose

Document the runtime flow for `cf-review`, the public entrypoint that checks a bounded set of changes against the pack's structure rules.

It is a detector, not a fixer: it produces candidate findings with evidence and routes them to the skills that own them.

The change set is the reference point that keeps findings verifiable, and it comes from one of two selectors: pending work by default, or a history range the request names. Everything after selection is identical for both.

## Runtime Inputs

- Public skill: `skills/cf-review/SKILL.md`
- Runtime references: `skills/cf-review/references/sweep.md`, `handoff.md`
- Shared sources vendored into runtime paths: `skills/_shared/references/navigation-cost.md`, `local-refactor-rules.md`, `reference-audit.md`; `skills/_shared/scripts/repo-tree.mjs`
- Target artifacts: none directly; findings persist through `cf-todo` into the repository todo file

## High-Level Flow

1. Resolve one change set: pending work by default (staged, unstaged, and untracked together), or a named history range when the request asks for one. A clean tree never implies a range.
2. Treat the change set as a file selector; every selected file is in scope as a whole, read from the working tree, so a pre-existing violation in a touched file is a finding.
3. Run all ten sweep lenses over those files, collecting candidates with evidence and never routing mid-pass.
4. Take file-length evidence from the bundled tree script and structural thresholds from the canonical navigation-cost contract.
5. Stop at the candidate: a flagged file is one finding, and its internal inventory belongs to the receiving skill.
6. Drop any violation whose remedy would propagate to every site sharing a shape; the bounding rule keeps repeated-shape smells out of a pre-commit pass.
7. After the last lens, load the handoff contract and build the finding set with claim, evidence, severity, impact, confidence, introduced, exemption, route, and status.
8. Map findings to destination skills, recommend the first to open, and carry an explicit confirmed lens on anything handed to `cf-mr-wolf`.
9. Persist decided fixes as next steps with observable done criteria and undecided ones as open questions, through `cf-todo`.
10. Account for every lens in the output — reporting, silent, or not applicable with the absent condition named — so a partial sweep cannot pass as a complete one. Only the two conditional lenses, stale references and behavior drift, can be marked not applicable at all.

## Boundaries

- Does not edit repository files.
- Does not confirm, de-risk, or fix a candidate.
- Does not report smells that no single commit can clear: data clumps, primitive obsession, feature envy, temporal coupling, and leaky abstractions are excluded by the bounding rule, because a finding that never converges turns every later pass into noise.
- Does not own `.cflow` state; nothing here is resumable.
- Does not run lint, formatters, type checks, or tests, and does not hand-check the rules those already enforce: a machine-enforced rule is the tool's finding, and the declared-invariant lens keeps only what prose states and nothing verifies.
- Does not run without a change set; no pending work and no named range ends the pass instead of widening it, and a range reaching most of the repository is sent back to be narrowed.
