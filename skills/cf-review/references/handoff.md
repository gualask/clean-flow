# Handoff

Everything here operates on the complete finding set.

## Finding Content

Every finding carries this information. The shape is free; the content is not. An element that does not apply is stated as not applying, never dropped silently.

- **claim**: what is wrong, in one sentence, as a fact about the code.
- **evidence**: a path with a line or range, or a command and the output it produced. No locatable evidence, no finding.
- **severity**: what the violation costs a maintainer. Take it from the rule that fired, not from how easy the fix looks.
- **impact**: who or what else is affected, when that is not obvious from the claim.
- **confidence**: high, medium, or low, followed by what it rests on — what was read, what was inferred, what was not checked.
- **introduced**: whether the change set created this or found it already there.
- **exemption**: for a hard trigger, the recognized exemption considered and why it does not apply.
- **route**: the destination from the lens that fired.
- **status**: `candidate`, always.

`severity` and `introduced` are independent. A pre-existing violation is not a lighter violation; it is the same violation with a different urgency. Do not hedge a hard-trigger finding with softening words, and do not let `introduced: no` become a reason to shrink it.

`status` never advances here. Confirming a candidate, ruling it out, or fixing it belongs to the receiving skill.

## Grouping

Group findings by file, files ordered by how many findings they carry. Report every finding: the sweep produces one line of claim per violation, not an analysis, so the full set stays readable.

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

Hand one finding at a time. Several unrouted findings stay in the persisted list and are opened one after another.

## Persistence

Close the pass by handing the finding set to `cf-todo`, which owns the repository todo file.

- A finding whose fix is decided becomes a next step, with a done criterion that is observable in the code: the trigger cleared, the reference gone, the old path removed.
- A finding whose fix is a real decision becomes an open question. Anything routed to `cf-mr-wolf` is an open question by construction, because what to do about it has not been decided.
- Do not invent a done criterion to force a finding into next steps. A candidate with no observable close condition is an open question.

Pass the findings as they were recorded; `cf-todo` writes the file and owns its shape.
