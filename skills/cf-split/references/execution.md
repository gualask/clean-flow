# cf-split Execution

Execute exactly one cohesive behavior-preserving file-level split.

## Preflight

- Identify one target source file or one explicitly touched local file area.
- If the target file or placement is ambiguous, ask one focused question before editing.
- If the target is an area rather than one file, run bundled `scripts/repo-tree.mjs` (resolve it from the active skill root, never from the project working directory; run `--help` first) and use its gitignore-aware file-name tree to choose the target file before reading implementation.
- Read the whole target file, nearby imports/exports, call sites, tests, and local naming or folder conventions.
- Complete the reference audit for the candidate unit before choosing the seam or placement; treat consumers outside the unit as compatibility evidence.

## Placement Check

After the split, re-check the containing directory once, before the closing audit and verification.
Run bundled `scripts/repo-tree.mjs --mode names --include <containing directory>`, read the real
source files it lists, and evaluate the resulting owner group against the shared placement
guardrails, and settle the final placement here.
When the owner group passes the guardrails but a folder there would change module or package
boundaries, keep the files flat in this pass and record the owner group as a `Deferred` finding
routed to `cf-start`.

## Reference Audit

Once placement is settled, repeat the reference audit for moved names and paths.

## Verification

Run the smallest relevant check: targeted tests, typecheck or compile, lint, or a narrow smoke check.
Use native success criteria; do not require `failed=0` unless that is how the runner reports results.
If a relevant check fails, apply the regression-handling contract loaded for the failed check.
If no relevant check can be run, say that explicitly.

## Output

Use the standard output format.
For **Decision**, report the split performed.
For **Deferred**, after edits use the finding content required by references/navigation-cost.md.
For **Result**, include behavior preservation, final placement decision, remaining risk, and next action.
