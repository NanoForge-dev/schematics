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

import { type PartBaseOptions } from "./part-base.options";
import { type PartBaseSchema } from "./part-base.schema";

const transform = (schema: PartBaseSchema): PartBaseOptions => {
  const name = resolvePackageName(toKebabCase(schema.name?.toString() ?? DEFAULT_APP_NAME));

  return {
    name,
    part: schema.part,
    appClass: schema.part === "client" ? "NanoforgeClient" : "NanoforgeServer",
    language: schema.language ?? DEFAULT_LANGUAGE,
    initFunctions: schema.initFunctions ?? false,
  };
};

const generate = (options: PartBaseOptions, path: string): Source => {
  const rules = [
    template({
      ...strings,
      ...options,
      nanoforgeFolder: ".nanoforge",
    }),
    move(path),
    filter((path) => {
      const splited = path.split("/");
      return splited.at(-2) !== ".nanoforge" || splited.at(-1) === `${options.part}.save.json`;
    }),
  ];
  if (!options.initFunctions) rules.push(filter((path) => path.split("/").at(-2) !== "init"));

  return apply(url(join("./files" as Path, options.language)), rules);
};

export const main = (schema: PartBaseSchema): Rule => {
  const options = transform(schema);

  return mergeWith(generate(options, schema.directory ?? options.name));
};
