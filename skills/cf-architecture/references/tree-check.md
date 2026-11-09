# Tree Check

Go through the files of the entry points and adapters one by one. List, with `file:line`, every check that refuses an operation, every sequence whose step order matters, and every recovery after an error. For each, name its owner in the tree. When it has no owner, or the rule on state and policy in `Boundaries` assigns it elsewhere, correct the tree.

Then, for every new directory, name the condition in `Boundaries` that justifies it; without one, remove it.

Return only the entries that change an owner or the tree, then the part of the tree that changes.
