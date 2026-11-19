import type { ExchangePackage } from "../../app/importer.ts";
import type { RelationType, Namespace } from "../../domain/registries.ts";

type Rec = Record<string, unknown>;
/** Inputs are the parsed Pack v0.9 registry files. Pure mapping; no I/O. */
export interface PackFiles {
  disciplines: Rec;
  domainMap: Rec;
  skills: Rec;
  subskills: Rec;
  objectives: Rec;
  units: Rec;
  assessments: Rec;
  foundation: Rec;
  micro: Rec;
  relationships: Rec;
  transfers: Rec;
  relationTypes: Rec;
  namespaces: Rec;
}
const arr = (o: Rec, k: string): Rec[] => (o[k] as Rec[] | undefined) ?? [];

/** Historical foundation-seed domain mirrors are provenance only and are exempt from duplicate detection (N-11). */
export function currentFoundationNodes(foundation: Rec): Rec[] {
  return arr(foundation, "nodes").filter((n) => n["record_stage"] !== "domain_map_mirror");
}

export function packToPackages(f: PackFiles, packageId: string, generatedAt: string): ExchangePackage {
  const disciplines = arr(f.disciplines, "disciplines");
  const nodes: Rec[] = [
    ...arr(f.domainMap, "domains"),
    ...arr(f.domainMap, "skill_families"),
    ...arr(f.skills, "skills"),
    ...arr(f.subskills, "subskills"),
    ...currentFoundationNodes(f.foundation),
    ...arr(f.objectives, "objectives"),
    ...arr(f.units, "units"),
    ...arr(f.assessments, "assessments"),
  ];
  return {
    athena_package: "0.1",
    package_id: packageId,
    generated_by: { tool: "pack-v0.9-adapter", generated_at: generatedAt },
    disciplines,
    nodes,
    micro_skills: arr(f.micro, "records"),
    contexts: arr(f.transfers, "context_registry"),
    relationships: arr(f.relationships, "edges"),
    transfer_links: arr(f.transfers, "transfers"),
  };
}
export function relationTypesOf(f: PackFiles): RelationType[] {
  return arr(f.relationTypes, "types") as unknown as RelationType[];
}
export function namespacesOf(f: PackFiles): Namespace[] {
  return arr(f.namespaces, "namespaces") as unknown as Namespace[];
}
