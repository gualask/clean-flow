# Batched Execution

Read this when the context gate returns `batched`.

Batching changes source loading, never the logical scope. Use it only when the consuming skill requires a complete corpus pass; otherwise ask for a narrower evidence scope.

- Preserve the resolved path order and build non-overlapping file batches that each remeasure `local`. If one file alone exceeds that band, report that it cannot be safely batched and ask the user how to proceed instead of guessing.
- Read one batch at a time against the complete path-only scope manifest, all consuming lenses, relevant authoritative sources, and explicit exclusions. Other batches are unavailable source content, not excluded logical scope.
- Close every batch with one compact report containing its complete lens ledger, candidates with cited evidence, references to other manifest paths that need cross-batch reconciliation, and unknowns. Append it to the recap file before reading the next batch; create no other repository or temporary artifact.
- After the last batch, reconcile cross-batch references, verify cited evidence, merge one complete ledger, and route or report only once. A missing batch report or unresolved cross-batch check cannot produce a clear result.

## Recap File

The batched pass produces one recap file, and it is a deliverable rather than a scratch note: you and the user read it together to decide what to do next. A long pass loses its early context, so the recap is the memory, not the conversation. It holds one entry per candidate finding, written as the final output shows it. The findings still in the file are what is left to do; when none remain the pass is done, whatever headings or per-batch bookkeeping the file still carries.

- The consuming skill owns its own recap at the path its Artifacts contract names.
- Before creating it, create `.cflow/` if needed and write `.cflow/.gitignore` containing a single `*` line if missing; never edit the repository `.gitignore`.
- Each batching skill has its own recap and writes no other skill's. If this skill's recap already exists, its entries are outstanding work from an earlier pass: stop and ask whether to work through them or to replace the file with this pass's findings; never overwrite it silently.
- Reconcile and report from the file, not from memory.
- Name the file in the final output and leave it in place. It is the one repository write the pass may make.

**Working through a recap.** Do not re-read the corpus. Take the first entry and load only the evidence it cites. Report what that evidence actually shows — that it supports the finding, contradicts it, or is inconclusive — and stop there. Deciding what to do about it is the user's, with you. Remove the entry from the file only once that decision is made, before the next entry is read.
