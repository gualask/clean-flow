# Managing Global Cflow For Codex

## Goal

Manage the global `clean-flow` installation without using `npx`.

Support these actions:

- sync globally, for both first install and later updates
- uninstall globally

Global sync installs or updates Cflow skills into `$CODEX_HOME/skills` or `~/.codex/skills`, and Cflow Codex custom agents into `$CODEX_HOME/agents` or `~/.codex/agents`.

## Prerequisites

- `git` available
- `node` available

## Step 1: Temporary Clone Model

Each action below uses its own temporary shallow clone of this repository and removes it automatically at shell exit.

## Step 2: Choose The Action

### Sync Globally

Use this when the user explicitly asked to install, sync, or update Cflow globally.

```bash
TMP_ROOT="$(mktemp -d)"
PACK_ROOT="$TMP_ROOT/clean-flow"

cleanup() {
  rm -rf "$TMP_ROOT"
}

trap cleanup EXIT

git clone --depth 1 https://github.com/gualask/clean-flow.git "$PACK_ROOT"
node "$PACK_ROOT/bin/cflow-skills.mjs" install --global
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
