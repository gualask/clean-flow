# Managing Global Cflow For Codex

## Goal

Manage the global `clean-flow` installation without using `npx`.

Support these actions:

- sync globally, for both first install and later updates
- sync an exact Git tag to upgrade or downgrade
- enable or disable the optional friction log during sync
- uninstall globally

Global sync installs or updates Cflow skills into `$HOME/.agents/skills`.

## Prerequisites

- `git` available
- `node` available

## Step 1: Temporary Clone Model

Each action below uses its own temporary shallow clone of this repository and attempts to remove it at shell exit. Cleanup failures emit a warning without changing the command result.

## Step 2: Choose The Action

### Sync Globally

Use this when the user explicitly asked to install, sync, or update Cflow globally.
If the user named an exact Git tag, assign it to `CFLOW_TAG`; otherwise leave `CFLOW_TAG` empty to install the latest checkout.
The optional logger is installed under `$HOME/.agents/cflow` (or `$CFLOW_HOME`); see [Friction Log](../../docs/friction-log.md) for log locations.
Set `CFLOW_FRICTION=1` only when the user explicitly asked to enable or keep the friction log. Omitting `--friction` is declarative and removes a previous friction integration while preserving accumulated logs.

```bash
TMP_ROOT="$(mktemp -d)"
PACK_ROOT="$TMP_ROOT/clean-flow"
CFLOW_TAG="${CFLOW_TAG:-}"
CFLOW_FRICTION="${CFLOW_FRICTION:-}"

cleanup() {
  rm -rf "$TMP_ROOT" || printf 'Warning: could not clean temporary checkout: %s\n' "$TMP_ROOT" >&2
}

trap cleanup EXIT

git clone --depth 1 https://github.com/gualask/clean-flow.git "$PACK_ROOT"
INSTALL_ARGS=(install --global)
if [ -n "$CFLOW_TAG" ]; then
  INSTALL_ARGS+=(--tag "$CFLOW_TAG")
fi
if [ "$CFLOW_FRICTION" = "1" ]; then
  INSTALL_ARGS+=(--friction)
fi
node "$PACK_ROOT/bin/cflow-skills.mjs" "${INSTALL_ARGS[@]}"
```

### Uninstall Globally

```bash
TMP_ROOT="$(mktemp -d)"
PACK_ROOT="$TMP_ROOT/clean-flow"

cleanup() {
  rm -rf "$TMP_ROOT" || printf 'Warning: could not clean temporary checkout: %s\n' "$TMP_ROOT" >&2
}

trap cleanup EXIT

git clone --depth 1 https://github.com/gualask/clean-flow.git "$PACK_ROOT"
node "$PACK_ROOT/bin/cflow-skills.mjs" remove --global
```
