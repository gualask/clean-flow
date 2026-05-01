# cf-mr-wolf Derisk

## Controller Contract

- Treat this as a packaged custom agent.
- Do not read or paste the TOML instructions or full report format.
- Keep the model and reasoning effort declared by the TOML.

## Agent Input

Pass repository path, problem frame, `.cflow/mr-wolf-notes.md` path or compact notes summary, assigned candidate findings, selected context slice, and explicit exclusions.
For large candidate sets, pass the smallest decision-blocking subset first.
Keep unchecked candidates as `candidates to verify`, not confirmed findings.
Start another sequential pass only when unchecked candidates can change the final output.

## Expected Output

- **Verification Scope**
- **Finding Classification**
- **Fix-Fit Risks**
- **Evidence**
- **Unknowns**

## Controller Handling

- Update notes with confirmed candidates, candidates to verify, and excluded false positives.
- Do not recommend implementation for `uncertain` findings unless the next step is verification.
