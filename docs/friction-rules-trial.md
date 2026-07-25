# Operating rules (trial v1 — friction-derived)

Candidate `AGENTS.md` rules derived from a friction log of 572 entries (2026-07-19 → 2026-07-24,
pack 0.1.0), collected in a consuming repository — not in this pack. They target friction that is
**not** owned by any Cflow skill: sandbox limits and mechanically avoidable command mistakes.

Not installed by Cflow. To trial them, paste the sections below into the consuming repository's
`AGENTS.md` (or `$CODEX_HOME/AGENTS.md`). The environment section is host-specific and must be
re-derived per host before it could ever be packaged.

## Measuring the trial

The friction log is the instrument: compare per-day rates of the signatures each rule targets,
not the daily total, which tracks how much work was done. Baseline over the six logged days:

| Signature | Total | Per day (19→24) | Rules targeting it |
| --- | --- | --- | --- |
| `tsx` IPC socket | 49 | 2, 5, 10, 15, 15, 2 | environment |
| `.git/index.lock` read-only | 17 | 1, 1, 6, 3, 3, 3 | environment |
| backtick / quoting | 29 | 2, 7, 10, 2, 5, 3 | command hygiene |
| truncated output | 40 | 0, 7, 14, 5, 12, 2 | command hygiene |
| non-existent path | 47 | 1, 5, 12, 10, 13, 6 | command hygiene |
| formatter (Biome) late | 34 | 3, 2, 13, 8, 4, 4 | edits and verification |
| failed patch / hunk | 17 | 0, 5, 3, 3, 4, 2 | edits and verification |

A falling per-signature rate with a flat total is a success: the logger stops recording repeated
known friction and starts recording new friction. Expect a residue the rules cannot remove —
missing binaries stay missing; a rule only prevents the attempt.

## Known environment constraints

This environment is sandboxed. The following are **settled facts, not transient failures**.
Never retry them; pick the listed alternative on the first attempt.

- `tsx` cannot open its IPC socket in `/tmp` (EPERM). Do not run `tsx`, `npx tsx`, or `tsx -e`
  for inline scripts, fixture generation, or diagnostics. Use `node` directly, or a test
  already wired into the repo's runner.
- `.git` is mounted read-only: `git add` / `git commit` cannot create `.git/index.lock`.
  Read-only git (`log`, `diff`, `show`, `status`) works. Never attempt to commit; report the
  intended commit to the user instead.
- No network egress: npm registry, `github.com`, `api.github.com`, and public sites are
  unreachable, and DNS does not resolve. Do not run `npm install`, `npm audit`, `npm outdated`,
  `git ls-remote`, `gh`, or `curl` against external hosts.
- SSH to remote hosts is blocked by the sandbox.
- Chromium/Playwright do not start under the sandbox.
- Unavailable commands: `xmllint`, `xmlstarlet`, `unzip`, `identify`, `montage`, `convert`,
  `sqlite3`, `pip`, `actionlint`.

If a task genuinely requires one of these, say so and stop — do not work around it silently.

## Command hygiene

- **Never put a backtick inside a double-quoted shell string.** Search patterns containing
  Markdown backticks must use single quotes: `rg 'pattern'`, not `rg "pattern"`.
- **One target per read.** Do not combine multiple files, directories, or broad patterns into a
  single read or search "to save a round trip" — the output gets truncated and the result is
  unreliable. If output is truncated, narrow the scope; never re-run a differently-shaped
  aggregate read.
- **Verify a path before using it.** Never infer a file path from a naming convention
  (`tests/`, `scripts/`, `<name>.spec.ts`, `templates/<x>.md`). List or glob the directory
  first; if the path does not exist, say so instead of searching harder.

## Edits and verification

- **One file per patch, minimal context.** Do not build cumulative multi-file or multi-hunk
  patches; they fail on whitespace, line wrapping, and hunk order. Apply changes file by file.
- **Format before verifying.** After editing, run the repo formatter on the touched files
  before running typecheck/tests — do not discover formatting violations at the end of a
  green verification run.
- **Do not build text checks against formatted Markdown.** A phrase check that assumes a
  single line, no wrapping, or no blockquote prefix will produce false positives. Verify the
  check against one known-good and one known-bad file before trusting its output.
