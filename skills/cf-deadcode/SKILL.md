---
name: cf-deadcode
description: "Report which code is dead or unreachable. Use when the request asks whether code is unused, dead, no longer needed, or can be deleted."
---
Run the dead-code tool the project configures, or the standard one for its language, and run it again in the mode that leaves tests out when it has one: a name only tests reach is dead. Then build the table in `references/string-boundaries.md` from the repository, or, when the request names files, only for the names those files send or receive.

Close the pass with the names the tools returned, the rows that have an empty cell with the number of rows built, and, for each language whose tool has no such mode, a line saying that code only tests reach was not checked there.
