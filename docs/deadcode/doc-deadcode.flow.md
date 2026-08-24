# cf-deadcode Flow

## Purpose

Document the runtime flow for `cf-deadcode`, the public entrypoint for reporting which code is unreachable when the request asks whether something is unused, dead, or deletable. Runtime behavior belongs to `skills/cf-deadcode/SKILL.md`; keep this file descriptive, not authoritative.

## Runtime Inputs

- Public skill: `skills/cf-deadcode/SKILL.md`
- Runtime references: none
- Target artifacts: none — the skill reports and never removes code

## High-Level Flow

1. Answer the reachability question the request actually asked.
2. Close the pass with the output table: one row per name that crosses a boundary as a string, with the consumer and the producer each located as `file:line`.
3. Fill every cell by reading the source, not by trusting a tool's verdict.
4. Report an empty producer cell, or an empty consumer cell, as a finding.

## Maintainer Notes

- **The whole skill is one output slot.** Eleven non-empty lines, no prose rules, no list of causes, no procedure. Anything added is a different intervention and invalidates the measurement below.
- **What it buys, measured 2026-08-24 on `gpt-5.6-luna` at `max`, three cells, 18 runs, zero false positives** (`.local-trials/pins/scenario75/`, `76/`, `77/`):

  | Cell | Boundary | Bare | With the slot |
  | --- | --- | :---: | :---: |
  | fyler @ `cb8a7ad` | Tauri `invoke` / `emit` | `F` 3/3 | `T` 3/3 |
  | termetrix @ `3c5df46` | webview `postMessage`, discriminated union | `F` 3/3 | `T` 3/3 |
  | linqode @ `1422228` | none inside the repository | level | level |

- **The bare arm holds more evidence, not less.** On fyler a control chased knip down into the pnpm store and got 40 unused files to arbitrate; on termetrix knip ran clean and was believed. The treated arms barely touched the tool. The slot does not add evidence — it moves the question from "is this module reachable from an import" to "who produces this name".
- **Where there is nothing to pair it is harmless and pointless.** On linqode both arms converge, and no run ever called a keystroke, a log level, or a container state dead. The richest single answer in that cell is a bare one.
- **The known cost is table drift.** 13 to 53 rows on the same repository; on termetrix 55–67% of rows were settings keys, command ids, and build filenames. Correct, paired, and not runtime boundaries. Do not fix this by narrowing the row: `docs/golden-rules.md` records that a declared perimeter becomes a promise and gets narrowed, and the file-count line removed for exactly that reason.
- **The `description` routes on its own, measured 2026-08-24** (`.local-trials/pins/scenario79/`, `80/`). With no activation line and all twelve skills installed, the dead-code request opens `cf-deadcode` and nothing else 3 of 3, and a vague tidy-up request opens `cf-mr-wolf` and nothing else 3 of 3, with the words for dead code appearing in none of those three answers. So the forced activation the other beds used was buying nothing. What is still unmeasured is how often it fires in a long real conversation — two prompts are not a distribution — and the negative case tested a VAGUE tidy-up, not a well-posed structural refactor.
- **Two deviations from `docs/golden-rules.md` are deliberate, not oversights.** The row rule carries an example list (`an event, a command, a message type, a job name, a route, a container token`) where the rules prefer role/category language and require a statement that analogous project-specific forms count; the category clause that follows it (`wherever the two sides are held together by convention and not by an import`) carries that weight, and linqode's runs generalized past the list unaided — pairing shell markers and JSON fields nobody listed. And the slot fires on every invocation, which the rules allow only for behavior wanted every time; its own text names an observable predicate, so it is compliant in form, but linqode showed the predicate is loose enough to fill with configuration. Both are kept because closing them means editing measured text.
- **The shipped slot line is English, and was re-measured after the translation.** The 18 runs above ran with an Italian header (`nome | consumatore | produttore`); pack skills are written in English, so translating it edited the one line that does the work. `.local-trials/pins/scenario78/` re-buys scenario76's cell — same pin, same oracle, same prompt — on the shipped bytes and lands `T`, with a separate run archived on the translated-but-still-wrapped intermediate so the two edits are separable. Any further edit to that line needs the same treatment.
