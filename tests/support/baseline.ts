import { buildPlan, commitPlan, type ExchangePackage } from "../../src/app/importer.ts";
import { MemoryStore } from "../../src/domain/store.ts";
import { emptyState } from "../../src/domain/types.ts";
import { makeDeps, packFiles, pkg } from "./fixtures.ts";
import type { ImportDeps } from "../../src/app/importer.ts";

type Rec = Record<string, any>;
export const files = packFiles();
export const byId = (list: Rec[], id: string): Rec => {
  const r = list.find((x) => x["id"] === id);
  if (!r) throw new Error(`fixture ${id} not found`);
  return structuredClone(r);
};
export const SKILLS: Rec[] = files.skills["skills"] as Rec[];
export const DOMAINS: Rec[] = files.domainMap["domains"] as Rec[];
export const FAMILIES: Rec[] = files.domainMap["skill_families"] as Rec[];
export const DISCS: Rec[] = files.disciplines["disciplines"] as Rec[];

/** Real seed records, closed over their parents, so baseline data is schema-valid by construction. */
export function baselinePackage(skillIds: string[] = ["ATH-SKILL-MATH-NUMBER-ALGEBRA", "ATH-SKILL-MATH-SCIENTIFIC-REASONING"]): ExchangePackage {
  const skills = skillIds.map((id) => byId(SKILLS, id));
  const familyIds = [...new Set(skills.map((s) => s["skill_family_id"]).filter(Boolean) as string[])];
  const families = familyIds.map((id) => byId(FAMILIES, id));
  const domainIds = [...new Set([...skills.map((s) => s["primary_domain_id"] as string), ...families.map((f) => f["parent_id"] as string)])];
  const domains = domainIds.map((id) => byId(DOMAINS, id));
  const discIds = [...new Set(domains.map((d) => d["owner_discipline_id"] as string))];
  const disciplines = discIds.map((id) => byId(DISCS, id));
  const cleaned = skills.map((s) => ({ ...s, subskill_ids: [], prerequisite_ids: [], objective_ids: [], concept_ids: [] }));
  return pkg({ disciplines, nodes: [...domains, ...families, ...cleaned] }, "pkg-baseline") as ExchangePackage;
}
/** A new, schema-valid skill with an unused code, cloned from a real seed record. */
export function newSkill(code: string, title = "Test-only skill"): Rec {
  const s = byId(SKILLS, "ATH-SKILL-MATH-NUMBER-ALGEBRA");
  return { ...s, id: code, title, subskill_ids: [], prerequisite_ids: [], objective_ids: [], concept_ids: [] };
}
export async function seeded(extra?: ExchangePackage): Promise<{ store: MemoryStore; deps: ImportDeps }> {
  const deps = makeDeps();
  const store = new MemoryStore(emptyState("device-test"));
  for (const p of [baselinePackage(), ...(extra ? [extra] : [])]) {
    const plan = await buildPlan(await store.load(), p, deps);
    if (!plan.ok) throw new Error("baseline failed: " + JSON.stringify(plan.issues.filter((i) => i.severity === "error").slice(0, 3)));
    await commitPlan(store, plan, "approve", deps);
  }
  return { store, deps };
}
