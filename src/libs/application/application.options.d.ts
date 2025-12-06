export interface ApplicationOptions {
  /**
   * NanoForge application name
   */
  name: string;

  /**
   * NanoForge application version
   */
  version: string;

  /**
   * NanoForge application author
   */
  author: string;

  /**
   * NanoForge application description
   */
  description: string;

  /**
   * NanoForge Application language
   */
  language: "js" | "ts";

  /**
   * With strict mode (TypeScript or JavaScript but only on compatible editor)
   */
  strict: boolean;

  /**
   * The used package manager
   */
  packageManager: "npm" | "yarn" | "pnpm" | "bun";

  /**
   * Configure a server for the application
   */
  server: boolean;
}
