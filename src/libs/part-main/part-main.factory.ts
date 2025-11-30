import { type Path, join, strings } from "@angular-devkit/core";
import {
  type Rule,
  type Source,
  type Tree,
  apply,
  asSource,
  mergeWith,
  move,
  template,
} from "@angular-devkit/schematics";
import * as fs from "node:fs";

import { toKebabCase } from "@utils/formatting";
import { generateMain } from "@utils/main/main-functions";
import { type Save } from "@utils/main/save.type";
import { resolvePackageName } from "@utils/name";

import { DEFAULT_APP_NAME, DEFAULT_LANGUAGE } from "~/defaults";

import { type PartMainOptions } from "./part-main.options";
import { type PartMainSchema } from "./part-main.schema";

const transform = (schema: PartMainSchema): PartMainOptions => {
  const name = resolvePackageName(toKebabCase(schema.name?.toString() ?? DEFAULT_APP_NAME));

  return {
    name,
    part: schema.part,
    language: schema.language ?? DEFAULT_LANGUAGE,
    initFunctions: schema.initFunctions ?? false,
    saveFile: schema.saveFile,
  };
};

const generate = (options: PartMainOptions, path: string): Source => {
  const rules = [
    template({
      ...strings,
      ...options,
    }),
    move(path),
  ];

  return apply(asSource(writeMain(options, path)), rules);
};

const writeMain = (options: PartMainOptions, path: string) => {
  return (tree: Tree) => {
    const save = getSave(path, options.part, options.saveFile);
    const resPath = join(options.part as Path, `main.${options.language}`);
    const content = generateMain(options, save);
    fs.rmSync(join(path as Path, resPath), { force: true });
    tree.create(resPath, content);
    return tree;
  };
};

const getSave = (path: string, part: "client" | "server", saveFile?: string): Save => {
  return JSON.parse(
    fs.readFileSync(saveFile ?? join(path as Path, `.nanoforge/${part}.save.json`), "utf-8"),
  ) as Save;
};

export const main = (schema: PartMainSchema): Rule => {
  console.error(schema);
  const options = transform(schema);

  return mergeWith(generate(options, schema.directory ?? options.name));
};
