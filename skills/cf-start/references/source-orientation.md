# Source Orientation

Establish current repository structure without creating a stored map:

1. Resolve `scripts/repo-tree.mjs` from the active skill root and run `--help`.
2. Run its gitignore-aware tree with approximate LOC to locate the areas carrying the most weight.
3. Read the few surfaced files needed for the active scope; treat the tree as orientation, not proof.
4. Fall back to ad hoc inventory only when the script cannot run.
5. Verify structural conclusions from source.

Do not persist the tree as a Cflow artifact.
