# Wider Problem

A defect is a surface indication that may correspond to a wider problem in the system. Before fixing it, find out whether it is one site of that problem.

1. Name the defect's mechanism in one sentence, by what the code does rather than where it does it: for example, "a lookup keyed by name lets two entries with the same name overwrite each other".
2. Search the whole repository, not only the files the defect names, for every other site where the same mechanism acts: code that does the same kind of work on the same kind of thing, and the paths the defect's data travels through.
3. From what you read, decide whether the sites share one cause: a missing rule, a missing owner, a contract every site breaks the same way, or an analogous one.

Then:

- **No other site, or sites without a shared cause**: say in one line what you searched, then fix the defect as asked.
- **A shared cause**: change no file. Return only:
  - **Cause**: the mechanism and why it produces the defect, in one or two sentences.
  - **Sites**: every site, with `file:line` and what the user loses there.
  - **Fix**: what fixing the cause once would change, and how the requested fix relates to it: replaced by it, a step of it, or independent.
  - **Question**: whether to fix the cause or only the reported defect.
