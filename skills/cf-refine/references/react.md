# React Refine Cues

Use this reference when the touched area contains React components, hooks, providers, effects, local state, or Redux-adjacent code.

## Good refine moves

- Make prop names and component-local helper names reveal intent.
- Flatten obviously noisy control flow inside one component or hook.
- Extract a tiny local helper or local hook only when it shortens one touched area without inventing a new shared abstraction.
- Keep state close to its current owner unless ownership change is strictly local and obvious.
- Align a local area to an already existing Context or Redux pattern when that pattern already exists in the repository.
- Remove dead pass-through JSX or wrapper layers only when the boundary impact is clearly local.

## Escalate instead

- Introducing Redux, a new provider, a new global store, or a new shared context model.
- Moving state ownership across routes, features, or major component boundaries.
- Changing data-loading architecture or cross-feature UI contracts.
- Splitting or consolidating UI boundaries where the right direction is not already obvious.

## Check hints

- Prefer the smallest relevant component test, story-level smoke check, lint, or typecheck already available.
- If effects, async UI, or state transitions changed, favor a check that exercises those paths instead of a generic build alone.
