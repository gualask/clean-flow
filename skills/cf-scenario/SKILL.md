---
name: cf-scenario
description: 'Decide a named change against the scenarios it touches. Use when the request names both a thing and the change to make to it — remove this, merge these two, keep it as it is — and asks whether it is worth doing or what it would cost elsewhere. A doubt counts when it names both: "these two look almost identical, worth merging?", "this abstraction looks overengineered, can it go?". Do not use when nothing is named to change and the request only asks what currently happens, nor for a repository map or structural inventory.'
---
Use this skill to decide a proposed change against the scenarios it touches, grounded in the repository.
Do not implement, move files, or write patches in this skill.

Keep it lightweight. The goal is not a formal use-case document; the goal is to answer "should we do this, and what does it cost elsewhere?" in a way a human can follow. Explaining current behavior is not the job here: state only as much of it as the decision needs.

## Use When

- A fix, simplification, or behavior change is on the table and it is not clear whether to make it.
- A change has been proposed and its cost across other flows is unknown.
- A recent implementation needs impact validation before it is trusted.
- Two flows look related, and whether they share implementation decides the change.
- Another agent hands over a candidate change for its impact to be weighed.

## Guardrails

- When the change under discussion would alter stored data or its shape, say what happens to the rows that already exist: a field it introduces is absent on every one of them, and that absence is a user-visible behavior of its own.
- When `cf-review` routes a business-alignment candidate, verify the quoted authoritative source, then compare its expected behavior with the changed path's actual behavior. Do not replace the source with product intuition or treat implementation code as the intended rule.
