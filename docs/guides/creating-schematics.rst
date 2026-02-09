Creating a New Schematic
========================

This guide walks through creating a new schematic for the NanoForge Schematics
package.

Concepts
--------

A schematic is a code generator built on the `Angular DevKit Schematics
<https://angular.dev/tools/cli/schematics>`_ framework. Each schematic
consists of:

- A **JSON Schema** (``schema.json``) that defines the input options
- **Type definitions** (``.d.ts``) for the schema and validated options
- A **factory function** (``.factory.ts``) that transforms input, generates
  files from templates, and merges them into the target project
- **Template files** (``files/``) in EJS format that produce the output

Step 1: Create the Directory Structure
---------------------------------------

Create a new directory under ``src/libs/`` with the schematic name:

::

    src/libs/my-schematic/
    +-- my-schematic.factory.ts
    +-- my-schematic.options.d.ts
    +-- my-schematic.schema.d.ts
    +-- schema.json
    +-- files/
        +-- ts/
        |   +-- ... (TypeScript templates)
        +-- js/
            +-- ... (JavaScript templates)

Step 2: Define the JSON Schema
-------------------------------

Create ``schema.json`` to define the input options:

.. code-block:: json

    {
      "$schema": "http://json-schema.org/draft-07/schema",
      "$id": "SchematicsNanoForgeMySchematic",
      "title": "NanoForge My Schematic Options Schema",
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "The name of the application",
          "$default": {
            "$source": "argv",
            "index": 0
          },
          "x-prompt": "What name would you like to use?"
        },
        "directory": {
          "type": "string",
          "description": "Output directory"
        },
        "language": {
          "type": "string",
          "enum": ["ts", "js"],
          "description": "Language for generated files",
          "default": "ts"
        }
      },
      "required": ["name"]
    }

Key schema features:

- ``$default.$source: "argv"`` reads the value from positional CLI arguments
- ``x-prompt`` prompts the user interactively if the value is not provided
- ``required`` lists mandatory fields
- ``default`` sets fallback values

Step 3: Define Type Interfaces
-------------------------------

Create the schema type (``my-schematic.schema.d.ts``):

.. code-block:: typescript

    export interface MySchematicSchema {
      name: string;
      directory?: string;
      language?: string;
    }

Create the options type (``my-schematic.options.d.ts``):

.. code-block:: typescript

    export interface MySchematicOptions {
      name: string;
      language: string;
    }

The schema type represents raw user input (with optional fields), while the
options type represents the validated and defaulted values used internally.

Step 4: Implement the Factory
------------------------------

Create ``my-schematic.factory.ts`` following the transform-generate-merge
pattern:

.. code-block:: typescript

    import { type Path, join, strings } from "@angular-devkit/core";
    import {
      type Rule,
      type Source,
      apply,
      mergeWith,
      move,
      template,
      url,
    } from "@angular-devkit/schematics";

    import { toKebabCase } from "@utils/formatting";
    import { resolvePackageName } from "@utils/name";

    import { DEFAULT_APP_NAME, DEFAULT_LANGUAGE } from "~/defaults";

    import { type MySchematicOptions } from "./my-schematic.options";
    import { type MySchematicSchema } from "./my-schematic.schema";

    // Phase 1: Transform raw schema into validated options
    const transform = (schema: MySchematicSchema): MySchematicOptions => {
      const name = resolvePackageName(
        toKebabCase(schema.name?.toString() ?? DEFAULT_APP_NAME),
      );

      return {
        name,
        language: schema.language ?? DEFAULT_LANGUAGE,
      };
    };

    // Phase 2: Generate file tree from templates
    const generate = (options: MySchematicOptions, path: string): Source => {
      return apply(url(join("./files" as Path, options.language)), [
        template({
          ...strings,   // Angular string helpers (dasherize, classify, etc.)
          ...options,    // Interpolation variables
        }),
        move(path),      // Move files to target directory
      ]);
    };

    // Phase 3: Export factory that merges generated files
    export const main = (schema: MySchematicSchema): Rule => {
      const options = transform(schema);
      return mergeWith(generate(options, schema.directory ?? options.name));
    };

Step 5: Create Template Files
------------------------------

Template files use EJS syntax for interpolation. Place them under ``files/ts/``
and ``files/js/``.

Example template file (``files/ts/example.ts``):

.. code-block:: text

    // Generated for <%= name %>

    export class <%= classify(name) %>Manager {
      constructor() {
        console.log("<%= name %> initialized");
      }
    }

Available template helpers (from ``@angular-devkit/core/strings``):

