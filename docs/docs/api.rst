API Reference
=============

This section documents the internal utility modules and classes available in the
``src/utils/`` directory.

MainGenerator
-------------

**Module**: ``src/utils/main/main.generator.ts``

A builder-pattern class that programmatically generates the contents of a
NanoForge ``main.ts`` entry point file. Used by the
:ref:`part-main <schematic-part-main>` schematic.

Methods
^^^^^^^

.. method:: generateBaseImports(hasTypes: boolean): MainGenerator

   Adds the base NanoForge imports (``IRunOptions`` from ``@nanoforge-dev/common``
   and ``NanoforgeFactory`` from ``@nanoforge-dev/core``). Type imports are
   conditional on the ``hasTypes`` flag (true for TypeScript, false for
   JavaScript).

.. method:: generateLibsImports(libs: SaveLibrary[]): MainGenerator

   Generates import statements for all libraries listed in the save file,
   sorted alphabetically by import path.

.. method:: generateComponentsImports(components: SaveComponent[]): MainGenerator

   Generates import statements for all components, sorted by path.

.. method:: generateSystemsImports(systems: SaveSystem[]): MainGenerator

   Generates import statements for all systems, sorted by path.

.. method:: generateMainFunction(hasTypes: boolean, cb: (generator: MainGenerator) => void): MainGenerator

   Wraps a callback's output inside an ``export async function main(options) { ... }``
   block. The ``hasTypes`` flag controls whether the ``options`` parameter
   receives a type annotation.

.. method:: generateApp(isServer: boolean): MainGenerator

   Emits ``const app = NanoforgeFactory.createClient()`` or
   ``NanoforgeFactory.createServer()`` depending on the ``isServer`` flag.

.. method:: generateAppInit(): MainGenerator

   Emits ``await app.init(options);``.

.. method:: generateAppRun(hasInitFunctions: boolean): MainGenerator

   Emits ``await app.run();``.

.. method:: generateLibsInstances(libs: SaveLibrary[]): MainGenerator

   Emits ``const <id> = new <Name>();`` for each library.

.. method:: generateLibsInit(libs: SaveLibrary[]): MainGenerator

   Emits the appropriate ``app.use*(<id>);`` call for each library based on
   its type (see :ref:`Library Type Mapping <schematic-part-main>`).

.. method:: generateRegistry(libs: SaveLibrary[]): MainGenerator

   Emits ``const registry = <ecsLib>.registry;`` where ``<ecsLib>`` is the
   library with type ``component-system``.

.. method:: generateEntities(entities: SaveEntity[]): MainGenerator

   For each entity, emits ``registry.spawnEntity()`` followed by
   ``registry.addComponent()`` calls for each component with its parameters.

.. method:: generateSystems(systems: SaveSystem[]): MainGenerator

   Emits ``registry.addSystem(<name>);`` for each system.

.. method:: generateInitFunctionIfNeeded(needed: boolean, func: InitFunctionEnum): MainGenerator

   Conditionally emits an ``await <func>(app);`` or
   ``await <func>(app, registry);`` call based on the init function type.

.. method:: generateInitFunctionsImportsIfNeeded(needed: boolean): MainGenerator

   Conditionally emits import statements for all six lifecycle init functions.

.. method:: toString(): string

   Returns the accumulated generated code as a string.

ConfigFinder
------------

**Module**: ``src/utils/config/config.finder.ts``

Searches the virtual file tree for an existing ``nanoforge.config.json``.

.. method:: find(tree: Tree, path: string): Config | null

   Recursively searches from the given path upward through parent directories
   for a ``nanoforge.config.json`` file. Returns the parsed ``Config`` object
   if found, or ``null`` if no config exists in the tree.

ConfigDeclarator
----------------

**Module**: ``src/utils/config/config.declarator.ts``

Modifies a configuration tree by merging server options.

.. method:: declare(tree: Tree, path: string, server: boolean): void

   Reads the ``nanoforge.config.json`` at the given path, deep-merges the
   server configuration if ``server`` is ``true``, and writes the result
   back to the tree.

Formatting Utilities
--------------------

**Module**: ``src/utils/formatting.ts``

.. function:: toKebabCase(str: string): string

   Converts a string to kebab-case. Used to normalize project names for
   directory and package naming.

   Examples::

       toKebabCase("MyProject")     // "my-project"
       toKebabCase("some string")   // "some-string"

Name Utilities
--------------

**Module**: ``src/utils/name.ts``

.. function:: resolvePackageName(path: string): string

   Extracts the package name from a path string. Handles scoped packages
   (``@scope/name``) by returning only the name portion.

Object Utilities
----------------

**Module**: ``src/utils/object.ts``

.. function:: deepMerge(...objects: object[]): object

   Recursively merges multiple objects together. Later objects take precedence
   over earlier ones for primitive values. Nested objects are merged recursively
   rather than replaced.

.. function:: isObject(item: unknown): boolean

   Type guard that returns ``true`` if the item is a plain object (not an array
   or null).

Type Definitions
----------------

**Module**: ``src/utils/type.ts``

Shared TypeScript type definitions used across schematics.

Enums
-----

InitFunctionEnum
^^^^^^^^^^^^^^^^

**Module**: ``src/utils/main/enums.ts``

Enumerates the six lifecycle init function names:

.. code-block:: typescript

    enum InitFunctionEnum {
      BEFORE_INIT = "beforeInit",
      AFTER_INIT = "afterInit",
      BEFORE_REGISTRY_INIT = "beforeRegistryInit",
      AFTER_REGISTRY_INIT = "afterRegistryInit",
      BEFORE_RUN = "beforeRun",
      AFTER_RUN = "afterRun",
    }

SaveLibraryTypeEnum
^^^^^^^^^^^^^^^^^^^

**Module**: ``src/utils/main/save.type.ts``

Enumerates the known library types:

.. code-block:: typescript

    enum SaveLibraryTypeEnum {
      COMPONENT_SYSTEM = "component-system",
      GRAPHICS = "graphics",
      ASSET_MANAGER = "asset-manager",
      NETWORK = "network",
      INPUT = "input",
      SOUND = "sound",
    }

Constants
---------

LIBS_FUNCTIONS_NAME
^^^^^^^^^^^^^^^^^^^

**Module**: ``src/utils/main/conts.ts``

Maps library types to the corresponding ``app.use*()`` method name:

.. code-block:: typescript

    const LIBS_FUNCTIONS_NAME = {
      "component-system": "useComponentSystem",
      "graphics": "useGraphics",
      "asset-manager": "useAssetManager",
      "network": "useNetwork",
      "input": "useInput",
      "sound": "useSound",
    };
