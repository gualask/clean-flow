# cf-test Flow

## Purpose

Document the runtime flow for `cf-test`, the public entrypoint for checking test assertions against observable contracts and authoritative invariants. It leaves source and test files unchanged; a batched pass writes its own recap.

It owns test-quality diagnosis, not test execution, production-code review, behavior decisions, or fixes.

## Runtime Inputs

- Public skill: `skills/cf-test/SKILL.md`
- Runtime references: `skills/cf-test/references/assertion-quality.md`, `test-agent-brief.md`
- Shared sources vendored into runtime paths: `skills/_shared/references/dynamic-agents.md`, `delegated-execution.md`; `skills/_shared/scripts/repo-tree.mjs`
- Owned artifact: `.cflow/cf-test-recap.md`, under the shared delegated-execution contract

## High-Level Flow

1. Resolve pending tests, the existing suite when the working tree holds no test change, a named history range, or explicit test targets. Separate primary tests, contract surfaces, authoritative sources, and exclusions without loading the corpus in full. Identify authoritative documents by whether they name the tested behavior, never by path proximity alone.
2. Measure the selected existing-file corpus, then follow the shared context, consent, and delegation contract.
3. Run every invariant and fragility lens locally or through the test agent brief. Every assignment applies both groups. Never interrupt a dispatched agent or replace it locally because it seems slow; only an explicit current user request authorizes interruption, and a missing report leaves the pass incomplete. The controller routes once from the shared contract's completed ledger.
4. Require a source-backed invariant and a concrete passing regression or behavior-preserving change for every candidate. Check acceptance contracts, protocol rules, intentional seams, distinct input classes, and other nearest false positives.
5. Let the controller verify cited evidence, account for every lens, and route behavior ambiguity to `cf-scenario` or domain-model decisions to `cf-mr-wolf`.
6. Return `clear` or candidate findings without editing source or test files or running tests. A batched pass persists its recap under the shared contract; a request about an existing recap follows that contract's work-through path instead of rerunning the corpus.

## Boundaries

- Does not infer requirements from implementation or testing style.
- Does not treat TypeScript as required; invalid-state analysis applies to any project type or schema system.
- Does not review production structure or general change-set quality.
- Does not prescribe a type redesign, confirm expected behavior, or fix a candidate.
- Owns only its recap, not other skills' `.cflow` state or todo files.
