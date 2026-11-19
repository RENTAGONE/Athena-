// Browser-side exchange validator backed by validators precompiled at build time (tools/build-validators.mjs). UNRUN in the authoring sandbox.
import * as compiled from "../generated/validators.js";
import type { ExchangeValidator } from "../domain/validator.ts";
import type { Issue } from "../domain/types.ts";

type Fn = ((data: unknown) => boolean) & { errors?: { instancePath: string; message?: string }[] | null };
const fns = compiled as unknown as Record<string, Fn>;
export const precompiledValidator: ExchangeValidator = {
  has: (key) => typeof fns[key] === "function",
  validate(key, record, path): Issue[] {
    const fn = fns[key];
    if (!fn) return [{ severity: "error", code: "no_schema", path, message: `no schema ${key}` }];
    return fn(record) ? [] : (fn.errors ?? []).map((e) => ({ severity: "error" as const, code: "schema", path: `${path}${e.instancePath.replace(/\//g, ".")}`, message: `${e.instancePath || "$"} ${e.message ?? "is invalid"}` }));
  },
};
