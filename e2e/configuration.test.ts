import { SchematicTestRunner, type UnitTestTree } from "@angular-devkit/schematics/testing";
import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

const collectionPath = resolve(__dirname, "../dist/collection.json");

describe("configuration schematic", () => {
  const runner = new SchematicTestRunner("schematics", collectionPath);

  describe("on an empty tree", () => {
    let tree: UnitTestTree;
    let config: Record<string, any>;

    beforeAll(async () => {
      tree = await runner.runSchematic("configuration", { name: "my-app" });
      config = JSON.parse(tree.readContent("/my-app/nanoforge.config.json"));
    });

    it("should generate nanoforge.config.json", () => {
      expect(tree.files).toContain("/my-app/nanoforge.config.json");
    });

    it("should create a valid JSON config file", () => {
      expect(() => JSON.parse(tree.readContent("/my-app/nanoforge.config.json"))).not.toThrow();
    });

    it("should include default client build config", () => {
      expect(config.client).toBeDefined();
      expect(config.client.build.entryFile).toBe("client/main.ts");
      expect(config.client.build.outDir).toBe(".nanoforge/client");
    });

    it("should include default client runtime config", () => {
      expect(config.client.runtime.dir).toBe(".nanoforge/client");
    });

    it("should have server disabled", () => {
      expect(config.server.enable).toBe(false);
    });
  });

  describe("with server enabled", () => {
    let tree: UnitTestTree;
    let config: Record<string, any>;

    beforeAll(async () => {
      tree = await runner.runSchematic("configuration", {
        name: "my-app",
        server: true,
      });
      config = JSON.parse(tree.readContent("/my-app/nanoforge.config.json"));
    });

    it("should generate config file", () => {
      expect(tree.files).toContain("/my-app/nanoforge.config.json");
    });

    it("should include server config with enable flag", () => {
      expect(config.server).toBeDefined();
      expect(config.server.enable).toBe(true);
    });

    it("should include server build config", () => {
      expect(config.server.build.entryFile).toBe("server/main.ts");
      expect(config.server.build.outDir).toBe(".nanoforge/server");
    });

    it("should include server runtime config", () => {
      expect(config.server.runtime.dir).toBe(".nanoforge/server");
    });

    it("should still include client config", () => {
      expect(config.client).toBeDefined();
      expect(config.client.build.entryFile).toBe("client/main.ts");
    });
  });

  describe("with custom directory", () => {
    it("should generate config in the specified directory", async () => {
      const tree = await runner.runSchematic("configuration", {
        name: "my-app",
        directory: "custom-dir",
      });
      expect(tree.files).toContain("/custom-dir/nanoforge.config.json");
    });
  });
});
