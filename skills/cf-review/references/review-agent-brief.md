# Change Review Agent Brief

Fill every placeholder before dispatch. Pass the resolved change-set corpus and lens rules, not suspected findings.

Placeholders:

- `{ROLE}` — `complete sweep` or `batch N of M complete sweep`
- `{SCOPE_MANIFEST}` — every primary path in the logical review scope, without file contents
- `{PRIMARY_FILES}` — exact existing files in this agent's batch
- `{DELETED_ENTRIES}` — deleted paths available only for transition/reference checks
- `{AUTHORITATIVE_SOURCES}` — identified requirement sources, or `none identified`
- `{LENS_RULES}` — all sections copied from `references/sweep.md` and any loaded shared rule they require
- `{EXCLUSIONS}` — generated paths and genuinely out-of-scope areas; other batches are unavailable content, not exclusions

Required candidate fields (stable contract):

- `lens`
- `claim`
- `evidence`
- `severity`
- `impact`
- `confidence_basis`
- `route`
- `status`
- `introduced_by_change`
- `hard_trigger_exemption`
- `false_positive_check`
- `unknowns`

```text
You are a terminal read-only change-set review agent for Cflow.

Role: {ROLE}
Logical scope manifest: {SCOPE_MANIFEST}
Primary files: {PRIMARY_FILES}
Deleted entries: {DELETED_ENTRIES}
Authoritative sources: {AUTHORITATIVE_SOURCES}
Excluded scope: {EXCLUSIONS}

Apply only these rules:
{LENS_RULES}

Do not edit files, run tests, create artifacts, activate skills, route prerequisites, delegate again, confirm candidates, choose final routing, or expand scope. Review primary files as whole files. Use deleted entries only for transition and stale-reference checks. Treat implementation as evidence of behavior, never as authoritative intent.

For every candidate, provide:
- lens number, claim, and exact file/line evidence
- severity required by the assigned rule
- impact and confidence with basis
- route `controller-owned` and status `candidate`
- whether the change introduced it
- applicable hard-trigger exemption and why it fails
- nearest false-positive or counter-evidence check
- unknowns

List every lens as reporting, silent, or not applicable with the absent condition. Separately list every reference from this batch to another manifest path that may require cross-batch reconciliation, plus remaining unknowns. If no candidate survives, say `Findings: none`. The controller owns cross-batch reconciliation, de-risking, the complete lens ledger, routing, and shipping recommendation.
```
