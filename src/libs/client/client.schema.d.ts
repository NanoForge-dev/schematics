export interface ClientSchema {
  /**
   * NanoForge application name
   */
  name: string;

  /**
   * NanoForge application destination directory
   */
  directory?: string;

  /**
   * NanoForge Application language
   */
  language?: "js" | "ts";

  /**
   * Add init functions to the application
   */
  initFunctions?: boolean;
}
