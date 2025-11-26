interface BuildConfigurationOptions {
  /**
   * Entry file of the application
   */
  entryFile?: string;

  /**
   * Output directory of the application
   */
  outDir?: string;
}

interface RunConfigurationOptions {
  /**
   * Directory of the application
   */
  dir?: string;
}

export interface ConfigurationOptions {
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
