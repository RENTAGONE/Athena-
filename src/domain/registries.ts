// Relation-type and ID-namespace registries. Both are DATA loaded from the Pack, not hard-coded vocabularies.
export interface RelationType {
  code: string;
  symmetric: boolean;
  cycle_policy: string;
  gating_allowed: boolean;
  allowed_source_types: string[];
  allowed_target_types: string[];
}
export class RelationRegistry {
  private byCode = new Map<string, RelationType>();
  constructor(types: RelationType[]) {
    for (const t of types) this.byCode.set(t.code, t);
  }
  get(code: string): RelationType | undefined {
    return this.byCode.get(code);
  }
  codes(): string[] {
    return [...this.byCode.keys()];
  }
}

export interface Namespace {
  code: string;
  legacy: boolean;
  allowed_owner_discipline_ids: string[];
}
export class NamespaceRegistry {
  private byCode = new Map<string, Namespace>();
  constructor(items: Namespace[]) {
    for (const n of items) this.byCode.set(n.code, n);
  }
  has(segment: string): boolean {
    return this.byCode.has(segment);
  }
  ownerAllowed(segment: string, owner: string): boolean {
    return this.byCode.get(segment)?.allowed_owner_discipline_ids.includes(owner) ?? false;
  }
}

const CODE_RE = /^ATH-(DISC|DOM|FAM|SKILL|SUB|CON|OBJ|UNIT|ASMT|CTX|XFER|MICRO|RES|PROJ|MILE|PROT)-([A-Z0-9]+)(?:-[A-Z0-9-]+)?$/;
/** Kinds whose first segment is a discipline namespace. MICRO (category), CTX and XFER have their own segment meaning. */
const NAMESPACED = new Set(["DOM", "FAM", "SKILL", "SUB", "CON", "OBJ", "UNIT", "ASMT", "RES", "PROJ", "MILE", "PROT"]);
export function parseCode(code: string): { kind: string; segment: string } | null {
  const m = CODE_RE.exec(code);
  return m ? { kind: m[1]!, segment: m[2]! } : null;
}
export function namespaceOf(code: string): string | null {
  const p = parseCode(code);
  return p && NAMESPACED.has(p.kind) ? p.segment : null;
}
/** Structural edges never have permanent codes. ATH-EDGE-* is a reserved, rejected namespace (N-04). */
export function isReservedEdgeCode(s: unknown): boolean {
  return typeof s === "string" && s.startsWith("ATH-EDGE-");
}
export function isAthenaCode(s: unknown): boolean {
  return typeof s === "string" && parseCode(s) !== null;
}
