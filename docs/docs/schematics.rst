Schematics Reference
====================

This section documents each schematic provided by ``@nanoforge-dev/schematics``.

.. _schematic-application:

application
-----------

Scaffolds a complete NanoForge project with tooling configuration and optional
client/server structure.

**Factory**: ``src/libs/application/application.factory.ts``

Options
^^^^^^^

.. list-table::
   :header-rows: 1
   :widths: 18 10 10 15 47

   * - Option
     - Type
     - Required
     - Default
     - Description
   * - ``name``
     - string
     - Yes
     - --
     - Project name (taken from first positional argument)
   * - ``version``
     - string
     - No
     - ``"0.0.0"``
     - Application version
   * - ``author``
     - string
     - No
     - ``""``
     - Application author
   * - ``description``
     - string
     - No
     - ``""``
     - Application description
   * - ``directory``
     - string
     - No
     - Derived from name
     - Output directory
   * - ``language``
     - ``"ts"`` | ``"js"``
     - No
     - ``"ts"``
     - Language for generated files
   * - ``strict``
     - boolean
     - No
     - ``true``
     - Enable strict mode
   * - ``packageManager``
     - ``"npm"`` | ``"yarn"`` | ``"pnpm"`` | ``"bun"``
     - No
     - ``"npm"``
     - Package manager to configure
   * - ``server``
     - boolean
     - No
     - ``false``
     - Include server configuration

Generated Output
^^^^^^^^^^^^^^^^

::

    <project-name>/
    +-- package.json
    +-- tsconfig.json          (TypeScript only)
    +-- eslint.config.js
    +-- prettier.config.js
    +-- .prettierignore
    +-- README.md

The generated ``package.json`` includes NanoForge dependencies and scripts
configured for the selected package manager.

----

.. _schematic-configuration:

configuration
-------------

Generates or updates the ``nanoforge.config.json`` configuration file for a
NanoForge project. If an existing config is found in the directory tree, the
generated values are deep-merged into it.

**Factory**: ``src/libs/configuration/configuration.factory.ts``

Options
^^^^^^^

.. list-table::
   :header-rows: 1
   :widths: 18 10 10 15 47

   * - Option
     - Type
     - Required
     - Default
     - Description
   * - ``name``
     - string
     - Yes
     - --
     - Project name
   * - ``directory``
     - string
     - No
     - Derived from name
     - Directory for config file
   * - ``server``
     - boolean
     - No
     - ``false``
     - Enable server configuration section

Generated Output
^^^^^^^^^^^^^^^^

A ``nanoforge.config.json`` file with the following structure:

.. code-block:: json

    {
      "client": {
        "build": {
          "entryFile": "client/main.ts",
          "outDir": ".nanoforge/client"
        },
        "runtime": {
          "dir": ".nanoforge/client"
        }
      },
      "server": {
        "enable": true,
        "build": {
          "entryFile": "server/main.ts",
          "outDir": ".nanoforge/server"
        },
        "runtime": {
          "dir": ".nanoforge/server"
        }
      }
    }

The ``server`` block is only included when the ``server`` option is ``true``.

----

.. _schematic-part-base:

part-base
---------

Generates the base directory structure for a client or server part. This
includes example components, example systems, optional lifecycle init functions,
and a ``.nanoforge/<part>.save.json`` metadata file used by the
:ref:`part-main <schematic-part-main>` schematic.

**Factory**: ``src/libs/part-base/part-base.factory.ts``

Options
^^^^^^^

.. list-table::
   :header-rows: 1
   :widths: 18 10 10 15 47

   * - Option
     - Type
     - Required
     - Default
     - Description
   * - ``name``
     - string
     - Yes
     - --
     - Project name
   * - ``part``
     - ``"client"`` | ``"server"``
     - Yes
     - --
     - Which part to generate
   * - ``directory``
     - string
     - No
     - Derived from name
     - Output directory
   * - ``language``
     - ``"ts"`` | ``"js"``
     - No
     - ``"ts"``
     - Language for generated files
   * - ``initFunctions``
     - boolean
     - No
     - ``false``
     - Generate lifecycle init function files

Generated Output
^^^^^^^^^^^^^^^^

::

    <directory>/
    +-- <part>/                         (client/ or server/)
    |   +-- components/
    |   |   +-- example.component.ts
    |   +-- systems/
    |   |   +-- example.system.ts
    |   +-- init/                       (only if initFunctions=true)
    |       +-- before-init.ts
    |       +-- after-init.ts
    |       +-- before-registry-init.ts
    |       +-- after-registry-init.ts
    |       +-- before-run.ts
    |       +-- after-run.ts
    +-- .nanoforge/
        +-- <part>.save.json

