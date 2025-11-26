import { type Config } from "@utils/config/config.type";
import { deepMerge } from "@utils/object";
import { type DeepPartial } from "@utils/type";

import { DEFAULT_CONFIG, DEFAULT_SERVER_CONFIG } from "~/defaults";

export class ConfigDeclarator {
  public declare(baseContent: string, options: DeepPartial<Config>): string {
    const content = JSON.parse(baseContent);
    const hasServer = content.server?.enable ?? options.server?.enable ?? false;
    return JSON.stringify(
      deepMerge(
        DEFAULT_CONFIG,
        hasServer ? DEFAULT_SERVER_CONFIG : undefined,
        baseContent,
        options,
      ),
      null,
      2,
    );
  }
}
