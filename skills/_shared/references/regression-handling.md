# Regression Handling

Apply when a safety lock, targeted test, or relevant check breaks during a behavior-preserving edit, or when previously working behavior is reported broken after this work.

## Root-Cause Gate

Do not edit code again until the cause is stated in one testable sentence:

> The root cause is [specific file, function, line, or condition] because [evidence].

"A state issue" is not testable. If the sentence cannot name a concrete location or condition, there is no hypothesis yet: re-read the exact diff of the current unit, the failing output verbatim, and the execution path from entry point to failure.

## One Probe Per Hypothesis

Run the one check that would fail if the hypothesis were wrong, then read the result.
If the evidence contradicts the hypothesis, discard it completely; do not stack a fix onto a disproven explanation.
The same symptom after a fix means the hypothesis was wrong: re-read the execution path from scratch instead of patching again.

## Hard Stop After Three Hypotheses

After three disproven hypotheses, stop editing and report:

- **Symptom**: one sentence.
- **Hypotheses tested**: each with the probe used and why it was ruled out.
- **Ruled out** and **Unknowns**.
- **Recommended next step**: revert the unit, narrow it, or gather named missing evidence.

Reverting the current unit and re-planning is a valid outcome, not a failure.

## Scope Blast After the Fix

Before declaring the regression closed, extract the signature of the fixed pattern — function name, call shape, import, selector, or input boundary — and search the repository for the same shape, excluding generated output and vendored dependencies.
Classify every match in writing: same bug (fix it when it belongs to the current unit), safe (say why), or unsure (surface it).
Matches outside the current unit become recorded follow-up, not silent fixes.
Do not skip a match without classifying it.
