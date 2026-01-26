Testing
=======

This guide covers how to run quality checks on the NanoForge Schematics
codebase.

Running Lint Checks
-------------------

The project uses ESLint for code quality and Prettier for formatting. Run both
checks with:

.. code-block:: bash

    pnpm lint

This executes:

1. ``prettier --check .`` -- Verifies all files match the expected formatting
2. ``eslint --format=pretty src`` -- Checks TypeScript source files for lint
   errors

Auto-Fixing Issues
------------------

To automatically fix formatting and lint issues:

.. code-block:: bash

    pnpm format

This executes:

1. ``prettier --write .`` -- Reformats all files
2. ``eslint --fix --format=pretty src`` -- Auto-fixes lint issues where possible

Type Checking
-------------

TypeScript type checking is part of the build process:

.. code-block:: bash

    # Type check only (no output)
    npx tsc --noEmit

    # Full build (includes type checking)
    pnpm build

Building
--------

Verify that the project builds without errors:

.. code-block:: bash

    pnpm build

This runs type checking, bundles the code with tsup, and copies template files
and schemas to ``dist/``.

Pre-Commit Hooks
----------------

The project has pre-commit hooks configured via Husky and lint-staged. When you
commit, the following checks run automatically on staged files:

- **Prettier**: Formats all staged files
- **ESLint**: Fixes lint issues in staged ``src/**/*.ts`` files

If any check fails, the commit is rejected. Fix the issues and try again.

CI Pipeline
-----------

The GitHub Actions CI pipeline (``tests.yml``) runs on:

- Every pull request targeting ``main``
- Every push to ``main``
- Manual dispatch

The CI pipeline runs ``pnpm lint`` and blocks merging if it fails.

Verifying a Full Check
-----------------------

Before submitting a pull request, run the full check locally:

.. code-block:: bash

    pnpm format && pnpm build

This ensures your code passes formatting, lint checks, type checking, and
builds correctly.
