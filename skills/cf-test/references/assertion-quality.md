# Assertion Quality

Run every lens group against every primary test. A lens is silent when checked with no candidate and not applicable only when its observable precondition is absent. Each lens names the action its candidates carry.

## Invariant Lenses

### 1. Missing Observable Invariant — `strengthen`

Report a test case that can pass while an invariant, behavior an authoritative source requires, is broken. Name the unverified output, state transition, call boundary, error, side effect, or ordering rule and show the smallest concrete regression that still passes.

Do not infer invariants from the implementation under test. Existing tests are authoritative sources only when the repository designates them as acceptance tests.

### 2. Absence Without An Invariant — `remove`

Report a negative assertion only when no invariant or observable contract makes that absence observable or necessary. Empty stderr, no mutation in dry-run, no delegation after invalid input, cleanup, and analogous negative assertions are valid when tied to an invariant or observable contract.

### 3. Invalid Domain States Remain Representable — `redesign`

Report only when a domain invariant exists and the project's types, schemas, builders, or test fixtures allow a formally valid value that violates it. Show the invalid combination and how a test case must compensate for, reject, or repeatedly construct it.

Keep this lens language-agnostic. TypeScript discriminated unions, schema alternatives, constructors, value objects, and validation boundaries are examples, not requirements. Route the domain-model redesign; do not prescribe a type shape here.

## Fragility Lenses

### 4. Redundant Assertion — `remove`

Report an assertion or duplicate test case that verifies no distinct invariant, boundary, regression, or input class beyond another assertion in the same scope. A table or loop whose rows all take the same branch and assert the same thing is one test case repeated: name it and say how many rows it costs. Similar-looking aliases, table rows, or state transitions are not redundant when each proves a separate supported path — a different branch, a boundary, or an input class the others do not reach.

### 5. Over-Specified Test — `rewrite`

Report when a test case fixes incidental values, ordering, calls, arguments, intermediates, or setup beyond the observable contract. Demonstrate a behavior-preserving change that would fail the test case.

Protocol steps, security flags, performance constraints, ordering, exact refs, and cleanup mechanics may be essential. Treat them as incidental only after checking authoritative sources.

### 6. Brittle String Assertion — `rewrite`

Report exact or broad string coupling when the wording is not part of an observable contract: a public CLI, API, UI, protocol, localization, or acceptance test. Prefer the smallest stable semantic fragment only as a possible follow-up, not as an automatic prescription.

### 7. Implementation-Detail Coupling — `rewrite`

Report assertions about private wiring, collaborator identity, helper calls, internal data shapes, or construction sequence when the observable contract does not expose them. Dependency-injection seams, emitted commands, and collaborator identity may themselves be part of the observable contract; check before reporting.

## Suite Lenses

### 8. Duplicated Setup — `rewrite`

Report setup written by hand in several test files, or beside a shared helper that already does it, so that a change to a production type's shape or to that setup forces editing every copy. The setup may be a helper, a builder, a literal of a production type, or an analogous construction in the project's idiom. Name the copies and the shared home.

### 9. Nondeterministic Test — `rewrite`

Report a test case whose outcome can change without a code change. Sources include a fixed wait for asynchronous work instead of awaiting a condition or controlling the clock, a real clock or unseeded randomness the assertion depends on, the iteration order of an unordered collection, state or order shared with another test, a real resource (a fixed file name, a port, a global) shared with tests that may run concurrently, and analogous sources in the project's runtime. Name the source and the interleaving or value that flips the result.

### 10. Cross-Layer Repetition — `remove`

Group the test cases of a higher layer by the branch of the higher layer each one reaches. Within a group, cases that differ only in which branch of the delegated unit produced the higher layer's input repeat a test of the delegated unit: keep one per group and report the rest, naming the delegation (file:line) and the test of the delegated unit that already covers each. Read the delegated unit's existing tests as evidence, not as review targets.

## Evidence And Severity

Every candidate must name its invariant or the observable contract that makes an asserted detail incidental. No locatable source and no concrete regression or behavior-preserving change means no candidate.

An authoritative source's silence is not evidence. Most real behavior is never written down, so a test case asserting behavior the code genuinely has is not over-specified, brittle, or unsupported merely because no authoritative source restates it. `The implementation does this but no authoritative source says so` is a reason to leave the test case alone, not a candidate, and routing it for confirmation spends the user's attention on a working test case. Report an asserted detail as incidental only by naming the observable contract that still holds without it.

- `high`: an invariant can break while the test case still passes.
- `medium`: the test case rejects a credible behavior-preserving change or materially obscures the observable contract.
- `low`: narrow duplication or wording/wiring fragility with limited maintenance impact.

For each candidate, actively check the nearest false positive: acceptance-test status, documented output, protocol/security rules, intentional seam contracts, distinct input classes, or an alternate assertion that already closes the gap. Exclude the candidate when that evidence defeats it. `clear` is a valid result and preferred over unsupported criticism.
