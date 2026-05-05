# Artifact Reference

## Brief Write Rules

This reference only defines how to write `.cflow/refactor-brief.md` after the active phase has decided that durable state must change.

When creating or updating the refactor brief:

- create the file from `assets/refactor-brief.template.md` only when it is missing
- update an existing file in place instead of re-copying the template
- update the phase-specific fields named by the active phase
- preserve unrelated existing fields unless repository evidence proves they are stale
- keep user decisions, constraints, exclusions, and open unknowns explicit

## Execution State

- Keep `current work unit` as the active selected unit only.
- Use `current work unit: none` at a safe stopping point with no next unit selected.
- Set `recommended next work unit` whenever the near-term next unit is known but not yet active or completed.
- Never finish planning with both `current work unit` and `recommended next work unit` unset.
