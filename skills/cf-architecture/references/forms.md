# Forms

Each form is named by what it makes the unit at the top of the tree and by the direction of its dependencies. A form wins only on the facts in its **When**, shown by a `file:line`, a commit or a stated requirement. Forms nest: layers inside a module, a pipeline inside a module. When none of these forms fits the code, name the recognized style that does, with the same four parts.

## Layered

- **Unit**: the technical layer: entry points, business logic, persistence.
- **Direction**: each layer uses only the layers below it.
- **When**: the system is small, or its changes land in one layer at a time.
- **Tree**: one folder per layer at the top, files by topic inside each.
- **Drawback to check**: a change to one capability touches every layer.

## Ports and adapters

- **Unit**: the application core, and the adapters around it.
- **Direction**: inward only. The core names no adapter, database, framework or UI; it declares the ports its adapters implement.
- **When**: the business logic must run unchanged under more than one driver or technology, or tests must replace a system the logic uses.
- **Conventions**, one rule under different names; take one and name it:
  - hexagonal: `ports`, `adapters`;
  - onion: domain model, domain services, application services, infrastructure;
  - clean: entities, use cases, interface adapters, frameworks and drivers;
  - DDD layers: `domain`, `application`, `infrastructure`, `interfaces`.
- **Tree**: the convention's inner rings for the core; its outer ring for the adapters, grouped by the system each adapts.

## Modular monolith

- **Unit**: the capability, one module each, inside one deployable.
- **Direction**: a module uses another only through what that module exposes, along a list without cycles.
- **When**: a layer has grown too big to work on as one unit, or the same term means different things in two parts of the code.
- **Tree**: beside the files that start and wire the application, two groups:
  - the modules, each holding its own entry points (commands, handlers), business logic and persistence;
  - what more than one module uses (external systems, shared infrastructure), which never uses a module.

  Inside a module, only the layers its code needs, each a file or a folder by its size, named from one ports-and-adapters convention, the same in every module.
- **Application services**: an operation that composes modules (`Boundaries`, split 4) sits in the module that owns it, named for what it does for the user; no module uses it. Not in a group of its own, and not in one module that gathers every composition.
- **Check**: name which module may use which, without cycles, and the check that enforces it: the repository's existing one rewritten, or a test where there is none.

## Vertical slices

- **Unit**: the request: one folder per command or query, holding everything it needs from the entry point to storage.
- **Direction**: slices do not use each other; what they share stays small, in one shared group.
- **When**: the system is mostly independent requests that share little domain logic, and its changes land one request at a time.
- **Tree**: requests grouped by area, one folder each; no fixed layers inside a slice, each as simple as its request allows.
- **Drawback to check**: a domain rule many requests need gets duplicated, or pulled into the shared group.

## Plugins

- **Unit**: a core, and the extensions that contribute to it.
- **Direction**: extensions use the core's extension points; neither the core nor another extension uses an extension.
- **When**: parts of the product are added, removed or enabled independently, through a registration point.
- **Tree**: the core; one folder per extension; the registration of extensions in one place.

## Pipeline

- **Unit**: the processing stage.
- **Direction**: each stage takes the previous stage's output and knows no other stage; the pipeline composes them.
- **When**: the work is a sequence of steps with separate responsibilities and defined input and output contracts.
- **Tree**: one file or folder per stage, the data contracts between stages, and the pipeline that composes them.
