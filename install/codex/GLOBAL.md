# Managing Global Cflow For Codex

## Goal

Manage the global `clean-flow` installation without using `npx`.

Support these actions:

- sync globally, for both first install and later updates
- sync an exact Git tag to upgrade or downgrade
- uninstall globally

Global sync installs or updates Cflow skills into `$HOME/.agents/skills`.
It also removes Cflow-owned skill directories from the former `$CODEX_HOME/skills` or `~/.codex/skills` destination while preserving foreign entries.

## Prerequisites

- `git` available
- `node` available

## Step 1: Temporary Clone Model

Each action below uses its own temporary shallow clone of this repository and removes it automatically at shell exit.

## Step 2: Choose The Action

### Sync Globally

Use this when the user explicitly asked to install, sync, or update Cflow globally.
If the user named an exact Git tag, assign it to `CFLOW_TAG`; otherwise leave `CFLOW_TAG` empty to install the latest checkout.

```bash
TMP_ROOT="$(mktemp -d)"
PACK_ROOT="$TMP_ROOT/clean-flow"
CFLOW_TAG="${CFLOW_TAG:-}"

cleanup() {
  rm -rf "$TMP_ROOT"
}

trap cleanup EXIT

git clone --depth 1 https://github.com/gualask/clean-flow.git "$PACK_ROOT"
if [ -n "$CFLOW_TAG" ]; then
  node "$PACK_ROOT/bin/cflow-skills.mjs" install --global --tag "$CFLOW_TAG"
else
  node "$PACK_ROOT/bin/cflow-skills.mjs" install --global
fi
```

### Uninstall Globally

```bash
TMP_ROOT="$(mktemp -d)"
PACK_ROOT="$TMP_ROOT/clean-flow"

cleanup() {
  rm -rf "$TMP_ROOT"
}

trap cleanup EXIT

git clone --depth 1 https://github.com/gualask/clean-flow.git "$PACK_ROOT"
node "$PACK_ROOT/bin/cflow-skills.mjs" remove --global
```
