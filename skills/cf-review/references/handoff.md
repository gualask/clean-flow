# Handoff

Everything here operates on the complete finding set.

## Finding Content

Every finding carries this information. The shape is free; the content is not. An element that does not apply is stated as not applying, never dropped silently.

- **claim**: what is wrong, in one sentence, as a fact about the code.
- **evidence**: a path with a line or range, or a command and the output it produced. No locatable evidence, no finding.
- **severity**: the level assigned to the rule that fired by the mapping below.
- **impact**: who or what else is affected, when that is not obvious from the claim.
- **confidence**: high, medium, or low, followed by what it rests on — what was read, what was inferred, what was not checked.
- **introduced**: whether the change set created this or found it already there.
- **exemption**: for a hard trigger, the recognized exemption considered and why it does not apply.
- **route**: the skill named by the lens that fired.
- **status**: `candidate`, always. Confirming a finding, ruling it out, or fixing it belongs to the skill on its route.

`severity` and `introduced` are independent. A pre-existing violation is not a lighter violation; it is the same violation with a different urgency. Do not hedge a hard-trigger finding with softening words, and do not let `introduced: no` become a reason to shrink it.

## Severity

Severity belongs to the rule that fired. Do not adjust it for age, confidence, change size, or ease of repair:

- Lenses 1, 2, 3, 4, 8, and 10: `high`.
- Lens 5: `high` when old and new reachable flows coexist or the change made runtime code unreachable; `medium` for a callerless compatibility shim or non-runtime leftover.
- Lenses 6, 9, and 12: `medium`.
- Lens 7: the declared level, or `medium` when none is stated.
- Lens 11: `low`.

## Grouping

Group findings by affected primary file or audit surface, ordered by how many findings each carries. Report every finding: the sweep produces one line of claim per violation, not an analysis, so the full set stays readable. If one file carries so many findings that its list buries the rest, say that in **Result** and name it as the first thing to open.

## Routing Table

Map each route to the findings it receives, then recommend a single finding to open first across all routes. Choose it by what the change set put at risk: findings with `introduced: yes` come before inherited ones, and a behavior difference comes before a structural one.

### Handing To `cf-mr-wolf`

Preserve the finding and what was actually checked. `cf-mr-wolf` decides how to handle the current request under its own contract; a finding is not an accepted change or an implementation request. Carry:

- the checked rule and where it is written down; for lens 1, the input or state that triggers the bug
- the finding itself, with its evidence
- what was not checked, so the frame's edges are visible
- the decision still needed about the finding

Hand one finding at a time. Other findings stay in the reported list and are opened one after another.

### Handing Requirement Alignment To `cf-scenario`

Carry the quoted rule and its authoritative source, the changed behavior that appears to contradict it, the affected caller or user-visible boundary, and what was not checked. `cf-scenario` confirms or rejects the finding by comparing expected and actual behavior through the relevant direct and nearby flows.

## Shipping Recommendation

Use exactly one result for a non-empty finding set:

- **hold for confirmation**: at least one introduced `high` finding exists, or a declared invariant explicitly makes the violation blocking.
- **proceed with follow-up**: findings exist, but none meets the hold rule.

State what must be confirmed; never present a finding as a confirmed shipping failure.
