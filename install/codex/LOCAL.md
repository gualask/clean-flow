# Managing Local Cflow For Codex

## Goal

Manage the `clean-flow` installation for a specific repository without using `npx`.

Support these actions:

- install into a specific repository
- update into a specific repository
- uninstall from a specific repository

## Prerequisites

- `git` available
- `node` available

## Step 1: Temporary Clone Model

Each action below uses its own temporary shallow clone of this repository and removes it automatically at shell exit.

## Step 2: Choose The Action

### Install Or Update Locally

Use this when the user explicitly asked to install or update only the current repository, unless they gave a different target path.

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
