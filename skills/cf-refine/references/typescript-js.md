# TypeScript / JavaScript Refine Cues

Use this reference when the touched area is TypeScript or JavaScript code and the refine pass changes module shape, imports or exports, naming, or local helper layout.

## Good refine moves

- Clarify the local module surface without redesigning package boundaries.
- Remove dead local re-exports, pass-through wrappers, or obvious import noise when the impact stays local.
- Prefer local helper extraction over new shared utility files.
- Keep type-only versus runtime imports clear when that matches existing repository style.
- Tighten names so value transformations, DTO mapping, parsing, or side effects are explicit.
- Keep alias or barrel cleanup local to the touched area.

## Escalate instead

- Cross-feature barrel strategy or path-alias redesign.
- Broad public API churn across many modules.
- New shared utility buckets such as `common`, `helper`, or `utils`.
- Type-model redesign that changes contracts across multiple areas.
- Changes that need work-unit ordering rather than one local pass.

## Check hints

- Prefer the smallest relevant test, lint, or typecheck already used in the repository.
- If no targeted command exists, use the lightest repository check that still covers the touched area.
