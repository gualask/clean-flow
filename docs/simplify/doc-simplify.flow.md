# cf-simplify Flow

## Purpose

Document the runtime flow for `cf-simplify`, the public simplification review entrypoint for deciding whether complexity is necessary, accidental, or removable by changing behavior, interface contracts, boundaries, or architecture.

## Runtime Inputs

- Public skill: `skills/cf-simplify/SKILL.md`
- Current request, repository files, worktree state, and relevant architecture context when available

## High-Level Flow

1. Start from the area the current request marks as confusing or overbuilt.
2. Ask one focused question if the area is not clear.
3. Inspect only enough evidence to map files, entrypoints, usage, tests, runtime boundaries, and current changes.
4. Identify the requirements, behavior choices, request-stated constraints, and risk appetite that create or justify complexity under Cflow's clean-by-default standard.
5. Classify complexity as required, self-imposed, accidental, or unknown.
6. For shared models, barrels, or cross-boundary representations, map domain ownership, representation roles, and organizing axis before proposing target folders.
7. Group files by necessity rather than folder.
8. Recommend the simplification lever with the best cleanup return, separating clean target shape from safe migration route and behavior-preserving cleanup from behavior-changing simplification.
9. Stop at one decision question when implementation depends on a product, interface, behavior, or scope choice.
