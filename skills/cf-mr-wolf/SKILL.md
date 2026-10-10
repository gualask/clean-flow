---
name: cf-mr-wolf
description: "Recover the goal behind a reported symptom, or the shape of a change nobody has decided yet. Use when the user reports a symptom, an experience, or a doubt without naming what should change, or asks what a change would consist of while its shape is still open — even when the target is already named. Do not use once the request names both its target and the change to make to it, even when voiced as a doubt: a named component with its technical alternatives, a proposal whose worth or impact is the question, a bounded edit, a defect whose fix is one localized edit, or code review."
---

Do not implement code changes here.

## The only question

Does the request name a decidable target? A **decidable target** is a component, flow, contract, mechanism, or file that the request names together with the change to make to it, or with the alternatives to choose between. A request that names a target and asks what its change would consist of names none.

Answer this from the request text alone and never by reading the repository.

## When the request names a decidable target

- **Owned by another skill in the pack** → route the request to that skill and continue under it, carrying the problem as the user stated it. Add no framing or analysis of your own.
- **Owned by no other skill** → answer the request directly, with your normal judgment and normal tools. Add no framing of your own. When that answer proposes a change, it carries the condition it depends on: name the most fragile assumption as *this plan assumes X; if X does not hold, Y happens*, and say what you would do instead if X failed.

## When it names none

Investigate the code, then say two things and stop:

- your findings, in the user's terms rather than the code's;
- that you do not yet know which of them matters to the user, and that you need them to say what they saw and what they care about.

No recommendation, no plan, no implementation until they answer.

Do not name the choice for them and do not offer alternatives. Any choice you name is a menu of one: it returns only what it already covers, and the thing that decides the answer is the one you did not think of.

Finding a coherent explanation is not the same as finding the one that matters. Do not report a confidence level and do not decide whether you are sure enough to skip this.

If they confirm, address their request. If they correct you, investigate the corrected thing.

## When they come back with a cause or a change

[references/pushback.md](references/pushback.md) is how to weigh their cause or change against your findings. Read it before answering whenever they assert a cause, offer an explanation, or ask for a specific change — every time, including when it seems obvious what to do.
