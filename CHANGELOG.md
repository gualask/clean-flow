# Changelog

## 2026-06-28

- Clarified split/cohesion guidance: the 300-LOC file-size bell is not a minimum split threshold, `cf-cognitive` must route smaller stable owners to `cf-split`, and private child files of an owner must be grouped into an owner directory when unrelated sibling owners share the parent.

## 2026-06-26

- Materialized skill install: `_shared/vendor.json` vendors shared references/scripts into consuming skills, no `_shared` runtime directory is installed, install/remove/token-report/tests/docs were aligned, `cf-docs` was added, and subagent/doc gates plus split/navigation-cost guidance were tightened.

## 2026-06-12

- Hard triggers in navigation-cost (nesting, function length, ~300-LOC file bell) with inverted burden of proof, closed exemption list, and ban on minimizing language; guard-clause-first remedy order; repo-tree.mjs references now resolve from the reference file's directory instead of the project working directory.

## 2026-06-11

- Navigation-cost spine as the canonical objective across skills; logic fixes (cf-simplify apply guardrails, consolidation criteria, cf-split route outcome); parallel-flows consolidation lens and scope budget in cf-simplify; repo-tree made the discovery default; removed cf-clarify.

## 2026-05-05

- Initial baseline.
