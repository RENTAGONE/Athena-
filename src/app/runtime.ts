// Application runtime: wires the Dexie store, precompiled validators and registries. UNRUN in the authoring sandbox.
import { DexieStore } from "../adapters/store-dexie.ts";
import { precompiledValidator } from "../adapters/validator-precompiled.ts";
import { DefaultIdGen } from "../domain/ids.ts";
import { NamespaceRegistry, RelationRegistry, type Namespace, type RelationType } from "../domain/registries.ts";
import { packToPackages, type PackFiles } from "../adapters/formats/pack.ts";
import relationTypes from "../../fixtures/pack-v0.9/RELATIONSHIP_TYPE_REGISTRY_v0.2.json";
import namespaces from "../../fixtures/pack-v0.9/ID_NAMESPACE_REGISTRY_v0.2.json";
import type { ExchangePackage, ImportDeps } from "./importer.ts";

export interface Runtime {
  store: DexieStore;
  deps: ImportDeps;
}
export async function createRuntime(): Promise<Runtime> {
  const store = new DexieStore();
  await store.ensureDeviceId();
  const deps: ImportDeps = {
    validator: precompiledValidator,
    relations: new RelationRegistry((relationTypes as { types: RelationType[] }).types),
    namespaces: new NamespaceRegistry((namespaces as { namespaces: Namespace[] }).namespaces),
    ids: new DefaultIdGen(),
    now: () => new Date().toISOString(),
  };
  return { store, deps };
}

/** The bundled Pack v0.9 draft seed. Loaded lazily (its own chunk) so it never weighs on the app shell. */
export async function loadSeedPackage(): Promise<ExchangePackage> {
  const j = async <T>(p: Promise<{ default: T }>): Promise<T> => (await p).default;
  const files: PackFiles = {
    disciplines: await j(import("../../fixtures/pack-v0.9/DISCIPLINE_REGISTRY.json")),
    domainMap: await j(import("../../fixtures/pack-v0.9/ATHENA_DOMAIN_MAP_v0.3.json")),
    skills: await j(import("../../fixtures/pack-v0.9/ATHENA_SKILL_SEED_v0.3.json")),
    subskills: await j(import("../../fixtures/pack-v0.9/ATHENA_SUBSKILL_SEED_v0.2.json")),
    objectives: await j(import("../../fixtures/pack-v0.9/LEARNING_OBJECTIVE_SEED_v0.2.json")),
    units: await j(import("../../fixtures/pack-v0.9/LEARNING_UNIT_SEED_v0.2.json")),
    assessments: await j(import("../../fixtures/pack-v0.9/ASSESSMENT_SEED_v0.2.json")),
    foundation: await j(import("../../fixtures/pack-v0.9/FOUNDATION_NODE_SEED_v0.2.json")),
    micro: await j(import("../../fixtures/pack-v0.9/ATHENA_MICRO_SKILL_REGISTRY_v0.3.json")),
    relationships: await j(import("../../fixtures/pack-v0.9/ATHENA_RELATIONSHIP_SEED_v0.3.json")),
    transfers: await j(import("../../fixtures/pack-v0.9/ATHENA_CROSS_DOMAIN_TRANSFER_v0.3.json")),
    relationTypes: relationTypes as unknown as Record<string, unknown>,
    namespaces: namespaces as unknown as Record<string, unknown>,
  };
  return packToPackages(files, "pack-v0.9-draft-seed", "2026-11-17T00:00:00Z");
}
