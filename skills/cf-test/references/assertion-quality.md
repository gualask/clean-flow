# Assertion Quality

Run both lens groups against every primary test. A lens is silent when checked with no candidate and not applicable only when its observable precondition is absent.

## Invariant Lenses

### 1. Missing Observable Invariant

Report a test that can pass while behavior required by an authoritative source is wrong. Name the unverified output, state transition, call boundary, error, side effect, or ordering rule and show the smallest regression that would still pass.

Do not infer requirements from the implementation under test. Existing tests are authoritative only when the repository designates them as acceptance contracts.

### 2. Absence Without An Invariant

Report an assertion that something is absent only when no requirement makes that absence observable or necessary. Empty stderr, no mutation in dry-run, no delegation after invalid input, cleanup, and analogous negatives are valid when tied to an explicit contract.

### 3. Invalid Domain States Remain Representable

Report only when an authoritative domain invariant exists and the project's types, schemas, builders, or test fixtures allow a formally valid value that violates it. Show the invalid combination and how a test must compensate for, reject, or repeatedly construct it.

Keep this lens language-agnostic. TypeScript discriminated unions, schema alternatives, constructors, value objects, and validation boundaries are examples, not requirements. Route redesign judgment; do not prescribe a type shape here.

## Fragility Lenses

### 4. Redundant Assertion

Report an assertion or duplicate case that verifies no distinct requirement, boundary, regression, or input class beyond another assertion in the same scope. Similar-looking aliases, table rows, or state transitions are not redundant when each proves a separate supported path.

### 5. Over-Specified Test

Report when a test fixes incidental values, ordering, calls, arguments, intermediates, or setup beyond the observable behavior. Demonstrate a behavior-preserving implementation change that would fail the test.

Protocol steps, security flags, performance constraints, ordering, exact refs, and cleanup mechanics may be essential. Treat them as incidental only after checking authoritative sources.

### 6. Brittle String Assertion

Report exact or broad string coupling when wording is not a public CLI, API, UI, protocol, localization, or acceptance contract. Prefer the smallest stable semantic fragment only as a possible follow-up, not as an automatic prescription.

### 7. Implementation-Detail Coupling

Report assertions about private wiring, collaborator identity, helper calls, internal data shapes, or construction sequence when consumers can observe only the final contract. Dependency-injection seams, emitted commands, and collaborator identity may themselves be contractual; check before reporting.

## Evidence And Severity

Every candidate must identify the authoritative invariant or explain which observable public contract makes an asserted detail incidental. No locatable source and no concrete passing regression means no finding.

- `high`: required behavior can regress while the test still passes.
- `medium`: the test rejects a credible behavior-preserving implementation or materially obscures the contract.
- `low`: narrow duplication or wording/wiring fragility with limited maintenance impact.

For each candidate, actively check the nearest false positive: acceptance-test status, documented output, protocol/security rules, intentional seam contracts, distinct input classes, or an alternate assertion that already closes the gap. Exclude the candidate when that evidence defeats it. `No finding` is a valid and preferred result over unsupported criticism.
