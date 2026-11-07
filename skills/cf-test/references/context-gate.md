# Context Gate

Resolve the active skill's existing-file corpus before reading it in full. Run the installed-local `scripts/repo-tree.mjs --help`, then call it with `--context-budget` and one `--include` for every selected file or owned directory. Never measure the whole repository when the active scope is narrower.

Treat the script's `policy` as authoritative:

- `local`: run the pass over the whole corpus at once.
- `batched`: do not load the corpus as one pass; cover it in non-overlapping batches.

The script's `generated` line lists the lockfiles it left out of the metrics. Keep them out of the corpus too: do not read or batch them.

Do not estimate the band, substitute semantic complexity, or override the policy because the task feels easy or hard. If the helper is unavailable or cannot measure every selected path, report the measurement failure and ask whether to continue in one pass or in batches; never guess silently.
