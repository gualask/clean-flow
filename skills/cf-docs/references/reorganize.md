# Documentation Reorganization

Move existing docs into a structure a reader can navigate; their content stays as it is.

- Group docs by an aspect they already share: a product area, or a reader (user, contributor, maintainer). A group is born only with at least two existing docs: no empty or one-file folders, and at most one level under `docs/`.
- Move whole files. Keep a file's name unless it no longer fits its place; give the reason for each rename.
- Before moving anything, present the target tree — each move and rename, from → to — and end the turn. Apply it only after the user confirms.
- Do not write new docs or new sections while reorganizing. Content that looks missing or duplicated goes in **Result** as a proposal naming the owner doc.
- Keep one index of the technical docs, in the project README or `docs/README.md`.
