// Reproduces the content owner's Pack validation inside the app's own toolchain: every fixture record against its schema (Ajv). UNRUN in the authoring sandbox.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { makeAjvValidator } from "../tests/support/ajv-validator.ts";

const v = makeAjvValidator("schemas/exchange");
const read = (n: string): any => JSON.parse(readFileSync(join("fixtures/pack-v0.9", n), "utf8"));
const checks: [string, string, string][] = [
  ["ATHENA_DOMAIN_MAP_v0.3.json", "domains", "DOMAIN_RECORD"], ["ATHENA_DOMAIN_MAP_v0.3.json", "skill_families", "SKILL_FAMILY_RECORD"],
  ["ATHENA_SKILL_SEED_v0.3.json", "skills", "SKILL_RECORD"], ["ATHENA_SUBSKILL_SEED_v0.2.json", "subskills", "SUBSKILL_RECORD"],
  ["ATHENA_MICRO_SKILL_REGISTRY_v0.3.json", "records", "MICRO_SKILL"], ["ATHENA_RELATIONSHIP_SEED_v0.3.json", "edges", "KNOWLEDGE_RELATIONSHIP"],
  ["ATHENA_CROSS_DOMAIN_TRANSFER_v0.3.json", "transfers", "TRANSFER_LINK"], ["ATHENA_CROSS_DOMAIN_TRANSFER_v0.3.json", "context_registry", "CONTEXT_RECORD"],
];
let n = 0;
let bad = 0;
for (const [file, key, schema] of checks) {
  for (const [i, rec] of (read(file)[key] as unknown[]).entries()) {
    n += 1;
    const issues = v.validate(schema, rec, `${file}:${key}[${i}]`);
    if (issues.length) {
      bad += 1;
      console.error(issues[0]!.path, issues[0]!.message);
    }
  }
}
console.log(`validated ${n} records, ${bad} failing`);
process.exit(bad ? 1 : 0);
