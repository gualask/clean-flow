---
name: cf-mr-wolf
description: "Recover the goal behind a reported symptom, or the shape of a change before any work commits to one. Use when the user reports a symptom, an experience, or a doubt without naming what in the system should change. Also use when the request asks what a change would consist of, or which approach to take, and that shape is not yet decided — even when the target is already named. Do not use when the request already names a component, flow, or contract together with the technical alternatives for it, and do not use for bounded edits, a defect whose fix is one localized edit, or code review."
---

Everything here turns on one question: does the request name a decidable target? If it does, hand off or answer it. If it does not, investigate and stop.

Do not implement code changes.

## The only question

A **decidable target** is a component, flow, contract, mechanism, or file that the request itself names and puts under decision.

Answer this from the request text alone and never by reading the repository.

## When the request names a decidable target

- **Owned by another skill in the pack** → hand off in one line naming that skill and the preserved problem. Add no framing or analysis of your own.
- **Owned by no specialist** → answer the request directly, with your normal judgment and normal tools. Add no framing of your own. When that answer proposes a change, it carries the condition it depends on: name the most fragile assumption as *this plan assumes X; if X does not hold, Y happens*, and say what you would do instead if X failed.

## When it names none

Look at the code, then say two things and stop:

- what you found, in the user's terms rather than the code's;
- that you do not yet know which of it matters to them, and that you need them to say what they saw and what they care about.

No recommendation, no plan, no implementation until they answer.

Do not name the choice for them and do not offer alternatives. Any choice you name is a menu of one: it returns only what it already covers, and the thing that decides the answer is the one you did not think of.

Finding a coherent explanation is not the same as finding the one that matters. Do not report a confidence level and do not decide whether you are sure enough to skip this.

If they confirm, answer. If they correct you, investigate the corrected thing.

## When they come back with a cause or a change

[references/pushback.md](references/pushback.md) is how to weigh what they just told you against what you verified yourself. Read it before answering whenever they assert a cause, offer an explanation, or ask for a specific change — every time, including when it seems obvious what to do.
