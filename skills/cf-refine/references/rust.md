# Rust Refine Cues

Use this reference when the touched area contains Rust modules, traits, ownership-heavy helpers, error flow, or async task code.

## Good refine moves

- Rename functions, types, and variables so ownership and role are easier to read.
- Extract a small local helper only when borrow and lifetime implications stay obvious.
- Keep visibility tight and prefer local cleanup over new module layers.
- Flatten noisy `match` or `if let` nesting when error flow becomes clearer.
- Prefer local enums, helpers, or functions over new trait hierarchies for a one-pass cleanup.

## Escalate instead

- New crate or module layout.
- Trait or object-model redesign.
- Ownership-model changes that propagate through many call sites.
- Async runtime, channel, or error-model changes beyond one local area.
- Broader refactor planning is needed to prove the direction safely.

## Check hints

- Prefer the smallest relevant `cargo test` target already used by the repository.
- Use `clippy` or other linting only when the repository already relies on it for this area.
