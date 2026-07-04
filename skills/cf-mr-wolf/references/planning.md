# cf-mr-wolf Planning

Produce a decision-complete plan for framed work: executable by another engineer or agent without re-deciding the direction.
This pass owns generic implementation planning; route repository-level refactor planning to `cf-start`, and stop planning here if the recommended approach turns out to be one.
The output is a plan, not code. Implementation starts only when the current request asks for it.

Give opinions directly: take a position and state what evidence would change it. Do not open with validation of the idea or a survey of ways to think about it.

## Ground the Plan

- If the problem, goal, or constraints are still unconfirmed, run the framing workflow first in this invocation, then return here.
- Use the evidence sources and verification rules in references/evidence.md; quote configuration values, versions, names, and entrypoints from the current repository state, never from memory.
- Before proposing a custom implementation, check for framework built-ins, official patterns, and mature implementations of the same problem. When a proven implementation shapes the recommendation, name what was studied and what was taken from it. An existing official solution is the default recommendation unless a stated reason makes it insufficient here.

## Recommend One Approach

- Give one recommended approach with rationale, effort, risk, and what existing code it builds on.
- Mention one alternative only when the trade-off is genuinely close; always include the minimal credible option.
- If two requirements or sources conflict, name the specific conflict in one sentence and ask which takes precedence. Do not silently pick.

## Attack the Plan

- Name the most fragile assumption explicitly: "This plan assumes X; if X does not hold, Y happens." If the assumption is load-bearing and fragile, deform the design to survive its failure.
- When the plan involves external dependencies, significant load growth, or data migration, also check: graceful degradation if a dependency fails, which step breaks first at 10x volume, and what state a rollback returns to.
- If an attack shatters the approach, discard it and say why. Never present a plan that failed an attack without disclosing the failure.

## Decision-Complete Contract

- No placeholders: TBD, TODO, "implement later", or "similar to step N" mean the plan is not ready.
- Each phase must be independently mergeable: after phase N ships, the system is usable even if N+1 never lands. If the work cannot be staged that way, ship it as one phase and say so.
- Investigation belongs before the plan, not inside it as a first phase.
- List every external dependency the plan needs — tools, services, credentials, permissions — before handoff, not mid-implementation.

## Output

- **Building**: what this is, one short paragraph.
- **Not building**: explicit out-of-scope list.
- **Approach**: chosen direction with rationale, plus the rejected close alternative when one existed.
- **Key decisions**: the few decisions that shape the plan, with reasoning.
- **Risks**: the fragile assumption and any attack the design was deformed to survive.
- **Dependencies**: external tools, services, credentials, and permissions required.
- **Verification**: commands and acceptance checks that prove the plan worked.
- **Rollback**: recovery path for any step that changes external or persistent state.
- **Next step**: route (`cf-start` when the plan became a repository refactor) or await approval.

Record the plan in `.cflow/mr-wolf-notes.md` only when the artifact rules call for durable handoff.
