---
name: cf-deadcode
description: Report which code is dead or unreachable. Use when the request asks whether code is unused, dead, no longer needed, or can be deleted. Do not use it to remove that code, and do not use it during a review or a refactor that has not asked about unused code.
---
Close the pass with this table, filled from the repository. One row for every name that crosses a boundary as a string — an event, a command, a message type, a job name, a route, a container token — wherever the two sides are held together by convention and not by an import.

| name | consumer file:line | producer file:line |

Fill every cell by reading the source. An empty producer cell, or an empty consumer cell, is a finding: report it as such.
