interface BuildConfigurationSchema {
  /**
   * Entry file of the application
   */
  entryFile?: string;

  /**
   * Output directory of the application
   */
  outDir?: string;
}

interface RunConfigurationSchema {
  /**
   * Directory of the application
   */
  dir?: string;
}

export interface ConfigurationSchema {
  /**
   * The name of the application
   */
  name: string;

  /**
   * NanoForge application destination directory
   */
  directory?: string;

  /**
   * Client configuration
   */
  client?: {
    /**
     * Client port
     */
    port?: string;

    /**
     * Game exposure port
     */
    gameExposurePort?: string;

    /**
     * Build configuration
     */
    build?: BuildConfigurationSchema;

    /**
     * Runtime configuration
     */
    runtime?: RunConfigurationSchema;
  };

  /**
   * Server configuration
   */
  server?: {
    /**
     * Enable server configuration
     */
    enable?: boolean;

    /**
     * Server port
     */
    port?: string;

    /**
     * Build configuration
     */
    build?: BuildConfigurationSchema;

    /**
     * Runtime configuration
     */
    runtime?: RunConfigurationSchema;
  };
}
