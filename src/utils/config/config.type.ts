interface BuildConfig {
  entryFile: string;
  outDir: string;
}

interface RunConfig {
  dir: string;
}

interface ClientConfig {
  port: string;
  gameExposurePort: string;
  build: BuildConfig;
  runtime: RunConfig;
}

interface ServerConfig {
  enable: boolean;
  port: string;
  build: BuildConfig;
  runtime: RunConfig;
}

export interface Config {
  client: ClientConfig;
  server: ServerConfig;
}
