// Precompiles the Pack's JSON Schemas into standalone validator code so the browser never needs runtime code generation (strict CSP, ADR-007).
// UNRUN in the authoring sandbox (Ajv could not be installed offline). Output: src/generated/validators.js
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import Ajv from "ajv/dist/2020.js";
import standaloneCode from "ajv/dist/standalone/index.js";

const dir = "schemas/exchange";
const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: false, code: { source: true, esm: true } });
const refs = {};
for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
  const key = f.replace(/\.schema.*\.json$/, "");
  const schema = JSON.parse(readFileSync(join(dir, f), "utf8"));
  ajv.addSchema(schema, key);
  refs[key] = key;
}
mkdirSync("src/generated", { recursive: true });
writeFileSync("src/generated/validators.js", standaloneCode(ajv, refs));
console.log(`built ${Object.keys(refs).length} standalone validators (string formats are not validated in the browser build)`);
