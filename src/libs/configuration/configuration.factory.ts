import { type Path, join, normalize, strings } from "@angular-devkit/core";
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

import { type ConfigurationOptions } from "./configuration.options";
import { type ConfigurationSchema } from "./configuration.schema";

const transform = (schema: ConfigurationSchema): ConfigurationOptions => {
  const res: ConfigurationOptions = {
    server: {
      enable: schema.server ?? false,
    },
  };

  if (schema.language === "js") {
    res["client"] = { build: { entryFile: "client/main.js" } };
    if (schema.server && "server" in res && res.server)
      res.server["build"] = { entryFile: "server/main.js" };
  }

  return res;
};

const generate = (options: ConfigurationOptions, path: string): Source => {
  return apply(url(join("./files" as Path)), [
    template({
      ...strings,
      ...options,
    }),
    move(normalize(path)),
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
  const directory = schema.directory ?? schema.name;

  return branchAndMerge(
    chain([mergeWith(generate(options, directory)), addConfiguration(options, directory as Path)]),
  );
};
