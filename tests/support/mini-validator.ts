// TEST-ONLY stand-in for Ajv, so the offline sandbox can execute the suite. It implements just the keywords the Pack v0.9 schemas use.
// CI runs the same suite with VALIDATOR=ajv (see ajv-validator.ts). Passing here does NOT prove Ajv or CSP compatibility.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { ExchangeValidator } from "../../src/domain/validator.ts";
import type { Issue } from "../../src/domain/types.ts";

type S = Record<string, any>;
const typeOk = (v: unknown, t: string): boolean =>
  t === "string" ? typeof v === "string" : t === "integer" ? Number.isInteger(v) : t === "number" ? typeof v === "number" : t === "boolean" ? typeof v === "boolean" : t === "array" ? Array.isArray(v) : t === "object" ? v !== null && typeof v === "object" && !Array.isArray(v) : t === "null" ? v === null : true;

export function errors(s: S | boolean, v: any, path = "$"): string[] {
  if (s === true) return [];
  if (s === false) return [`${path}: schema is false`];
  const out: string[] = [];
  if (s.type) {
    const ts: string[] = Array.isArray(s.type) ? s.type : [s.type];
    if (!ts.some((t) => typeOk(v, t))) return [`${path}: wrong type, expected ${ts.join("|")}`];
  }
  if ("const" in s && JSON.stringify(v) !== JSON.stringify(s.const)) out.push(`${path}: must equal ${JSON.stringify(s.const)}`);
  if (s.enum && !s.enum.some((e: unknown) => JSON.stringify(e) === JSON.stringify(v))) out.push(`${path}: '${String(v).slice(0, 40)}' is not an allowed value`);
  if (typeof v === "string") {
    if (s.minLength !== undefined && v.length < s.minLength) out.push(`${path}: shorter than ${s.minLength}`);
    if (s.maxLength !== undefined && v.length > s.maxLength) out.push(`${path}: longer than ${s.maxLength}`);
    if (s.pattern && !new RegExp(s.pattern).test(v)) out.push(`${path}: '${v.slice(0, 50)}' does not match ${s.pattern}`);
  }
  if (typeof v === "number") {
    if (s.minimum !== undefined && v < s.minimum) out.push(`${path}: below ${s.minimum}`);
    if (s.maximum !== undefined && v > s.maximum) out.push(`${path}: above ${s.maximum}`);
  }
  if (Array.isArray(v)) {
    if (s.minItems !== undefined && v.length < s.minItems) out.push(`${path}: fewer than ${s.minItems} items`);
    if (s.maxItems !== undefined && v.length > s.maxItems) out.push(`${path}: more than ${s.maxItems} items`);
    if (s.uniqueItems && new Set(v.map((x: unknown) => JSON.stringify(x))).size !== v.length) out.push(`${path}: items must be unique`);
    if (s.items) v.forEach((x, i) => out.push(...errors(s.items, x, `${path}[${i}]`)));
  } else if (v !== null && typeof v === "object") {
    for (const r of s.required ?? []) if (!(r in v)) out.push(`${path}: '${r}' is required`);
    const props: S = s.properties ?? {};
    for (const [k, sub] of Object.entries(props)) if (k in v) out.push(...errors(sub as S, v[k], `${path}.${k}`));
    if (s.additionalProperties === false) for (const k of Object.keys(v)) if (!(k in props)) out.push(`${path}: unexpected property '${k}'`);
  }
  for (const sub of s.allOf ?? []) out.push(...errors(sub, v, path));
  if (s.anyOf && !s.anyOf.some((sub: S) => errors(sub, v, path).length === 0)) out.push(`${path}: matches none of anyOf`);
  if (s.oneOf) {
    const n = s.oneOf.filter((sub: S) => errors(sub, v, path).length === 0).length;
    if (n !== 1) out.push(`${path}: matches ${n} of oneOf, needs exactly 1`);
  }
  if (s.not && errors(s.not, v, path).length === 0) out.push(`${path}: matches a forbidden schema`);
  if (s.if && errors(s.if, v, path).length === 0) {
    if (s.then) out.push(...errors(s.then, v, path));
  } else if (s.if && s.else) out.push(...errors(s.else, v, path));
  return out;
}

export function loadSchemas(dir: string): Map<string, S> {
  const m = new Map<string, S>();
  for (const f of readdirSync(dir).filter((x: string) => x.endsWith(".json"))) m.set(f.replace(/\.schema.*\.json$/, ""), JSON.parse(readFileSync(join(dir, f), "utf8")));
  return m;
}
export class MiniValidator implements ExchangeValidator {
  private schemas: Map<string, S>;
  constructor(schemas: Map<string, S>) {
    this.schemas = schemas;
  }
  has(key: string): boolean {
    return this.schemas.has(key);
  }
  validate(key: string, record: unknown, path: string): Issue[] {
    const s = this.schemas.get(key);
    if (!s) return [{ severity: "error", code: "no_schema", path, message: `no schema ${key}` }];
    return errors(s, record, "$").map((m) => ({ severity: "error" as const, code: "schema", path: `${path}${m.slice(1).split(":")[0]}`, message: m }));
  }
}
