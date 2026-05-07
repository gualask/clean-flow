# cf-mr-wolf Evidence

Collect only the evidence needed for the framed scope or active slice.

Prefer compact, high-signal sources:

- MCP code-intelligence tools when available: semantic code search/RAG for concepts and indirect flows, symbol definition for exact names, and file outline for structure
- MCP resources or structured project context when available
- bundled or custom scripts when they can summarize, classify, or measure the codebase more cheaply than manual reads
- bundled `../../_shared/scripts/repo-tree.mjs` when a compact project-structure overview with file, directory, and approximate LOC metrics would help choose the next context slice
- focused system commands such as `rg`, tests, package scripts, language tools, and read-only diagnostics
- specialist skills when they are the right lens
- small temporary `/tmp` scripts only for mechanical classification across many inputs

Use these sources to choose direction and reduce the search space.
Do not treat MCP results, script output, or command output as final proof by themselves; verify decision-relevant conclusions against the relevant source, tests, or runtime evidence.

Record what was checked, what was excluded, and why it matters.

## Candidate Handling

Keep findings in three buckets:

- `confirmed`: enough evidence supports real impact in the requested scope
- `to verify`: plausible but still missing reachability, counter-evidence, scope fit, or fix fit
- `excluded`: looked relevant but evidence showed it is noise or out of scope

Static pattern matches, detector output, style preferences, and process gaps do not become behavioral findings unless evidence shows reachable impact.

When a candidate starts from absence or suspicious shape, check the smallest useful counter-evidence:

- Is the behavior reachable?
- Is it handled by another path, abstraction, generated source, or runtime wiring?
- Does it match the current request's problem class and severity?
- Would the likely fix fit current ownership and behavior?

## Sufficiency

Use a rough confidence estimate only when useful.
Evidence is sufficient when it can support the next decision without a broader scan.
For broad investigations, confidence should stay low until every in-scope slice is done, deferred, blocked, or routed.
