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
import { basename, parse } from "path";

import { toKebabCase } from "@utils/formatting";

import {
  DEFAULT_APP_NAME,
  DEFAULT_AUTHOR,
  DEFAULT_DESCRIPTION,
  DEFAULT_LANGUAGE,
  DEFAULT_PACKAGE_MANAGER,
  DEFAULT_VERSION,
} from "~/defaults";

import { type ApplicationOptions } from "./application.schema";

/**
 * The rules for `name` field defined at https://www.npmjs.com/package/normalize-package-data
 * are the following: the string may not:
 * 1. start with a period.
 * 2. contain the following characters: `/@\s+%`.
 * 3. contain any characters that would need to be encoded for use in URLs.
 * 4. resemble the word `node_modules` or `favicon.ico` (case doesn't matter).
 * but only the rule *1* is addressed by this function as the other ones doesn't
 * have a canonical representation.
 */
const resolvePackageName = (path: string): string => {
  const { base: baseFilename, dir: dirname } = parse(path);
  if (baseFilename === ".") {
    return basename(process.cwd());
  }
  // If is as a package with scope (https://docs.npmjs.com/misc/scope)
  if (dirname.match(/^@[^\s]/)) {
    return `${dirname}/${baseFilename}`;
  }
  return baseFilename;
};

const transform = (options: Partial<ApplicationOptions>): ApplicationOptions => {
  const name = resolvePackageName(toKebabCase(options.name?.toString() ?? DEFAULT_APP_NAME));

  return {
    ...options,
    name,
    version: options.version ?? DEFAULT_VERSION,
    author: options.author ?? DEFAULT_AUTHOR,
    description: options.description ?? DEFAULT_DESCRIPTION,
    directory: options.directory ?? name,
    language: options.language ?? DEFAULT_LANGUAGE,
    strict: options.strict ?? true,
    packageManager: options.packageManager ?? DEFAULT_PACKAGE_MANAGER,
    dependencies: options.dependencies ?? "",
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

const main = (rawOptions: Partial<ApplicationOptions>): Rule => {
  const options = transform(rawOptions);

  return mergeWith(generate(options, options.directory));
};

export default main;
