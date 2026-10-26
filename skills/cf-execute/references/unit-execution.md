# Unit Execution

Execute the accepted unit and nothing else.

1. Before editing, lock the behavior the unit must preserve: run the tests that cover its touched scope; where nothing covers what the unit moves or changes, first add characterization tests of the current behavior and run them. A `feature` unit also adds tests for the behavior it introduces.
2. Make the change the unit and the spec describe. Do not start another unit's work. When the code contradicts the plan or the spec, record it in `Decision notes` and ask.
3. If a lock or a check breaks, read references/regression-handling.md before any further edit.
4. If files or symbols were moved, renamed, merged, removed, or re-exported, read references/reference-audit.md and fix every stale reference it finds.
5. Before marking the unit `done`, run the repository's full check command: the `test` script or the command its CI runs. A unit whose full check fails stays `active`; record the failure in `Verification`.
6. Update the plan through artifacts.md: unit status, `Safety net`, `Verification`, and `Decision notes` for drift.

## Output Format

Return only:

- **Changes**: files changed and what the unit moved or added.
- **Checks**: commands run before and after the edit, with results, the full check included.
- **Result**: the unit's status, `done` or `active` with the reason, and the next action.
