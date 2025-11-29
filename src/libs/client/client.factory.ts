import { type Path, join, strings } from "@angular-devkit/core";
import {
  type Rule,
  type Source,
  apply,
  filter,
  mergeWith,
  move,
  template,
  url,
} from "@angular-devkit/schematics";

import { toKebabCase } from "@utils/formatting";
import { resolvePackageName } from "@utils/name";

import { DEFAULT_APP_NAME, DEFAULT_LANGUAGE } from "~/defaults";

import { type ClientOptions } from "./client.options";
import { type ClientSchema } from "./client.schema";

const transform = (schema: ClientSchema): ClientOptions => {
  const name = resolvePackageName(toKebabCase(schema.name?.toString() ?? DEFAULT_APP_NAME));

  return {
    name,
    language: schema.language ?? DEFAULT_LANGUAGE,
    initFunctions: schema.initFunctions ?? false,
  };
};

const generate = (options: ClientOptions, path: string): Source => {
  const rules = [
    template({
      ...strings,
      ...options,
    }),
    move(path),
  ];
  if (!options.initFunctions) rules.push(filter((path) => path.split("/").at(-2) !== "init"));

  return apply(url(join("./files" as Path, options.language)), rules);
};

export const main = (schema: ClientSchema): Rule => {
  const options = transform(schema);

  return mergeWith(generate(options, schema.directory ?? options.name));
};
