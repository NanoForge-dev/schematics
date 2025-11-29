import { type NanoforgeClient } from "@nanoforge-dev/core";
import { type Registry } from "@nanoforge-dev/ecs";

export async function beforeRegistryInit(app: NanoforgeClient, registry: Registry) {
  // Actions before registry components, entities and systems initialization
}
