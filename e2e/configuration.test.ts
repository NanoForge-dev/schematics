import { SchematicTestRunner, type UnitTestTree } from "@angular-devkit/schematics/testing";
import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

const collectionPath = resolve(__dirname, "../dist/collection.json");

describe("configuration schematic", () => {
  const runner = new SchematicTestRunner("schematics", collectionPath);

  describe("on an empty tree", () => {
    let tree: UnitTestTree;

    beforeAll(async () => {
      tree = await runner.runSchematic("configuration", { name: "my-app" });
    });

    it("should generate nanoforge.config.json", () => {
      expect(tree.files).toContain("/my-app/nanoforge.config.json");
    });

    it("should create a valid JSON config file", () => {
      const content = tree.readContent("/my-app/nanoforge.config.json");
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });

  describe("with server enabled", () => {
    let tree: UnitTestTree;

    beforeAll(async () => {
      tree = await runner.runSchematic("configuration", {
        name: "my-app",
        server: true,
      });
    });

    it("should generate config file", () => {
      expect(tree.files).toContain("/my-app/nanoforge.config.json");
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
