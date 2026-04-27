# cf-cohesion Discovery

Do discovery only. Do not edit files.

## Goal

Find likely cross-file cohesion candidates without turning the whole repository into a refactor hunt.

## Preflight

- If the repository is large or unfamiliar, consider bundled `../../_shared/scripts/repo-tree.mjs`; run it with `--help` first when a gitignore-aware file-name tree may reduce context before selecting candidate areas.
- Use repository-native search to identify repeated feature/workflow vocabulary across nearby folders.
- Read only enough local context to validate the strongest candidates.

## Discovery Rules

- Produce at most three candidates.
- Prefer candidates with four or more related files for one local behavior.
- Prefer clusters crossing type folders such as components, hooks, reducers, actions, tests, adapters, or helpers.
- Treat nearby existing feature folders as strong placement precedent.
- Exclude broad shared utilities, generic framework glue, generated files, vendored files, build outputs, and dependency directories.
- Do not recommend regrouping when evidence is only similar filenames.
- Stop with `none` when no credible local cluster is visible.

## Output

Use the standard output format.
For **Checks**, say `not run; discovery only` unless a read-only diagnostic command was useful enough to report.
For **Result**, name the best next targeted evaluation candidate or `none`.
