# cf-cohesion Execution

Execute exactly one behavior-preserving local regrouping.

## Preflight

- If no targeted evaluation was done in this invocation, perform the targeted evaluation steps first.
- Continue only when the owner cluster, outliers, shared files, and destination are clear.
- If placement is unclear, ask one focused question before editing.

## Execution Rules

- Preserve behavior, public API, exports, side effects, evaluation order, and async behavior.
- Move only the selected cohesive local cluster or subset.
- Choose placement by nearest existing ownership and local convention.
- Prefer a local feature or workflow folder over generic `shared`, `common`, `utils`, `manager`, or new top-level architecture folders.
- Keep broadly reused files outside the local slice.
- Move tests only when repository convention supports colocated tests and the tests belong exclusively to the moved behavior.
- Do not refactor file internals except import/export/path cleanup required by the move.
- After moving code, ensure you have read [../../_shared/references/reference-audit.md](../../_shared/references/reference-audit.md) in this invocation, then audit moved names and paths.

## Verification

Run the smallest relevant check: targeted tests, typecheck or compile, lint, or a narrow smoke check.
If a relevant check fails, decide whether the regrouping caused it, fix regrouping-caused failures, and re-run the check.
If no relevant check can be run, say that explicitly.

## Output

Use the standard output format.
For **Decision**, report `regrouping performed`.
For **Result**, include behavior preservation, final placement, remaining risk, and next action.
