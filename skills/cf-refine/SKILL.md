---
name: cf-refine
description: Apply one bounded local refinement pass that improves readability, naming, helper shape, imports, or framework-local structure without repo-level planning. Use for low-to-medium-risk cleanup that should stay local; escalate to `cf-start` when the change becomes structural, multi-step, or architecture-shaping.
---
This is a supported public entrypoint for bounded local refinement.
It may edit code directly when the change stays local and proportionate.

## Goal

Apply exactly one bounded local pass that improves readability or local shape without changing intended behavior or reopening architecture.

You must determine:

- whether the request really fits `cf-refine`
- the smallest touched area that can absorb the change cleanly
- whether lightweight checks are enough
- whether safety, review, verify, or broader Cflow planning are needed

## Reference map

Ensure you have read these references in this invocation when their trigger condition is met:

- Ensure you have read [references/typescript-js.md](references/typescript-js.md) before refining TypeScript or JavaScript module surfaces, imports or exports, type boundaries, or helper extraction.
- Ensure you have read [references/react.md](references/react.md) before refining React components, hooks, providers, effects, local state ownership, or Redux-adjacent code.
- Ensure you have read [references/node.md](references/node.md) before refining Node request handlers, services, adapters, config or env access, or async orchestration.
- Ensure you have read [references/rust.md](references/rust.md) before refining Rust modules, traits, ownership-heavy helpers, error flow, or async task code.

## Preflight

1. Re-check the repository around the requested area.
2. Identify an explicit touched area from the prompt, or infer the smallest clear local area from repository evidence.
3. If no clear local area can be named after the repository check, stop and route to `cf-start`.
4. If the task is repo-wide, cross-feature, architecture-shaping, multi-step, or needs work-unit ordering, stop and route to `cf-start`.
5. If the task would introduce a new shared state model, new target shape, new cross-feature abstraction, or broader migration path, stop and route to `cf-start`.
6. Treat the repository as the source of truth.
7. You do not need `.cflow/*` to start this skill.

## Good fit for this skill

- naming cleanup inside one bounded area
- local control-flow cleanup
- small helper extraction, inlining, or call-site cleanup
- import or export cleanup inside the touched area
- local duplication cleanup with obvious behavior preservation
- React, Node, or Rust cleanup that stays inside an existing local boundary
- aligning a local area to an already existing project pattern
- removing dead local wrapper or indirection when the boundary impact is clearly local

## Escalate instead of forcing `cf-refine`

- multiple credible areas need prioritization or sequencing
- the change depends on choosing `split` vs `consolidate`
- package, feature, or ownership boundaries are changing
- the task is really a migration or architecture decision
- Redux or another shared state model would be introduced where it does not already exist
- the task likely needs more than one bounded pass

## Safety and validation rules

- Preserve behavior.
- Keep exactly one bounded pass.
- Prefer local edits in the touched area.
- Prefer renaming, local extraction, local inlining, branch simplification, and import or export cleanup over new abstractions.
- Prefer existing repository patterns over invented style fixes.
- If the edit is behaviorally sensitive, coverage is weak, or the user wants higher confidence before edits, ensure architecture context exists with `cf-architecture-map` and then use `cf-step-safety-net` before risky changes.
- After editing, run at least one lightweight relevant check when one is available.
- If structural judgment is needed after the pass, ensure architecture context exists with `cf-architecture-map` and use `cf-review`.
- If factual evidence is needed after the pass, ensure architecture context exists with `cf-architecture-map` and use `cf-verify`.
- Do not create or refresh `.cflow/refactor-brief.md` from this skill itself.
- If escalation into internal Cflow skills becomes the real work, stop treating this as a pure refine pass.

## Output rules

Provide exactly these sections:

1. **Refine fit**
2. **Changes applied**
3. **Checks run**
4. **Escalations used**
5. **Recommended next action**

When the task does not fit `cf-refine`, say so clearly in `Refine fit`, make no code edits, and route to `cf-start`.
