Contributing
============

This guide explains how to contribute to the NanoForge Schematics project.

Prerequisites
-------------

- `Node.js <https://nodejs.org/>`_ version 25
- `pnpm <https://pnpm.io/installation>`_ 10.x

Setup
-----

1. **Fork and clone** the repository:

   .. code-block:: bash

       git clone https://github.com/<your-username>/schematics.git
       cd schematics

2. **Ensure you are on the main branch**:

   .. code-block:: bash

       git checkout main

3. **Install dependencies**:

   .. code-block:: bash

       pnpm install --frozen-lockfile

   This also sets up Husky git hooks via the ``prepare`` script.

4. **Create a feature branch**:

   .. code-block:: bash

       git checkout -b feat/my-feature

Development Workflow
--------------------

1. Make your changes in the ``src/`` directory.

2. Run formatting and lint fixes:

   .. code-block:: bash

       pnpm format

3. Build the project to verify there are no type errors:

   .. code-block:: bash

       pnpm build

4. Run the full lint check:

   .. code-block:: bash

       pnpm lint

Commit Convention
-----------------

This project uses `Conventional Commits <https://www.conventionalcommits.org/>`_.
Every commit message must follow this format:

::

    <type>(<scope>): <description>

    [optional body]

    [optional footer(s)]

Valid types:

.. list-table::
   :header-rows: 1
   :widths: 15 85

   * - Type
     - Purpose
   * - ``feat``
     - A new feature
   * - ``fix``
     - A bug fix
   * - ``docs``
     - Documentation changes
   * - ``chore``
     - Maintenance tasks (deps, CI, tooling)
   * - ``refactor``
     - Code restructuring without behavior change
   * - ``perf``
     - Performance improvements
   * - ``test``
     - Adding or updating tests
   * - ``style``
     - Code style changes (formatting, whitespace)

Examples:

.. code-block:: text

    feat(application): add support for custom templates
    fix(part-main): correct import ordering for systems
    docs: update contributing guide
    chore(deps): update angular-devkit to v22

Commit messages are validated by ``commitlint`` via a git hook. Commits that do
not follow the convention are rejected.

Pull Request Process
--------------------

1. Push your branch to your fork:

   .. code-block:: bash

       git push origin feat/my-feature

2. `Open a pull request <https://github.com/NanoForge-dev/schematics/compare>`_
   against the ``main`` branch.

3. Ensure the CI pipeline passes (lint checks).

4. Request a review from a maintainer.

5. Once approved, the PR is merged into ``main``.

Code Style
----------

The project enforces consistent code style through ESLint and Prettier.

Naming conventions:

- **Files**: kebab-case (``part-base.factory.ts``)
- **Classes**: PascalCase (``MainGenerator``)
- **Functions**: camelCase (``generateMain``)
- **Constants**: SCREAMING_SNAKE_CASE (``LIBS_FUNCTIONS_NAME``)
- **Enums**: PascalCase enum name, SCREAMING_SNAKE_CASE values

Import ordering (enforced by Prettier plugin):

1. External packages (``@angular-devkit/*``)
2. Utility aliases (``@utils/*``)
3. Source root aliases (``~/*``)
4. Relative imports

Template files under ``src/libs/**/files/`` are excluded from linting and
TypeScript compilation.

Project Structure
-----------------

When adding code, follow the existing structure:

- **Schematics**: ``src/libs/<name>/`` with factory, schema, options, and files
- **Utilities**: ``src/utils/`` grouped by concern
- **Types**: ``.d.ts`` files alongside implementations or in ``src/utils/``

Dependencies
------------

Dependencies are managed through pnpm workspace version catalogs defined in
``pnpm-workspace.yaml``. When adding or updating a dependency, use the catalog
reference rather than a direct version.

Reporting Issues
----------------

Report bugs and request features on the
`GitHub Issues <https://github.com/NanoForge-dev/schematics/issues>`_ page.
Issue templates are available to guide your report.

Security
--------

For security vulnerabilities, refer to the ``SECURITY.md`` file in the
repository root for the responsible disclosure process.
