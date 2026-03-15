import { type Path, join, normalize, strings } from "@angular-devkit/core";
import {
  type Rule,
  type SchematicContext,
  type Source,
  type Tree,
  apply,
  applyTemplates,
  mergeWith,
  move,
  url,
} from "@angular-devkit/schematics";
import { firstValueFrom } from "rxjs";

import { toKebabCase } from "@utils/formatting";
import { resolvePackageName } from "@utils/name";

import {
  DEFAULT_APP_NAME,
  DEFAULT_AUTHOR,
  DEFAULT_DESCRIPTION,
  DEFAULT_LANGUAGE,
  DEFAULT_PACKAGE_MANAGER,
  DEFAULT_VERSION,
} from "~/defaults";

import { type ApplicationOptions } from "./application.options";
import { type ApplicationSchema } from "./application.schema";

const transform = (schema: ApplicationSchema): ApplicationOptions => {
  const name = resolvePackageName(toKebabCase(schema.name?.toString() ?? DEFAULT_APP_NAME));

  return {
    name,
    version: schema.version ?? DEFAULT_VERSION,
    author: schema.author ?? DEFAULT_AUTHOR,
    description: schema.description ?? DEFAULT_DESCRIPTION,
    language: schema.language ?? DEFAULT_LANGUAGE,
    strict: schema.strict ?? true,
    lint: schema.lint ?? true,
    packageManager: schema.packageManager ?? DEFAULT_PACKAGE_MANAGER,
    server: schema.server ?? false,
  };
};

const generate = (options: ApplicationOptions, path: string): Source => {
  return apply(url(join("./files" as Path, options.language)), [
    applyTemplates({
      ...strings,
      ...options,
    }),
    move(normalize(path)),
  ]);
};

export const main = (schema: ApplicationSchema): Rule => {
  const options = transform(schema);
  const path = schema.directory ?? options.name;

  return async (baseTree: Tree, context: SchematicContext) => {
    let tree = await mergeWith(generate(options, path))(baseTree, context);
    if (!tree) return tree;
    if (!("delete" in tree)) {
      if (typeof tree === "function") return tree;
      tree = await firstValueFrom(tree);
    }

    if (!options.lint) {
      const basePath = join("/" as Path, path);
      tree.delete(join(basePath, "eslint.config.js"));
      tree.delete(join(basePath, "prettier.config.js"));
      tree.delete(join(basePath, ".prettierignore"));
      if (options.language === "js") tree.delete(join(basePath, "jsconfig.json"));
    }

    return tree;
  };
};
