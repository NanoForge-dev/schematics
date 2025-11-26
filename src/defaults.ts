export const DEFAULT_APP_NAME = "nanoforge-app";
export const DEFAULT_VERSION = "0.0.0";
export const DEFAULT_AUTHOR = "";
export const DEFAULT_DESCRIPTION = "";
export const DEFAULT_LANGUAGE = "ts";
export const DEFAULT_PACKAGE_MANAGER = "npm";
export const DEFAULT_CONFIG = {
  client: {
    build: {
      entryFile: "client/main.ts",
      outDir: ".nanoforge/client",
    },
    runtime: {
      dir: ".nanoforge/client",
    },
  },
};
export const DEFAULT_SERVER_CONFIG = {
  server: {
    enable: true,
    build: {
      entryFile: "server/main.ts",
      outDir: ".nanoforge/server",
    },
    runtime: {
      dir: ".nanoforge/server",
    },
  },
};
