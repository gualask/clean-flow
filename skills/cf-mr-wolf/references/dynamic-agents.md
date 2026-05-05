# cf-mr-wolf Dynamic Agents

Use dynamic agents only when they are allowed and reduce mechanical work or improve independence.
Do not use them for work that the controller can answer cheaply.

## Contract

- Give the agent the active problem frame, bounded context, explicit exclusions, notes path or compact notes summary, and exact evidence question.
- Require a read-only report with source-level evidence, unknowns, and candidate findings.
- Do not let dynamic agents edit files, update `.cflow` artifacts, choose the final route, or expand the scope.
- The controller owns note updates, final judgment, routing, and user-facing output.

## Model Guidance

- Use a smaller model for mechanical inventory, file classification, or repetitive checks with clear criteria.
- Use a stronger model for architecture, product, UX, ambiguous diagnosis, or false-positive evaluation.
- When the result can change routing or risk, prefer the stronger model.
