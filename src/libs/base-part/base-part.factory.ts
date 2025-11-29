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

import { type BasePartOptions } from "./base-part.options";
import { type BasePartSchema } from "./base-part.schema";

const transform = (schema: BasePartSchema): BasePartOptions => {
  const name = resolvePackageName(toKebabCase(schema.name?.toString() ?? DEFAULT_APP_NAME));

  return {
    name,
    part: schema.part,
    appClass: schema.part === "client" ? "NanoforgeClient" : "NanoforgeServer",
    language: schema.language ?? DEFAULT_LANGUAGE,
    initFunctions: schema.initFunctions ?? false,
  };
};

const generate = (options: BasePartOptions, path: string): Source => {
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

export const main = (schema: BasePartSchema): Rule => {
  const options = transform(schema);

  return mergeWith(generate(options, schema.directory ?? options.name));
};
