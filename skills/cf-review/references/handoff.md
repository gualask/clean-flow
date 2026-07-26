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
- **route**: the destination from the lens that fired.
- **status**: `candidate`, always.

`severity` and `introduced` are independent. A pre-existing violation is not a lighter violation; it is the same violation with a different urgency. Do not hedge a hard-trigger finding with softening words, and do not let `introduced: no` become a reason to shrink it.

`status` never advances here. Confirming a candidate, ruling it out, or fixing it belongs to the receiving skill.

## Severity

Severity belongs to the rule that fired. Do not adjust it for age, confidence, change size, or ease of repair:

- Lens 1: the declared level, or `medium` when none is stated.
- Lenses 2, 4, 8, and 11: `high`.
- Lenses 3, 9, and 10: `medium`.
- Lens 5: `low`.
- Lens 6: `high` for code, configuration, manifests, scripts, tests, or templates; `medium` for documentation and examples.
- Lens 7: `high` when old and new reachable flows coexist or the change made runtime code unreachable; `medium` for a callerless compatibility shim or non-runtime leftover.

## Grouping

Group findings by affected primary file or audit surface, ordered by how many findings each carries. Report every finding: the sweep produces one line of claim per violation, not an analysis, so the full set stays readable.

If one file carries so many findings that its list buries the rest, say that in **Result** and name it as the first thing to open. Do not drop findings to shorten the output.

## Routing Table

Map each destination skill to the findings it receives, then recommend one to open first. Choose it by what the change set put at risk: findings with `introduced: yes` come before inherited ones, and a behavior difference comes before a structural one.

Recommend; do not invoke. The user decides what runs next.

### Handing To `cf-mr-wolf`

`cf-mr-wolf` stops and asks which lens should drive the work whenever a broad diagnostic frame is unconfirmed. Findings arriving from here already have one, so state it explicitly or that gate fires and the handoff stalls:

- the confirmed lens: which rule was checked and where it is written down
- the finding itself, with its evidence
- what was not checked, so the frame's edges are visible
- that the finding is a candidate needing a decision, not a framed problem needing a plan

Hand one finding at a time. Other findings stay in the reported list and are opened one after another.

### Handing Business Alignment To `cf-scenario`

Carry the quoted authoritative rule and its source, the changed behavior that appears to contradict it, the affected caller or user-visible boundary, and what was not checked. `cf-scenario` confirms or rejects the candidate by comparing expected and actual behavior through the relevant direct and nearby flows.

## Shipping Recommendation

Use exactly one result for a non-empty finding set:

- **hold for confirmation**: at least one introduced `high` candidate exists, or a declared invariant explicitly makes the violation blocking.
- **proceed with follow-up**: findings exist, but none meets the hold rule.

A hold is provisional because findings remain candidates. State what must be confirmed; never present a candidate as a confirmed shipping failure.
