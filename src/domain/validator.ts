import type { Issue } from "./types.ts";
/** Exchange-schema validation port. CI binds it to Ajv standalone validators; offline tests bind it to a test-only mini validator. */
export interface ExchangeValidator {
  /** schemaKey is the schema file stem, e.g. "EVIDENCE_RECORD" or "DOMAIN_RECORD". */
  validate(schemaKey: string, record: unknown, path: string): Issue[];
  has(schemaKey: string): boolean;
}
