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
    packageManager: schema.packageManager ?? DEFAULT_PACKAGE_MANAGER,
    dependencies: schema.dependencies ?? "",
  };
};

const generate = (options: ApplicationOptions, path: string): Source => {
  return apply(url(join("./files" as Path, options.language)), [
    template({
      ...strings,
      ...options,
    }),
    move(path),
  ]);
};

export const main = (schema: ApplicationSchema): Rule => {
  const options = transform(schema);

  return mergeWith(generate(options, schema.directory ?? options.name));
};