Init Functions
^^^^^^^^^^^^^^

When ``initFunctions`` is enabled, six lifecycle hooks are generated:

.. list-table::
   :header-rows: 1
   :widths: 30 30 40

   * - Function
     - Parameters
     - When Called
   * - ``beforeInit``
     - ``app``
     - Before application initialization
   * - ``afterInit``
     - ``app``
     - After application initialization
   * - ``beforeRegistryInit``
     - ``app``, ``registry``
     - Before ECS registry initialization
   * - ``afterRegistryInit``
     - ``app``, ``registry``
     - After ECS registry initialization
   * - ``beforeRun``
     - ``app``
     - Before application run loop starts
   * - ``afterRun``
     - ``app``
     - After application run loop ends

----

.. _schematic-part-main:

part-main
---------

Dynamically generates the ``main.ts`` (or ``main.js``) entry point for a client
or server part. The generated code is driven by the ``.nanoforge/<part>.save.json``
metadata file, which lists libraries, components, systems, and entities.

**Factory**: ``src/libs/part-main/part-main.factory.ts``

Options
^^^^^^^

.. list-table::
   :header-rows: 1
   :widths: 18 10 10 15 47

   * - Option
     - Type
     - Required
     - Default
     - Description
   * - ``name``
     - string
     - Yes
     - --
     - Project name
   * - ``part``
     - ``"client"`` | ``"server"``
     - Yes
     - --
     - Which part to generate
   * - ``directory``
     - string
     - No
     - Derived from name
     - Working directory
   * - ``language``
     - ``"ts"`` | ``"js"``
     - No
     - ``"ts"``
     - Language for generated file
   * - ``initFunctions``
     - boolean
     - No
     - ``false``
     - Include lifecycle init function calls
   * - ``saveFile``
     - string
     - No
     - ``.nanoforge/<part>.save.json``
     - Path to save file with metadata

Save File Format
^^^^^^^^^^^^^^^^

The save file is a JSON document with the following structure:

.. code-block:: typescript

    interface Save {
      libraries: {
        id: string;
        type: "component-system" | "graphics" | "asset-manager"
              | "network" | "input" | "sound" | string;
        name: string;
        path: string;
      }[];
      components: {
        name: string;
        path: string;
      }[];
      systems: {
        name: string;
        path: string;
      }[];
      entities: {
        id: string;
        components: {
          name: string;
          params: string[];
        }[];
      }[];
    }

Generated Code Pattern
^^^^^^^^^^^^^^^^^^^^^^

The ``part-main`` schematic uses the ``MainGenerator`` class to produce code
that follows this pattern:

.. code-block:: typescript

    import { type IRunOptions } from "@nanoforge-dev/common";
    import { NanoforgeFactory } from "@nanoforge-dev/core";
    // ... library, component, system imports ...

    export async function main(options: IRunOptions) {
      const app = NanoforgeFactory.createClient(); // or createServer()

      // Library instances
      const ecsLibrary = new ECSClientLibrary();
      app.useComponentSystem(ecsLibrary);

      // Optional lifecycle hooks
      await beforeInit(app);
      await app.init(options);
      await afterInit(app);

      const registry = ecsLibrary.registry;

      await beforeRegistryInit(app, registry);
      // Entity creation and component attachment
      const entity = registry.spawnEntity();
      registry.addComponent(entity, new ExampleComponent("a", 1));
      await afterRegistryInit(app, registry);

      // System registration
      registry.addSystem(exampleSystem);

      await beforeRun(app);
      await app.run();
      await afterRun(app);
    }

Library Type Mapping
^^^^^^^^^^^^^^^^^^^^

Each library type maps to a specific ``app.use*()`` method:

.. list-table::
   :header-rows: 1

   * - Library Type
     - Method Called
   * - ``component-system``
     - ``app.useComponentSystem()``
   * - ``graphics``
     - ``app.useGraphics()``
   * - ``asset-manager``
     - ``app.useAssetManager()``
   * - ``network``
     - ``app.useNetwork()``
   * - ``input``
     - ``app.useInput()``
   * - ``sound``
     - ``app.useSound()``
   * - Custom (any other string)
     - ``app.use(Symbol("<type>"), ...)``
