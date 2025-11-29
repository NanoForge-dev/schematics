export interface ClientOptions {
  /**
   * NanoForge application name
   */
  name: string;

  /**
   * NanoForge Application language
   */
  language: "js" | "ts";

  /**
   * Add init functions to the application
   */
  initFunctions: boolean;
}
