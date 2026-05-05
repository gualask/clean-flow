# Reference Audit

Use this reference after moving, renaming, splitting, merging, removing, or re-exporting files or symbols.

Run separate searches for the categories that apply instead of relying on one broad search:

- direct calls and type references
- old file paths
- old symbol names
- string literals containing old names or paths
- dynamic imports and `require()` paths
- re-exports and barrel files
- tests, fixtures, mocks, and helpers

Use repository-native search tools and respect generated, vendored, or ignored directories.
Fix stale references in the touched scope.
If a stale reference is intentionally left alone, report why in the final output.
