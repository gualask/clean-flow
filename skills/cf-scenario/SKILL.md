---
name: cf-scenario
description: Ground, validate, or explain a bug, code change, architectural concern, or behavior through concrete code-grounded scenarios. Use when the request needs real impact understood across direct and indirect flows, especially before a fix or after an implementation. Route reconstructing or auditing an execution path to cf-trace, and deciding what to do about the impact — approach, alternatives, worth — to cf-mr-wolf.
---
Use this skill to make technical behavior concrete through scenarios grounded in the repository.
Do not implement, move files, or write patches in this skill.

Keep it lightweight. The goal is not a formal use-case document; the goal is to answer "what actually happens?" in a way a human can follow.

## Use When

- The user asks what happens in a specific case.
- A bug, risk, or unclear behavior needs framing before deciding the fix.
- A recent implementation needs impact validation.
- Similar flows may look related but could use different code paths.
- Another agent needs to make an abstract concern easier to reason about.

## Guardrails

- Inspect the relevant code paths before drawing conclusions.
- Do not invent scenarios from product intuition alone.
- When two flows look similar, verify whether they actually share implementation.
- When validating a suspected bug or fix, identify the nearest relevant boundary to check: similar flow, shared component, caller, protocol/contract, persisted state, event, or user-visible behavior.
- Do not stop at the impacted path; explain what specific nearby flow or boundary should stay unchanged, is not impacted, or remains uncertain.
- When the boundary depends on an external protocol, standard, API contract, or documented behavior, verify the relevant primary source before treating the scenario as confirmed.
- Say what the user, caller, UI, CLI, database, event bus, job, or external system observes.
- Keep the answer focused on the scenario the user asked about.
- Distinguish verified behavior from inference when the code does not fully prove the conclusion.

## Output Style

Prefer a human walkthrough over a formal template.
Use short causal chains when helpful:

```text
trigger -> component/function -> state/event/error -> visible result
```

Default shape:

- State what you checked and why, especially when comparing similar paths.
- Walk through each relevant path in plain language.
- Call out paths that are not impacted because they use a different mechanism.
- End with the practical conclusion.

Avoid rigid headings like actor, preconditions, expected behavior, and failure mode unless the user explicitly asks for formal use cases.
Do not enumerate every possible scenario unless asked.
