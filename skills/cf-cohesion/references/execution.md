# cf-cohesion Execution

Execute exactly one behavior-preserving local regrouping.

## Preflight

- Continue from a targeted-evaluation decision admitted by the execution gate, with a confirmed owner cluster, outlier set, shared-file set, and destination.
- If placement is unclear, ask one focused question before editing.

## Execution Rules

- Preserve behavior, public API, exports, side effects, evaluation order, and async behavior.
- Move only the selected cohesive local cluster or subset.
- Choose placement by nearest existing ownership and local convention.
- Prefer a local feature or workflow folder over generic `shared`, `common`, `utils`, `manager`, or new top-level architecture folders.
- In flat type folders, root can remain the implicit common/shared layer.
- Do not leave single-owner files in a broad type folder when a nearer owner is clear.
- Keep broadly reused files outside the local slice.
- Move tests only when repository convention supports colocated tests and the tests belong exclusively to the moved behavior.
- Do not refactor file internals except import/export/path cleanup required by the move.
- After moving code, repeat the reference audit for moved names and paths.
- Apply the report/action separation in references/navigation-cost.md to every qualifying hard trigger.

## Verification

Run the smallest relevant check: targeted tests, typecheck or compile, lint, or a narrow smoke check.
Use native success criteria; do not require `failed=0` unless that is how the runner reports results.
If a relevant check fails, decide whether the regrouping caused it, fix regrouping-caused failures, and re-run the check.
If no relevant check can be run, say that explicitly.

## Output

Use the standard output format.
For **Decision**, report `regrouping performed` only after files moved.
If the evaluation gate stopped the flow before edits, use the targeted-evaluation output instead of this output.
For **Deferred**, after edits use the finding content required by references/navigation-cost.md.
For **Result**, include behavior preservation, final placement, remaining risk, and next action.
