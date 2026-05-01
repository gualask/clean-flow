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
Use available specialist skills as local analysis lenses when they clearly fit the evidence question.
When many files, inputs, or records must be classified, use deterministic commands or a temporary `/tmp` script and inspect the compact result.
Record what was checked and why it matters.
Format notes for later machine reading: use one finding or candidate per bullet, and do not pack multiple candidates into one long line.
In `evidence tools used`, list only tools and scripts that produced evidence; do not include tools used only to create or update `.cflow/mr-wolf-notes.md`.
Use `Findings` as:

- `confirmed candidates`: evidenced candidates worth carrying forward
- `candidates to verify`: plausible candidates that still need focused checks
- `excluded false positives`: only important false positives that looked relevant but were excluded as noise

Do not list every non-candidate file.

## Sufficiency Gate

Use `sufficient` only at 80% confidence or higher.
The percentage estimates confidence that the recorded context and evidence are complete enough to represent the bounded problem without a broader scan.
For repo-wide, multi-file, or multi-candidate investigations, keep confidence below 80% unless the evidence includes:

- context collection recorded in `.cflow/mr-wolf-notes.md`
- broad inventory from commands, MCP, repo tree output, or a temporary script when the search space is large
- focused evidence collection for the strongest candidates or representative clusters
- notes for used channels, important skipped high-value channels, agent reports, and no-agent reasons

Below 80%, mark evidence as insufficient and report the missing evidence plus the smallest useful next context slice or focused question.
