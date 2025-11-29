export interface BasePartSchema {
  /**
   * NanoForge application name
   */
  name: string;

  /**
   * The part of the application to generate
   */
  part: "client" | "server";

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
