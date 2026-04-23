# Managing Global Cflow For Codex

## Goal

Manage the global `clean-flow` installation without using `npx`.

Support these actions:

- install globally
- update globally
- uninstall globally

## Prerequisites

- `git` available
- `node` available

## Step 1: Temporary Clone Model

Each action below uses its own temporary shallow clone of this repository and removes it automatically at shell exit.

## Step 2: Choose The Action

### Install Or Update Globally

Use this when the user explicitly asked for a global install or global update.

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
