// CI-only binding (UNRUN in the authoring sandbox: Ajv could not be installed offline). Uses Ajv 2020-12 with the schemas vendored in /schemas/exchange.
// NOTE: Ajv's default compilation uses new Function(); the strict-CSP production path precompiles validators at build time (tools/build-validators.mjs).
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import type { ExchangeValidator } from "../../src/domain/validator.ts";
import type { Issue } from "../../src/domain/types.ts";

export function makeAjvValidator(dir: string): ExchangeValidator {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const keys = new Map<string, string>();
  for (const f of readdirSync(dir).filter((x: string) => x.endsWith(".json"))) {
    const schema = JSON.parse(readFileSync(join(dir, f), "utf8"));
    ajv.addSchema(schema, f);
    keys.set(f.replace(/\.schema.*\.json$/, ""), f);
  }
  return {
    has: (k) => keys.has(k),
    validate(k, record, path): Issue[] {
      const fn = ajv.getSchema(keys.get(k)!);
      if (!fn) return [{ severity: "error", code: "no_schema", path, message: `no schema ${k}` }];
      return fn(record) ? [] : (fn.errors ?? []).map((e: { instancePath: string; message?: string }) => ({ severity: "error" as const, code: "schema", path: `${path}${e.instancePath.replace(/\//g, ".")}`, message: `${e.instancePath || "$"} ${e.message}` }));
    },
  };
}
