# cf-mr-wolf Framing

Read when DOT reaches `notes_preflight`, `frame_problem`, `useful_scope_question`, or `ask_scope_question`.

## Notes File

Use `.cflow/mr-wolf-notes.md` for investigation notes.
Create it from `assets/mr-wolf-notes.template.md` when missing.

For every concrete problem:

1. Read existing notes if they exist.
2. Decide whether they still match the current request and repository state.
3. Reuse and update relevant notes.
4. Overwrite stale or unrelated notes with a fresh investigation from the template.

`.cflow/mr-wolf-notes.md` is a compact source of truth for discovery evidence, not an execution plan or refactor backlog.
Format notes for later machine reading: use one finding or candidate per bullet, and do not pack multiple candidates into one long line.
In `evidence tools used`, list only tools and scripts that produced evidence; do not include tools used only to create or update `.cflow/mr-wolf-notes.md`.
Use `Findings` as:

- `confirmed candidates`: evidenced candidates worth carrying forward
- `candidates to verify`: plausible candidates that still need focused checks
- `excluded false positives`: only important false positives that looked relevant but were excluded as noise

Do not list every non-candidate file.
Do not add handoff, next skill, or workflow-decision sections to `.cflow/mr-wolf-notes.md`.

## Operating Loop

Run a small loop until the problem is clear enough to hand off:

- Problem-framing pass: state the current frame in one or two sentences, including the problem, success criteria, constraints, explicit non-goals, and smallest useful context slice.
- Context check: inspect only that slice, separate signal from noise, and expand only when more context can change scope, risk, validation, or the handoff.

Scoping questions are part of problem framing.
Ask exactly one focused scoping question before broad inventory when a clear goal still leaves a large work area and the answer can reduce candidate areas, priority, success criteria, constraints, or validation.
Skip it when the target is already bounded, a cheap narrow pass can identify the slice, or the user explicitly asks to proceed despite the broad scope.
Treat context as noise when it cannot affect problem definition, success criteria, scope, constraints, risk, validation, or implementation handoff.
Do not do whole-repository reconnaissance unless the problem is repo-wide or the first narrow pass proves the scope is broader than expected.
When the problem is genuinely repo-wide or a narrow pass proves broader scope, run broad inventory with deterministic commands or a temporary script unless a single standard command already produces the needed fact.
For code repositories, derive the context slice from the problem:

- documentation restructure: docs, README, install guides, docs tests, and doc references
- public API change: exported types, entrypoints, tests, and caller examples
- refactor request: touched subsystem, call sites, tests, and architecture artifacts if relevant
- bug with clear area: failing path, relevant tests, logs, and local implementation only
