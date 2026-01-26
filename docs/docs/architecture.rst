Architecture
============

Overview
--------

NanoForge Schematics is built on top of the `Angular DevKit Schematics
<https://angular.dev/tools/cli/schematics>`_ framework. It provides code
generation templates (schematics) that scaffold NanoForge game engine projects,
including project structure, configuration, client/server base code, and
dynamically generated main entry points.

The package is published to npm as ``@nanoforge-dev/schematics`` and ships both
ESM and CommonJS bundles.

Technology Stack
----------------

.. list-table::
   :header-rows: 1
   :widths: 30 70

   * - Component
     - Technology
   * - Language
     - TypeScript (strict mode)
   * - Schematic Framework
     - Angular DevKit Schematics 21.x
   * - Build Tool
     - tsup (esbuild-based bundler)
   * - Module Formats
     - ESM + CJS (dual package)
   * - Target
     - ES2022
   * - Package Manager
     - pnpm 10.x
   * - Node Version
     - 25
   * - Linter
     - ESLint 9.x
   * - Formatter
     - Prettier 3.x
   * - CI/CD
     - GitHub Actions

Project Structure
-----------------

::

    src/
    +-- index.ts                        # Public API exports
    +-- defaults.ts                     # Default option values
    +-- collection.json                 # Schematics collection manifest
    +-- libs/                           # Schematic implementations
    |   +-- application/                # Application scaffolding
    |   |   +-- application.factory.ts
    |   |   +-- application.options.d.ts
    |   |   +-- application.schema.d.ts
    |   |   +-- schema.json
    |   |   +-- files/                  # EJS templates (ts/ and js/)
    |   +-- configuration/              # Config file generation
    |   |   +-- configuration.factory.ts
    |   |   +-- schema.json
    |   |   +-- files/
    |   +-- part-base/                  # Client/server base structure
    |   |   +-- part-base.factory.ts
    |   |   +-- schema.json
    |   |   +-- files/
    |   +-- part-main/                  # Main file code generation
    |       +-- part-main.factory.ts
    |       +-- schema.json
    +-- utils/                          # Shared utilities
        +-- index.ts
        +-- formatting.ts               # String formatting helpers
        +-- name.ts                     # Package name resolution
        +-- object.ts                   # Deep merge utilities
        +-- type.ts                     # Shared type definitions
        +-- config/                     # Configuration helpers
        |   +-- config.type.ts
        |   +-- config.finder.ts
        |   +-- config.declarator.ts
        +-- main/                       # Main file generation
            +-- main.generator.ts
            +-- main-functions.ts
            +-- save.type.ts
            +-- enums.ts
            +-- conts.ts

Factory Pattern
---------------

Every schematic follows a three-phase factory pattern:

1. **Transform** -- Convert raw schema input (user-provided or prompted values)
   into validated internal options with defaults applied.
2. **Generate** -- Load EJS template files from the ``files/`` directory,
   interpolate options into the templates, and produce a virtual file tree.
3. **Merge** -- Combine the generated file tree into the target project
   directory using Angular DevKit merge strategies.

Each factory module exports a ``main`` function that receives the schema and
returns an Angular DevKit ``Rule``.

.. code-block:: typescript

    // Typical factory structure
    const transform = (schema: Schema): Options => { /* ... */ };
    const generate = (options: Options, path: string): Source => { /* ... */ };
    export const main = (schema: Schema): Rule => {
      const options = transform(schema);
      return mergeWith(generate(options, schema.directory ?? options.name));
    };

Collection Manifest
-------------------

The ``collection.json`` file registers all available schematics. Each entry
specifies the factory function, a human-readable description, and the JSON
Schema for input validation.

.. code-block:: json

    {
      "schematics": {
        "application": {
          "factory": "./libs/application/application.factory#main",
          "description": "Create a NanoForge Base application.",
          "schema": "./libs/application/schema.json"
        },
        "configuration": {
          "factory": "./libs/configuration/configuration.factory#main",
          "description": "Create a NanoForge Configuration.",
          "schema": "./libs/configuration/schema.json"
        },
        "part-base": {
          "factory": "./libs/part-base/part-base.factory#main",
          "description": "Create a NanoForge Base for client or server.",
          "schema": "./libs/part-base/schema.json"
        },
        "part-main": {
          "factory": "./libs/part-main/part-main.factory#main",
          "description": "Create a Main file for client or server.",
          "schema": "./libs/part-main/schema.json"
        }
      }
    }

Build Pipeline
--------------

The project uses ``tsup`` for bundling. The build produces:

- A main bundle (ESM + CJS) from ``src/index.ts``
- Per-schematic ESM bundles from each ``*.factory.ts``
- Type declarations (``.d.ts`` and ``.d.cts``)
- Source maps

A ``postbuild`` step copies non-TypeScript assets (``collection.json``, JSON
schemas, and template files) into the ``dist/`` directory using ``cpx2``.

.. code-block:: bash

    # Full build
    pnpm run build

    # What happens internally:
    # 1. tsc --noEmit        (type checking)
    # 2. tsup                (bundling)
    # 3. copy:collection     (collection.json + schema.json files)
    # 4. copy:lib            (template files)
