# Reference Audit

Scope: files or symbols considered for or affected by a move, rename, split, merge, removal, or re-export.

Run separate repository-wide searches for the categories that apply instead of relying on one broad search or limiting the audit to a source directory:

- direct calls and type references
- old file paths
- old symbol names
- string literals containing old names or paths
- dynamic imports and `require()` paths
- re-exports and barrel files
- tests, fixtures, mocks, and helpers
- configuration, manifests, scripts, and templates
- documentation and examples that name changed paths, symbols, commands, or behavior

Use repository-native search tools and respect generated, vendored, dependency, build-output, and ignored directories.
Treat consumers outside the candidate unit as compatibility evidence.
When the active pass is read-only, report each surviving stale reference and do not modify it.
When the current request authorizes edits, fix every repository-controlled reference made stale by the change; if one is intentionally left alone, report why in the final output.
