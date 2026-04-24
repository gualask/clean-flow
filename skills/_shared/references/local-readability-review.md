# Local Readability Review

Use this as a review lens for touched code only.
Do not refactor untouched code just because it violates a preference.

Look for real readability pressure:

- names that hide intent or describe implementation steps
- mixed abstraction levels that make the main flow hard to scan
- comments that explain unclear code and could be replaced by clearer naming or extraction
- hidden side effects
- argument lists or data shapes that obscure the operation
- formatting or distance that separates related logic

Treat these as heuristics, not rules.
Preserve project conventions and behavior.
Recommend or apply changes only when they reduce reader effort in the touched scope.
