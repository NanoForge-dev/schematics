import { type Path, join, strings } from "@angular-devkit/core";
import {
  type Rule,
  type Source,
  type Tree,
  apply,
  branchAndMerge,
  chain,
  mergeWith,
  move,
  template,
  url,
} from "@angular-devkit/schematics";

import { ConfigDeclarator } from "@utils/config/config.declarator";
import { ConfigFinder } from "@utils/config/config.finder";
import { toKebabCase } from "@utils/formatting";
import { resolvePackageName } from "@utils/name";

import { DEFAULT_APP_NAME } from "~/defaults";

import { type ConfigurationOptions } from "./configuration.options";
import { type ConfigurationSchema } from "./configuration.schema";

const transform = (schema: ConfigurationSchema): ConfigurationOptions => {
  return {
    client: schema.client,
    server: schema.server,
  };
};

const generate = (options: ConfigurationOptions, path: string): Source => {
  return apply(url(join("./files" as Path)), [
    template({
      ...strings,
      ...options,
    }),
    move(path),
  ]);
};

const addConfiguration = (options: ConfigurationOptions, path: Path) => {
  return (tree: Tree) => {
    const config = new ConfigFinder(tree).find(path);
    if (!config) return tree;

    const content = tree.read(config)?.toString();
    const declarator = new ConfigDeclarator();

    if (!content) return tree;

    tree.overwrite(config, declarator.declare(content, options));
    return tree;
  };
};

export const main = (schema: ConfigurationSchema): Rule => {
  const options = transform(schema);
  const directory =
    schema.directory ??
    resolvePackageName(toKebabCase(schema.name?.toString() ?? DEFAULT_APP_NAME));

  return branchAndMerge(
    chain([mergeWith(generate(options, directory)), addConfiguration(options, directory as Path)]),
  );
};
