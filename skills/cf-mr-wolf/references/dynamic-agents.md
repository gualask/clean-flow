# cf-mr-wolf Dynamic Agents

## Binding

- Every dynamic agent must execute the same active reference task the controller would otherwise run locally.
- Pass the active reference as the task contract; do not create a separate agent-only task, input contract, or output schema.
- Apply only the common execution rules below from here.
- Do not apply this file to packaged custom agents such as `cflow_finding_derisk_recon`; use their agent-bound references instead.

## Prompt Contract

- Build a fresh prompt from the active reference, current problem frame, bounded context, explicit exclusions, notes path or summary, and exact evidence question.
- Do not invent a broader task or new instructions beyond the active reference and current request.
- Require a read-only report; dynamic agents do not edit repository files, update `.cflow` artifacts, or choose the final route.
- Require source-level evidence for claims, material unknowns, and report sections that map back to the active reference and notes sections.

## Model Guidance

- Use `gpt-5.4-mini` medium for mechanical inventory, file classification, straightforward source gathering, or repetitive checks with clear criteria.
- Use `gpt-5.5` high for architecture, product, UX, multi-area judgment, ambiguous diagnosis, or false-positive evaluation.
- When unsure whether the task is mechanical or judgment-heavy, choose the higher-reasoning model only if the answer can change routing, risk, or final recommendation.

## Report Hygiene

- Keep the report compact and bounded to the assigned question.
- Separate evidence, candidate findings, non-issues, and unknowns.
- The controller owns note updates, final judgment, and user-facing output.
