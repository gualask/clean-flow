# cf-mr-wolf Evaluation

Return a value verdict on whether something should exist, be built, kept, exposed, or removed.
This pass answers "should it exist", not "how to do it": route method questions to the planning flow, judgments about code structure or overengineering to `cf-simplify`, and "judge why this fails" error analysis to the framing workflow's diagnostic lens.

## Ground the Verdict

- State the evaluation target and the judgment type needed: value, risk, or trade-off.
- Snapshot current state before opining: what it does, who uses it, what depends on it. Read the relevant code, docs, or usage evidence first.
- Base reasons on the requester's actual constraints — time, maintenance cost, goals, risk appetite — not generic trade-offs.
- If the criticized behavior is documented in project instructions or docs as a deliberate choice, the default verdict is Keep, with one sentence on why the differentiation matters and a note that the owner can override.

## Verdict

- Line 1: **Kill**, **Keep**, or **Pivot**. No preamble, no option menu, no build-plan template.
- Then exactly three reasons grounded in the evidence and the requester's constraints.
- **Pivot**: list specific actionable directions, one per line.
- **Kill** or major rework: list impact scope — files, dependents, migration cost — before asking for confirmation.
- Take a position and state what evidence would change it. Do not fake balance or answer with "it depends".
