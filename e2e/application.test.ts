import { SchematicTestRunner, type UnitTestTree } from "@angular-devkit/schematics/testing";
import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

const collectionPath = resolve(__dirname, "../dist/collection.json");

describe("application schematic", () => {
  const runner = new SchematicTestRunner("schematics", collectionPath);

  describe("with TypeScript (default)", () => {
    let tree: UnitTestTree;

    beforeAll(async () => {
      tree = await runner.runSchematic("application", { name: "my-app" });
    });

    it("should generate project files", () => {
      expect(tree.files).toContain("/my-app/package.json");
      expect(tree.files).toContain("/my-app/tsconfig.json");
      expect(tree.files).toContain("/my-app/eslint.config.js");
      expect(tree.files).toContain("/my-app/prettier.config.js");
      expect(tree.files).toContain("/my-app/README.md");
    });

    it("should set the project name in package.json", () => {
      const packageJson = JSON.parse(tree.readContent("/my-app/package.json"));
      expect(packageJson.name).toBe("my-app");
    });

    it("should not include ecs-server by default", () => {
      const packageJson = JSON.parse(tree.readContent("/my-app/package.json"));
      expect(packageJson.devDependencies["@nanoforge-dev/ecs-server"]).toBeUndefined();
    });
  });

  describe("with JavaScript", () => {
    let tree: UnitTestTree;

    beforeAll(async () => {
      tree = await runner.runSchematic("application", {
        name: "js-app",
        language: "js",
      });
    });

    it("should generate JS project files", () => {
      expect(tree.files).toContain("/js-app/package.json");
      expect(tree.files).toContain("/js-app/jsconfig.json");
      expect(tree.files).not.toContain("/js-app/tsconfig.json");
    });
  });

  describe("with server enabled", () => {
    let tree: UnitTestTree;

    beforeAll(async () => {
      tree = await runner.runSchematic("application", {
        name: "server-app",
        server: true,
      });
    });

    it("should include ecs-server dependency", () => {
      const packageJson = JSON.parse(tree.readContent("/server-app/package.json"));
      expect(packageJson.devDependencies["@nanoforge-dev/ecs-server"]).toBeDefined();
    });
  });

  describe("with custom options", () => {
    let tree: UnitTestTree;

    beforeAll(async () => {
      tree = await runner.runSchematic("application", {
        name: "custom-app",
        version: "1.2.3",
        author: "Test Author",
        description: "A test project",
      });
    });

    it("should apply custom options to package.json", () => {
      const packageJson = JSON.parse(tree.readContent("/custom-app/package.json"));
      expect(packageJson.version).toBe("1.2.3");
      expect(packageJson.author).toBe("Test Author");
      expect(packageJson.description).toBe("A test project");
    });
  });

  describe("with custom directory", () => {
    it("should generate files in the specified directory", async () => {
      const tree = await runner.runSchematic("application", {
        name: "my-app",
        directory: "custom-dir",
      });
      expect(tree.files).toContain("/custom-dir/package.json");
    });
  });

  describe("with PascalCase name", () => {
    it("should convert name to kebab-case", async () => {
      const tree = await runner.runSchematic("application", {
        name: "myApp",
      });
      expect(tree.files).toContain("/my-app/package.json");
      const packageJson = JSON.parse(tree.readContent("/my-app/package.json"));
      expect(packageJson.name).toBe("my-app");
    });
  });
});
