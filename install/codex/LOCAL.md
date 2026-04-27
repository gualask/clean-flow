# Managing Local Cflow For Codex

## Goal

Manage the `clean-flow` installation for a specific repository without using `npx`.

Support these actions:

- sync into a specific repository, for both first install and later updates
- uninstall from a specific repository

Local sync installs or updates Cflow skills into `.agents/skills` and Cflow Codex custom agents into `.codex/agents`.

## Prerequisites

- `git` available
- `node` available

## Step 1: Temporary Clone Model

Each action below uses its own temporary shallow clone of this repository and removes it automatically at shell exit.

## Step 2: Choose The Action

### Sync Locally

Use this when the user explicitly asked to install, sync, or update only the current repository, unless they gave a different target path.

```bash
TMP_ROOT="$(mktemp -d)"
PACK_ROOT="$TMP_ROOT/clean-flow"
TARGET_REPO="${TARGET_REPO:-$PWD}"

cleanup() {
  rm -rf "$TMP_ROOT"
}

trap cleanup EXIT

git clone --depth 1 https://github.com/gualask/clean-flow.git "$PACK_ROOT"
node "$PACK_ROOT/bin/cflow-skills.mjs" install "$TARGET_REPO"
```

### Uninstall Locally

```bash
TMP_ROOT="$(mktemp -d)"
PACK_ROOT="$TMP_ROOT/clean-flow"
TARGET_REPO="${TARGET_REPO:-$PWD}"

cleanup() {
  rm -rf "$TMP_ROOT"
}

trap cleanup EXIT

git clone --depth 1 https://github.com/gualask/clean-flow.git "$PACK_ROOT"
node "$PACK_ROOT/bin/cflow-skills.mjs" remove "$TARGET_REPO"
```
