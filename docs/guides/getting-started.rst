Getting Started
===============

This guide explains how to install and use ``@nanoforge-dev/schematics`` to
scaffold NanoForge game engine projects.

Prerequisites
-------------

- `Node.js <https://nodejs.org/>`_ version 25 or later
- A package manager: npm, yarn, pnpm, or bun

Installation
------------

Install the schematics package globally or as a project dependency:

.. code-block:: bash

    # npm
    npm install -g @nanoforge-dev/schematics

    # pnpm
    pnpm add -g @nanoforge-dev/schematics

    # yarn
    yarn global add @nanoforge-dev/schematics

    # bun
    bun add -g @nanoforge-dev/schematics

Creating a New Application
--------------------------

Use the ``application`` schematic to scaffold a complete NanoForge project:

.. code-block:: bash

    schematics @nanoforge-dev/schematics:application my-game

This creates a ``my-game/`` directory with the full project structure including
``package.json``, linter configuration, and a README.

Options
^^^^^^^

You can customize the generated project with the following flags:

.. code-block:: bash

    schematics @nanoforge-dev/schematics:application my-game \
      --language=ts \
      --packageManager=pnpm \
      --server=true \
      --author="Your Name" \
      --version="1.0.0" \
      --description="My NanoForge game"

.. list-table::
   :header-rows: 1
   :widths: 25 75

   * - Flag
     - Description
   * - ``--language``
     - ``ts`` (default) or ``js``
   * - ``--packageManager``
     - ``npm`` (default), ``yarn``, ``pnpm``, or ``bun``
   * - ``--server``
     - Set to ``true`` to include server configuration
   * - ``--strict``
     - Set to ``false`` to disable strict mode (default ``true``)
   * - ``--author``
     - Author name for package.json
   * - ``--version``
     - Initial version (default ``0.0.0``)
   * - ``--description``
     - Project description for package.json
   * - ``--directory``
     - Custom output directory (defaults to project name)

Generating Configuration
------------------------

Create or update the ``nanoforge.config.json`` file:

.. code-block:: bash

    schematics @nanoforge-dev/schematics:configuration my-game

With server support:

.. code-block:: bash

    schematics @nanoforge-dev/schematics:configuration my-game --server=true

If a ``nanoforge.config.json`` already exists in the directory tree, the
schematic deep-merges new values into the existing configuration rather than
overwriting it.

Generating Client/Server Base Code
-----------------------------------

Use the ``part-base`` schematic to scaffold the directory structure for a client
or server part:

.. code-block:: bash

    # Generate client base
    schematics @nanoforge-dev/schematics:part-base my-game --part=client

    # Generate server base
    schematics @nanoforge-dev/schematics:part-base my-game --part=server

With lifecycle init functions:

.. code-block:: bash

    schematics @nanoforge-dev/schematics:part-base my-game \
      --part=client \
      --initFunctions=true

This generates example components, example systems, and (optionally) six
lifecycle hook functions in the ``init/`` directory.

Generating the Main Entry Point
--------------------------------

Use the ``part-main`` schematic to generate a ``main.ts`` file from a
``.nanoforge/<part>.save.json`` metadata file:

.. code-block:: bash

    # Generate client main file
    schematics @nanoforge-dev/schematics:part-main my-game --part=client

    # Generate server main file
    schematics @nanoforge-dev/schematics:part-main my-game --part=server

    # With init functions
    schematics @nanoforge-dev/schematics:part-main my-game \
      --part=client \
      --initFunctions=true

    # Custom save file location
    schematics @nanoforge-dev/schematics:part-main my-game \
      --part=client \
      --saveFile=custom/path/save.json

The save file defines which libraries, components, systems, and entities should
be wired into the main entry point. See :ref:`schematic-part-main` for the save
file format.

Typical Workflow
----------------

A typical workflow for creating a new NanoForge game project:

1. **Scaffold the project**:

   .. code-block:: bash

       schematics @nanoforge-dev/schematics:application my-game --server=true

2. **Install dependencies**:

   .. code-block:: bash

       cd my-game
       npm install

3. **Generate client base**:

   .. code-block:: bash

       schematics @nanoforge-dev/schematics:part-base my-game \
         --part=client --initFunctions=true

4. **Generate server base** (if using server):

   .. code-block:: bash

       schematics @nanoforge-dev/schematics:part-base my-game \
         --part=server --initFunctions=true

5. **Edit the save files** to define your libraries, components, systems, and
   entities in ``.nanoforge/client.save.json`` and ``.nanoforge/server.save.json``.

6. **Generate main entry points**:

   .. code-block:: bash

       schematics @nanoforge-dev/schematics:part-main my-game \
         --part=client --initFunctions=true
       schematics @nanoforge-dev/schematics:part-main my-game \
         --part=server --initFunctions=true

7. **Start developing** your game logic by editing the generated components,
   systems, and init functions.
