# Migrating Global Cflow For Codex

Cflow installs as the `cflow` plugin. This moves a global installation made by the old installer onto it, or installs the plugin when there is nothing to move.

Prerequisites: `git`, `node`, and either `codex` on PATH or the Codex IDE extension (its bundled `codex` is used).

```bash
TMP_ROOT="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_ROOT" || printf 'Warning: could not clean temporary checkout: %s\n' "$TMP_ROOT" >&2
}
trap cleanup EXIT

git clone --depth 1 https://github.com/gualask/clean-flow.git "$TMP_ROOT/clean-flow"
node "$TMP_ROOT/clean-flow/bin/cflow-skills.mjs" migrate --global
```

`migrate` installs the Codex plugin first, then removes only the skill directories in `$HOME/.agents/skills` that the old installer wrote, and the friction logger with its `AGENTS.md` block. Running it again changes nothing.

Report its output, and tell the user to start a new Codex session.

To uninstall instead: `codex plugin remove cflow@clean-flow`.
