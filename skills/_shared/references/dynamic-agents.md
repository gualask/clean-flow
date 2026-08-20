# Dynamic Agents

Use dynamic agents only when they are available, allowed, and selected by the deterministic context gate below. Keep every delegated role terminal and read-only.

## Context Gate

Resolve the active skill's existing-file corpus before reading it in full. Run the installed-local `scripts/repo-tree.mjs --help`, then call it with `--context-budget` and one `--include` for every selected file or owned directory. Never measure the whole repository when the active scope is narrower.

Treat the script's `policy` as authoritative:

- `local`: keep the pass local and do not ask about agents.
- `subagent-1`: use one agent when consent allows it.
- `subagent-2`: use two non-overlapping assignments under the Agent Contract when consent allows it.
- `batched`: do not load or delegate the corpus as one pass; cover it in non-overlapping batches.

Do not estimate the band, substitute semantic complexity, or override the count because the task feels easy or hard. An explicit user instruction to use or avoid a specific number of agents wins. If the helper is unavailable or cannot measure every selected path, report the measurement failure and ask whether to continue locally or with user-selected delegation; never guess silently.