.. list-table::
   :header-rows: 1

   * - Helper
     - Description
     - Example
   * - ``dasherize``
     - Convert to kebab-case
     - ``MyApp`` -> ``my-app``
   * - ``classify``
     - Convert to PascalCase
     - ``my-app`` -> ``MyApp``
   * - ``camelize``
     - Convert to camelCase
     - ``my-app`` -> ``myApp``
   * - ``underscore``
     - Convert to snake_case
     - ``MyApp`` -> ``my_app``
   * - ``capitalize``
     - Capitalize first letter
     - ``hello`` -> ``Hello``
   * - ``decamelize``
     - Split camelCase with separator
     - ``myApp`` -> ``my_app``

Dynamic file and directory names use ``__variable__`` syntax:

::

    files/ts/__name__/          -> my-project/
    files/ts/__name__.config.ts -> my-project.config.ts

Step 6: Register the Schematic
-------------------------------

Add the new schematic to ``src/collection.json``:

.. code-block:: json

    {
      "schematics": {
        "my-schematic": {
          "factory": "./libs/my-schematic/my-schematic.factory#main",
          "description": "Create a NanoForge my-schematic.",
          "schema": "./libs/my-schematic/schema.json"
        }
      }
    }

Step 7: Add the Build Entry
-----------------------------

Add a build entry in ``tsup.config.ts``:

.. code-block:: typescript

    export default [
      createTsupConfig(),
      createLibTsupConfig("application"),
      createLibTsupConfig("configuration"),
      createLibTsupConfig("part-base"),
      createLibTsupConfig("part-main"),
      createLibTsupConfig("my-schematic"),  // Add this line
    ];

The ``createLibTsupConfig`` helper generates a tsup entry that:

- Uses ``src/libs/<name>/<name>.factory.ts`` as the entry point
- Outputs to ``dist/libs/<name>/``
- Builds ESM format only

Step 8: Build and Verify
--------------------------

Build the project and verify everything compiles:

.. code-block:: bash

    pnpm build

Check the output in ``dist/libs/my-schematic/`` to confirm:

- The factory is compiled
- The ``schema.json`` is copied
- Template files are copied

Step 9: Test the Schematic
---------------------------

Test the schematic locally by running it with the schematics CLI:

.. code-block:: bash

    # From the repository root
    npx @angular-devkit/schematics-cli .:my-schematic test-project

The ``.`` refers to the current package's ``collection.json``.

Advanced Patterns
-----------------

Filtering Files
^^^^^^^^^^^^^^^

Use ``filter()`` to conditionally exclude files from the generated output:

.. code-block:: typescript

    import { filter } from "@angular-devkit/schematics";

    const generate = (options: Options, path: string): Source => {
      const rules = [
        template({ ...strings, ...options }),
        move(path),
        filter((filePath) => {
          // Exclude init/ directory if not needed
          if (!options.initFunctions) {
            return !filePath.includes("/init/");
          }
          return true;
        }),
      ];
      return apply(url("./files/ts"), rules);
    };

Chaining Rules
^^^^^^^^^^^^^^

Use ``chain()`` to compose multiple rules:

.. code-block:: typescript

    import { chain, branchAndMerge } from "@angular-devkit/schematics";

    export const main = (schema: Schema): Rule => {
      return chain([
        branchAndMerge(mergeWith(generateBase(options))),
        branchAndMerge(mergeWith(generateConfig(options))),
      ]);
    };

Reading and Modifying Files
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Use the ``Tree`` API to read and write files in the virtual file system:

.. code-block:: typescript

    import { type Rule, type Tree } from "@angular-devkit/schematics";

    export const main = (schema: Schema): Rule => {
      return (tree: Tree) => {
        // Read an existing file
        const content = tree.read("some/file.json");
        if (content) {
          const json = JSON.parse(content.toString());
          json.newField = "value";
          tree.overwrite("some/file.json", JSON.stringify(json, null, 2));
        }
        return tree;
      };
    };

Using Utility Functions
^^^^^^^^^^^^^^^^^^^^^^^

The ``src/utils/`` directory provides several helpers:

- ``toKebabCase(str)`` -- Normalize strings to kebab-case
- ``resolvePackageName(path)`` -- Extract package name from scoped paths
- ``deepMerge(...objects)`` -- Recursively merge objects
- ``ConfigFinder`` -- Locate ``nanoforge.config.json`` in the tree
- ``MainGenerator`` -- Programmatically build main file content

Refer to the :doc:`/docs/api` for full details on each utility.
