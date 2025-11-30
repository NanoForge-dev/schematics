export interface PartBaseOptions {
  /**
   * NanoForge application name
   */
  name: string;

  /**
   * The part of the application to generate
   */
  part: "client" | "server";

  /**
   * App class name
   */
  appClass: string;

  /**
   * NanoForge Application language
   */
  language: "js" | "ts";

  /**
   * Add init functions to the application
   */
  initFunctions: boolean;
}
