import { type Path, normalize, strings } from "@angular-devkit/core";
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

import { DEFAULT_APP_NAME, DEFAULT_PACKAGE_MANAGER } from "~/defaults";

import { type DockerOptions } from "./docker.options";
import { type DockerSchema } from "./docker.schema";

const transform = (schema: DockerSchema): DockerOptions => {
  const name = resolvePackageName(toKebabCase(schema.name?.toString() ?? DEFAULT_APP_NAME));

  return {
    name,
    packageManager: schema.packageManager ?? DEFAULT_PACKAGE_MANAGER,
    directory: schema.directory,
  };
};

const generate = (options: DockerOptions, path: string): Source => {
  return apply(url("./files" as Path), [
    template({
      ...strings,
      ...options,
    }),
    move(normalize(path)),
  ]);
};

export const main = (schema: DockerSchema): Rule => {
  const options = transform(schema);
  return mergeWith(generate(options, schema.directory ?? options.name));
};
