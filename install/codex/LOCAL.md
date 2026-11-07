# Migrating Repository Cflow For Codex

Cflow installs as the `cflow` plugin. This moves an installation the old installer made in one repository onto it, or installs the plugin when there is nothing to move. The plugin is installed for the user, not for the repository.

Prerequisites: `git`, `node`, and either `codex` on PATH or the Codex IDE extension (its bundled `codex` is used).

Use the current repository unless the user gave a different path.

```bash
TARGET_REPO="${TARGET_REPO:-$PWD}"
TMP_ROOT="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_ROOT" || printf 'Warning: could not clean temporary checkout: %s\n' "$TMP_ROOT" >&2
}
trap cleanup EXIT

git clone --depth 1 https://github.com/gualask/clean-flow.git "$TMP_ROOT/clean-flow"
node "$TMP_ROOT/clean-flow/bin/cflow-skills.mjs" migrate "$TARGET_REPO"
```

`migrate` installs the Codex plugin first, then removes only the skill directories in `<repo>/.agents/skills` that the old installer wrote. Running it again changes nothing.

Report its output, and tell the user to start a new Codex session.

To uninstall instead: `codex plugin remove cflow@clean-flow`.
