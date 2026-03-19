import { InitFunctionEnum } from "@utils/main/enums";
import { joinRelative } from "@utils/path";

import { LIBS_FUNCTIONS_NAME } from "./const";
import {
  type SaveComponent,
  type SaveEntity,
  type SaveLibrary,
  SaveLibraryTypeEnum,
  type SaveSystem,
} from "./save.type";

export class MainGenerator {
  private buffer = "";
  private indentation = 0;
  private readonly editor: boolean;
  private readonly pathToRoot: string;

  constructor(editor: boolean = false, pathToRoot: string = "") {
    this.editor = editor;
    this.pathToRoot = pathToRoot;
  }

  toString(): string {
    return this.buffer;
  }

  generateBaseImports(hasTypes: boolean): MainGenerator {
    if (this.editor) {
      if (hasTypes)
        this.writeLine(
          `import { type IEditorRunOptions, NanoforgeFactory } from "@nanoforge-dev/core-editor";`,
        );
      else this.writeLine(`import { NanoforgeFactory } from "@nanoforge-dev/core-editor";`);
    } else {
      if (hasTypes) this.writeLine(`import { type IRunOptions } from "@nanoforge-dev/common";`);
      this.writeLine(`import { NanoforgeFactory } from "@nanoforge-dev/core";`);
    }

    this.endSection();
    return this;
  }

  generateLibsImports(libs: SaveLibrary[]): MainGenerator {
    return this.generateImports(libs, false);
  }

  generateComponentsImports(libs: SaveComponent[]): MainGenerator {
    return this.generateImports(libs, true);
  }

  generateSystemsImports(libs: SaveSystem[]): MainGenerator {
    return this.generateImports(libs, true);
  }

  generateMainFunction(hasTypes: boolean, cb: (generator: MainGenerator) => void): MainGenerator {
    if (this.editor)
      this.writeLine(
        `export async function main(options${hasTypes ? ": IEditorRunOptions" : ""}) {`,
      );
    else this.writeLine(`export async function main(options${hasTypes ? ": IRunOptions" : ""}) {`);
    this.indentation += 1;
    cb(this);
    this.indentation -= 1;
    this.writeLine("}");
    return this;
  }

  generateApp(isServer: boolean): MainGenerator {
    this.writeLine(`const app = NanoforgeFactory.create${isServer ? "Server" : "Client"}();`);
    this.endSection();
    return this;
  }

  generateAppInit(): MainGenerator {
    this.writeLine(`await app.init(options);`);
    this.endSection();
    return this;
  }

  generateAppRun(hasInitFunctions: boolean): MainGenerator {
    this.writeLine(`await app.run();`);
    if (hasInitFunctions) this.endSection();
    return this;
  }

  generateLibsInstances(libs: SaveLibrary[]): MainGenerator {
    libs.forEach(({ id, name }) => this.writeLine(`const ${id} = new ${name}();`));
    this.endSection();
    return this;
  }

  generateLibsInit(libs: SaveLibrary[]): MainGenerator {
    libs.forEach(({ id, type }) => this.writeLine(this.getInitFunction(id, type)));
    this.endSection();
    return this;
  }

  generateRegistry(libs: SaveLibrary[]): MainGenerator {
    const libName =
      libs.find((lib) => lib.type === SaveLibraryTypeEnum.COMPONENT_SYSTEM)?.id ?? "ecsLibrary";
    this.writeLine(`const registry = ${libName}.registry;`);
    this.endSection();
    return this;
  }

  generateEntities(entities: SaveEntity[]): MainGenerator {
    entities.forEach((entity, index) => this.generateEntity(entity, index));
    return this;
  }

  generateSystems(systems: SaveSystem[]): MainGenerator {
    systems.forEach(({ name }) => this.writeLine(`registry.addSystem(${name});`));
    this.endSection();
    return this;
  }

  generateInitFunctionIfNeeded(needed: boolean, func: InitFunctionEnum): MainGenerator {
    if (needed) return this.generateInitFunction(func);
    return this;
  }

  generateInitFunctionsImportsIfNeeded(needed: boolean): MainGenerator {
    if (!needed) return this;
    return this.generateImports(
      [
        { name: "afterInit", path: "./init/after-init" },
        { name: "afterRegistryInit", path: "./init/after-registry-init" },
        { name: "afterRun", path: "./init/after-run" },
        { name: "beforeInit", path: "./init/before-init" },
        { name: "beforeRegistryInit", path: "./init/before-registry-init" },
        { name: "beforeRun", path: "./init/before-run" },
      ],
      true,
    );
  }

  private generateInitFunction(func: InitFunctionEnum): MainGenerator {
    const params = ["app"];
    if (
      [InitFunctionEnum.BEFORE_REGISTRY_INIT, InitFunctionEnum.AFTER_REGISTRY_INIT].includes(func)
    )
      params.push("registry");
    this.writeLine(`await ${func}(${params.join(", ")});`);
    if (func !== InitFunctionEnum.AFTER_RUN) this.endSection();
    return this;
  }

  private generateImports(els: { name: string; path: string }[], relative: boolean): MainGenerator {
    els
      .sort((a, b) => a.path.localeCompare(b.path))
      .forEach(({ name, path }) =>
        this.writeLine(
          `import { ${name} } from "${relative ? joinRelative(this.pathToRoot, path) : path}";`,
        ),
      );
    this.endSection();
    return this;
  }

  private generateEntity(entity: SaveEntity, entityIndex: number): void {
    this.writeLine(`const ${entity.id} = registry.spawnEntity();`);
    entity.components.forEach(({ name, params: rawParams }, componentIndex) => {
      const params = !this.editor
        ? rawParams
        : rawParams.map(
            (_param, index) =>
              `options.editor.save.entities[${entityIndex}].components[${componentIndex}].params[${index}].value`,
          );
      this.writeLine(`registry.addComponent(${entity.id}, new ${name}(${params.join(", ")}));`);
    });
    this.endSection();
  }

  private getInitFunction(name: string, type: SaveLibraryTypeEnum | string): string {
    const baseName = LIBS_FUNCTIONS_NAME[type];
    if (baseName) return `app.${baseName}(${name});`;
    return `app.use(Symbol("${type}"), ${name});`;
  }

  private writeLine(text: string, indentation = true): void {
    const line = `${" ".repeat(indentation ? this.indentation * 2 : 0)}${text}\n`;
    this.buffer += line;
  }

  private endSection(): void {
    this.writeLine("");
  }
}
