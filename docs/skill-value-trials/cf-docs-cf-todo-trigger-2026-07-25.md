# Trigger Trial — cf-docs and cf-todo description rewrite (2026-07-25)

First **trigger** trial in this repository: it measures invocation precision, not outcome quality.
See [trial-method.md](./trial-method.md), section "Related trials", for why the two must not be mixed.

## Question

The friction log for July shows `cf-docs` as the most re-activated skill in the pack (33 distinct
activations) and `cf-todo` fifth (17). The maintainer's report was that both "enter the chat too
often". The rewrite under test narrows both descriptions to write intent: a doc or todo file being
read as a source of information must not activate anything.

The log itself cannot answer this. `install/friction/friction-law.md` records `--skill` when a skill
was *active*, so its counts measure dwell, and an unwanted activation that then executes cleanly
leaves no entry at all.

## Harness

- Host: `opencode` with `zai-coding-plan/glm-5.2`, `--auto`, `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1`.
- Target: `irc-news` pinned at `542302f`, one local clone per arm, `git checkout -- .` between runs.
- `todo.md` seeded identically in both arms and restored before every run.
- Arm `old`: pack materialized from `a2e7f25`. Arm `new`: pack materialized from the working tree.
  Both arms see all ten public skills, so competing routes are a controlled constant.
- Signal: the `Skill "cf-..."` tool call in the run output. No ground truth needed beyond the labels.

## Battery

| id | prompt | expected under the new rule |
| --- | --- | --- |
| R1 | *Leggi docs/architecture.md e spiegami come è organizzato lo stato dell'app.* | no |
| R2 | *Nella documentazione è descritto come funziona il parsing dei titoli?* | no |
| R3 | *Il README è ancora aggiornato rispetto al codice?* | no |
| W1 | *Aggiorna il README aggiungendo una sezione su come lanciare i test.* | yes |
| W2 | *docs/overview.md è troppo verboso, accorcialo.* | yes |
| T1 | *Leggi todo.md e dimmi cosa resta da fare.* | no |
| T2 | *Cosa resta da fare secondo il todo?* | no |
| T3 | *Aggiungi al todo il punto di sistemare il parsing dei titoli.* | yes |
| T4 | *Nel todo spunta la voce già completata e togli quelle già spuntate.* | yes |

## Results

Single run per cell, tool-call count in brackets:

| cell | old | new |
| --- | --- | --- |
| R1 | — (1) | — (1) |
| R2 | — (3) | — (2) |
| R3 | **cf-docs** (18) | — (8) |
| W1 | — (4) | — (10) |
| W2 | — (3) | **cf-docs** (11) |
| T1 | — (2) | — (2) |
| T2 | — (3) | — (3) |
| T3 | — (3) | — (3) |
| T4 | **cf-todo** (5) | **cf-todo** (14) |

Correct cells: old 5/9, new 7/9.

The two decisive cells were then replicated to n=3:

| cell | arm | rep 1 | rep 2 | rep 3 |
| --- | --- | --- | --- | --- |
| R3 | old | cf-docs (18) | cf-docs (23) | cf-docs (18) |
| R3 | new | — (8) | — (11) | — (4) |
| W2 | old | — (3) | cf-docs (8) | cf-docs (9) |
| W2 | new | cf-docs (11) | cf-docs (18) | cf-docs (5) |

## Findings

1. **The false positive is one clause, and removing it removes the behavior.** R3 fires 3/3 in the
   old arm and 0/3 in the new one. `or when docs may be stale` is a predicate over repository state
   rather than over the request, so it matched every assessment-shaped question. It was also the
   most expensive invocation observed: 18-23 tool calls to answer "is the README current?", against
   4-11 when the skill stays out.
2. **The rewrite costs nothing on the write side.** W2 fires 2/3 old and 3/3 new. The single old run
   that did not fire was variance; an early reading of that one cell produced the wrong conclusion
   that write requests never triggered the skill, which the replication overturned.
3. **Consumption reads never triggered anything, in either arm.** R1, R2, T1 and T2 are all — in
   both columns. The reported problem was never the reads; it was the one assessment form.
4. **Two write cells never trigger, in either arm.** W1 and T3 both name the edit to make
   (*"aggiungi una sezione"*, *"aggiungi il punto X"*) and the model performs them directly. The two
   cells that do trigger carry a judgment instead (*"è troppo verboso"*, *"togli quelle già
   spuntate"*). Plausible but unreplicated: n=1 each.
5. **Cost, when a skill enters, comes from its contract.** `new-T4` spent 14 tool calls on checking
   off a todo item, hunting through the Rust parser and sample data, because the skill requires an
   observable done criterion. `old-T4` did the same work in 5. Latency floor of this harness is ~15s
   for a one-shot run, ~6-8s per additional round trip, so the ceremony is what costs, not the host.

## Verdict

The rewrite does what it was asked to do: it removes a reproducible unwanted activation and keeps
the wanted ones. Adopted.

## Limits

- Seven of nine cells are n=1. Only R3 and W2 are replicated.
- Host is `opencode` with GLM 5.2, not Codex. Auto-invocation is host-specific machinery, so this is
  the least transferable kind of trial in this directory. Indicative, never dispositive.
- The provider log was checked for `stream error`: 11 events, all from an earlier parallel batch at
  07:07-07:08Z, none inside this trial's window.
- Host-provided skills (`superpowers` and similar) are present in both arms and compete in both.
