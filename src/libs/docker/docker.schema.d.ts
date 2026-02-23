export interface DockerSchema {
  /**
   * NanoForge application name
   */
  name: string;

  /**
   * NanoForge application package manager
   */
  packageManager: "npm" | "yarn" | "pnpm" | "bun";

  /**
   * Target directory for generated Docker files
   */
  directory?: string;
}
