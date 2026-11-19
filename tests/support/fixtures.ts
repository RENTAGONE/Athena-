import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { RelationRegistry, NamespaceRegistry } from "../../src/domain/registries.ts";
import { SeqIdGen } from "../../src/domain/ids.ts";
import { emptyState, type DbState } from "../../src/domain/types.ts";
import { MemoryStore } from "../../src/domain/store.ts";
import { MiniValidator, loadSchemas } from "./mini-validator.ts";
import { namespacesOf, relationTypesOf, type PackFiles } from "../../src/adapters/formats/pack.ts";
import type { ImportDeps } from "../../src/app/importer.ts";
import type { ExchangeValidator } from "../../src/domain/validator.ts";

const ajvMod = process.env["VALIDATOR"] === "ajv" ? await import("./ajv-validator.ts") : null;

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const read = (rel: string): any => JSON.parse(readFileSync(join(root, rel), "utf8"));
export const packFiles = (): PackFiles => {
  const f = (n: string): any => read(`fixtures/pack-v0.9/${n}`);
  return {
    disciplines: f("DISCIPLINE_REGISTRY.json"), domainMap: f("ATHENA_DOMAIN_MAP_v0.3.json"), skills: f("ATHENA_SKILL_SEED_v0.3.json"), subskills: f("ATHENA_SUBSKILL_SEED_v0.2.json"),
    objectives: f("LEARNING_OBJECTIVE_SEED_v0.2.json"), units: f("LEARNING_UNIT_SEED_v0.2.json"), assessments: f("ASSESSMENT_SEED_v0.2.json"), foundation: f("FOUNDATION_NODE_SEED_v0.2.json"),
    micro: f("ATHENA_MICRO_SKILL_REGISTRY_v0.3.json"), relationships: f("ATHENA_RELATIONSHIP_SEED_v0.3.json"), transfers: f("ATHENA_CROSS_DOMAIN_TRANSFER_v0.3.json"),
    relationTypes: f("RELATIONSHIP_TYPE_REGISTRY_v0.2.json"), namespaces: f("ID_NAMESPACE_REGISTRY_v0.2.json"),
  };
};
export function makeValidator(): ExchangeValidator {
  if (ajvMod) return ajvMod.makeAjvValidator(join(root, "schemas", "exchange"));
  return new MiniValidator(loadSchemas(join(root, "schemas", "exchange")));
}
export function makeDeps(validator: ExchangeValidator = makeValidator()): ImportDeps {
  const pf = packFiles();
  let tick = 0;
  return { validator, relations: new RelationRegistry(relationTypesOf(pf)), namespaces: new NamespaceRegistry(namespacesOf(pf)), ids: new SeqIdGen(), now: () => `2026-11-17T12:00:${String(tick++ % 60).padStart(2, "0")}.000Z` };
}
export function freshStore(): { store: MemoryStore; state: () => Promise<DbState> } {
  const store = new MemoryStore(emptyState("device-test"));
  return { store, state: () => store.load() };
}
export const pkg = (over: Record<string, unknown>, id = "pkg-test"): any => ({ athena_package: "0.1", package_id: id, generated_by: { tool: "test-fixture" }, is_sample: true, ...over });
