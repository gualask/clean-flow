# Execution Flow

Execute exactly one cohesive behavior-preserving file-level split.

## Preflight

- If the target is an area rather than one file, list the area's files and use them to choose the target file before reading implementation.
- Read the whole target file, nearby imports/exports, call sites, tests, and local naming or folder conventions.
- Complete the reference audit for each candidate before choosing the one to extract.

## Placement Check

After the split, before the closing audit and verification, count the containing directory and read its real source files, then settle the final placement with the post-split re-check in references/file-split-rules.md.

## Tests Follow The Code

Once placement is settled, move the tests that cover each extracted unit into a test file next to its new file, following the repository's test naming. Leave in the original test file only the tests of code that stayed.

## Reference Audit

Once placement is settled, repeat the reference audit for moved names and paths, including moved tests.

## Verification

Run the smallest relevant check: targeted tests, typecheck or compile, lint, or a narrow smoke check.
Then run the test files that now cover the moved code (see Tests Follow The Code) with the repository's test runner. In **Checks**, report that command and its result, or `tests not run` with the reason.
Use native success criteria; do not require `failed=0` unless that is how the runner reports results.
If a relevant check fails, apply the regression-handling contract loaded for the failed check.

## Output

Use the standard output format.
For **Decision**, report the split performed: each new file with the test file that now covers it, or `no tests`.
For **Deferred**, after edits use the finding content required by references/navigation-cost.md; include an owner cluster kept flat for module or package boundaries, and report each function past 20 logical lines in a file the split modified as a finding routed to `cf-cognitive`, which decides whether anything moves.
For **Result**, include behavior preservation, final placement decision, remaining risk, and next action. Claim behavior preservation only when that test command passed; otherwise say it is not verified by tests.
