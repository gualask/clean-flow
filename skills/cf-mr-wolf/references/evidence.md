# cf-mr-wolf Evidence

Read when DOT reaches `bounded_analysis`, `sufficiency`, or `next_context_or_question`.

## Evidence Channels

Before declaring context sufficient, record the evidence channels used for bounded analysis in `.cflow/mr-wolf-notes.md`; if an important non-specialist high-value channel is skipped, record why.
High-value channels are:

- MCP resources or tools for external systems, repository metadata, tickets, docs, or structured sources
- system commands such as `rg`, test runners, package scripts, language tools, and format or schema checks in read-only or diagnostic mode
- bundled `../../_shared/scripts/repo-tree.mjs`; run it with `--help` first when a gitignore-aware repository tree may reduce broad context before selecting files
- temporary `/tmp` scripts for mechanical work across many inputs
- specialist skills that clearly match the bounded problem, delegated through a dynamic read-only specialist agent

When MCP tools are available and the question depends on code structure, symbols, semantic relationships, repository metadata, tickets, or docs, use a relevant MCP tool unless a narrower non-MCP source is clearly enough; record the reason when MCP is skipped.
After the frame or candidate area is bounded, check available skill names/descriptions; if one clearly matches, use [agents.md](agents.md) to delegate a bounded read-only specialist analysis, then record the specialist report or why no skill matched.

## Sufficiency Gate

Use `sufficient` only at 80% confidence or higher.
The percentage estimates confidence that the problem frame and candidate set are good enough for the next decision, not confidence that an implementation will succeed.
For repo-wide, multi-file, or multi-candidate investigations, keep confidence below 80% unless the evidence includes:

- broad inventory from commands or a temporary script to find likely search space and obvious noise
- narrowing pass with focused verification of the strongest candidates or representative clusters
- finding de-risk checks for candidate findings before recommending a fix or completed handoff
- notes for used evidence channels, important skipped non-specialist high-value channels, and specialist agent reports or no-match reasons

Below 80%, continue the operating loop or ask one focused question.
If a user asks to proceed below 80%, state the remaining uncertainty in the handoff.
