# Node Refine Cues

Use this reference when the touched area contains Node request handlers, services, adapters, config access, CLI commands, jobs, or async orchestration.

## Good refine moves

- Keep handlers and controllers thin inside the current boundary model.
- Extract pure parsing, mapping, or branch helpers locally when it shortens a noisy function.
- Make adapter calls and env or config reads easier to spot in the touched area.
- Linearize async branching or error flow when that improves readability without changing ownership boundaries.
- Stay within the repository's existing service or dependency-wiring pattern.

## Escalate instead

- Introducing a new service layer, IOC pattern, or repository-wide abstraction strategy.
- Moving logic across features, packages, or transport boundaries.
- Redesigning request, job, queue, or CLI pipelines.
- Broad config or env refactors that affect multiple modules.

## Check hints

- Prefer the smallest relevant unit, integration, smoke, lint, or typecheck command already present.
- If I/O paths changed, favor a check that exercises the touched request, command, or job flow.
