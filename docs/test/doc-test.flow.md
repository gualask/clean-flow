# cf-test Flow

## Purpose

Document the runtime flow for `cf-test`, the read-only public entrypoint for checking test assertions against observable contracts and authoritative invariants.

It owns test-quality diagnosis, not test execution, production-code review, behavior decisions, or fixes.

## Runtime Inputs

- Public skill: `skills/cf-test/SKILL.md`
- Runtime references: `skills/cf-test/references/assertion-quality.md`, `test-agent-brief.md`
- Shared sources vendored into runtime paths: `skills/_shared/references/dynamic-agents.md`; `skills/_shared/scripts/repo-tree.mjs`
- Target artifacts: none

## High-Level Flow

1. Resolve pending tests, a named history range, or explicit test targets. Separate primary tests, contract surfaces, authoritative sources, and exclusions without loading the corpus in full. Identify authoritative documents by whether they name the tested behavior, never by path proximity alone.
2. Measure the selected existing-file corpus, then follow the shared context, consent, and delegation contract.
3. Run every invariant and fragility lens locally or through the test agent brief. Every assignment applies both groups; the controller routes once from the shared contract's completed ledger.
4. Require a source-backed invariant and a concrete passing regression or behavior-preserving change for every candidate. Check acceptance contracts, protocol rules, intentional seams, distinct input classes, and other nearest false positives.
5. Let the controller verify cited evidence, account for every lens, and route behavior ambiguity to `cf-scenario` or domain-model decisions to `cf-mr-wolf`.
6. Return `clear` or candidate findings without editing files, running tests, or persisting artifacts.

## Boundaries

- Does not infer requirements from implementation or testing style.
- Does not treat TypeScript as required; invalid-state analysis applies to any project type or schema system.
- Does not review production structure or general change-set quality.
- Does not prescribe a type redesign, confirm expected behavior, or fix a candidate.
- Does not own `.cflow` state.
