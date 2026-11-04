# Handoff

Everything here operates on the complete finding set.

## Finding Content

Every finding carries this information. The shape is free; the content is not. An element that does not apply is stated as not applying, never dropped silently.

- **claim**: what is wrong, in one sentence, as a fact about the code.
- **evidence**: a path with a line or range, or a command and the output it produced. No locatable evidence, no finding.
- **impact**: who or what else is affected, when that is not obvious from the claim.
- **confidence**: high, medium, or low, followed by what it rests on — what was read, what was inferred, what was not checked.
- **introduced**: on a change target, whether the change created this or found it already there; otherwise not applicable.
- **exemption**: for a hard trigger, the named exemption considered and why it does not apply.
- **route**: the skill named by the lens that fired.
- **status**: `candidate`, always. Confirming a finding, ruling it out, or fixing it belongs to the skill on its route.

A pre-existing violation is not a lighter violation; it is the same violation with a different urgency. Do not hedge a hard-trigger finding with softening words, and do not let `introduced: no` become a reason to shrink it.

## Grouping

Group findings by affected primary file or audit surface, ordered by how many findings each carries. Report every finding, in the recap when the pass wrote one: the sweep produces one line of claim per violation, not an analysis, so the full set stays readable. If one file carries so many findings that its list buries the rest, say that in **Result** and name it as the first thing to open.

## Routing Table

Map each route to the findings it receives, then recommend a single finding to open first across all routes. On a change target, choose it by what the change put at risk: findings with `introduced: yes` come before inherited ones. Otherwise, choose the finding whose route clears the most other findings.

### Handing To `cf-mr-wolf`

Preserve the finding and what was actually checked. `cf-mr-wolf` decides how to handle the current request under its own contract; a finding is not an accepted change or an implementation request. Carry:

- the checked rule and where it is written down
- the finding itself, with its evidence
- what was not checked, so the frame's edges are visible
- the decision still needed about the finding

Hand one finding at a time. Other findings stay in the reported list and are opened one after another.

## Recommendation

On a change target, use exactly one result for a non-empty finding set:

- **hold for confirmation**: the change introduced a finding from lens 1 or 7, a lens 5 hard trigger, or a lens 2 transition that leaves old and new reachable flows side by side or makes runtime code unreachable; or a declared invariant explicitly makes the violation blocking.
- **proceed with follow-up**: findings exist, but none meets the hold rule.

On a path or the repository, report the finding count per route and the first finding to open; no shipping result applies.

State what must be confirmed; never present a finding as a confirmed shipping failure.
