# cf-mr-wolf Evidence

## Context Collection

Collect only the context needed to answer the clarified request inside the bounded perimeter.
Use high-value channels before model-only inspection:

- MCP resources or tools for external systems, repository metadata, tickets, docs, or structured sources
- system commands such as `rg`, test runners, package scripts, language tools, and format or schema checks in read-only or diagnostic mode
- bundled `../../_shared/scripts/repo-tree.mjs`; run it with `--help` first when a gitignore-aware repository tree may reduce broad context before selecting files
- temporary `/tmp` scripts for mechanical work across many inputs
- available skills that can guide context selection or evidence gathering

Use those channels when they reduce mechanical work or context size.
After context collection, update the notes `Context` section with perimeter, sources checked, relevant context, excluded noise, useful tools or skills, and remaining unknowns.

## Evidence Collection

Evidence collection starts from `.cflow/mr-wolf-notes.md`.
If `Work decomposition` selected a slice map, collect evidence for the selected slice or explicitly recorded slice group, not for the whole broad request at once.
When a slice map exists, each evidence pass must name the active slice id, update only that slice's evidence and findings, and leave unrelated slices as `pending`, `deferred`, `blocked`, `out-of-scope`, or `routed`.
Each evidence pass must label its evidence class: `behavioral`, `static-signal`, `detector`, `process`, or `mixed`.
Do not merge `static-signal`, `detector`, or `process` evidence into behavioral findings unless the pass explicitly checks the behavioral impact.
Use available specialist skills as local analysis lenses when they clearly fit the evidence question.
When many files, inputs, or records must be classified, use deterministic commands or a temporary `/tmp` script and inspect the compact result.
Record what was checked and why it matters.
Format notes for later machine reading: use one finding or candidate per bullet, and do not pack multiple candidates into one long line.
In `evidence tools used`, list only tools and scripts that produced evidence; do not include tools used only to create or update `.cflow/mr-wolf-notes.md`.

Before adding a candidate to `confirmed candidates`, record why it could affect real behavior in the stated problem frame.
Static pattern matches stay in `candidates to verify` until de-risk proves reachability and fix-fit.
Detector output, lint/static-rule matches, style preferences, and process gaps stay labeled as detector/static/process observations unless de-risk proves they create a user-visible or requested-scope defect.
When a candidate starts from absence or suspicious shape in one place, look for the smallest relevant counter-evidence before ranking it:

- Is the affected behavior actually reachable?
- Is the missing or suspicious behavior provided through another path, abstraction, generated source, or runtime wiring?
- Does the candidate match the requested problem class, or is it a process, preference, or out-of-scope observation?
- Would the likely fix fit current ownership, invariants, and user-visible behavior?

Use `Findings` as:

- `confirmed candidates`: evidenced candidates worth carrying forward, labeled with slice id and evidence class
- `candidates to verify`: plausible candidates that still need focused checks
- `excluded false positives`: only important false positives that looked relevant but were excluded as noise

Do not list every non-candidate file.

## Sufficiency Gate

Use `sufficient` only at 80% confidence or higher.
The percentage estimates confidence that the recorded context and evidence are complete enough to represent the bounded problem without a broader scan.
For repo-wide, multi-file, or multi-candidate investigations, keep confidence below 80% unless the evidence includes:

- context collection recorded in `.cflow/mr-wolf-notes.md`
- completed or explicitly deferred/blocked/routed status for every in-scope slice when a slice map exists
- broad inventory from commands, MCP, repo tree output, or a temporary script when the search space is large
- focused evidence collection for the strongest candidates or representative clusters
- notes for used channels, important skipped high-value channels, agent reports, and no-agent reasons

Below 80%, mark evidence as insufficient and report the missing evidence plus the smallest useful next context slice or focused question.
