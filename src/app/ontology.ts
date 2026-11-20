// The semantic contract between the knowledge records and the atlas. Six celestial classes, plus
// typed attached systems that are NOT parent-child levels. The atlas may draw them as overlays,
// beacons and routes, but the graph never gains a fake "concept contains skill" edge from this file.
import type { DbState, EdgeRecord, NodeRecord } from "../domain/types.ts";

export const CELESTIAL_CLASSES = ["universe", "star", "planet", "constellation", "moon", "satellite", "asteroid"] as const;
export type CelestialClass = (typeof CELESTIAL_CLASSES)[number];

/** Which object types project onto which celestial class. Discipline and domain are 1:1; every other
 *  level keeps its own class so a family is never mistaken for a domain, or a subskill for a skill. */
export const CLASS_OF_OBJECT: Record<string, CelestialClass> = {
  universe: "universe",
  discipline: "star",
  domain: "planet",
  skill_family: "constellation",
  skill: "moon",
  subskill: "satellite",
  micro_skill: "asteroid",
};

/** Attached systems carry a typed marker rather than a celestial body. They are linked to records by
 *  authorised edges, never inserted as competency children. */
export const ATTACHED_SYSTEMS = ["knowledge", "outcome", "expedition", "beacon", "probe", "trace", "trajectory"] as const;
export type AttachedSystem = (typeof ATTACHED_SYSTEMS)[number];

export const ATTACHED_OF_OBJECT: Record<string, AttachedSystem> = {
  concept: "knowledge",
  learning_objective: "outcome",
  learning_unit: "expedition",
  module: "expedition",
  assessment: "beacon",
  resource: "probe",
  evidence: "trace",
  project: "trajectory",
};

export interface ObjectClassMeta {
  objectType: string;
  celestial: CelestialClass | null;
  attached: AttachedSystem | null;
  label: string;
}

export function classifyObjectType(objectType: string): ObjectClassMeta {
  const celestial = CLASS_OF_OBJECT[objectType] ?? null;
  const attached = ATTACHED_OF_OBJECT[objectType] ?? null;
  return {
    objectType,
    celestial,
    attached,
    label: celestial ?? (attached ? `${attached} marker` : "unclassified"),
  };
}

/** The relation semantics the atlas is allowed to rely on. Everything else is listed, not drawn as a
 *  prerequisite, and a hard gate must say why it is hard. */
export const RELATION_SEMANTICS = {
  CONTAINS: { meaning: "structural membership", gate: false, drawn: true },
  PREREQUISITE_FOR: { meaning: "genuine dependency; only hard gating can lock a path", gate: true, drawn: true },
  SUPPORTS: { meaning: "helps but is not required", gate: false, drawn: true },
  RELATED_TO: { meaning: "association, symmetric", gate: false, drawn: true },
  TRANSFER_TO: { meaning: "use in another context or discipline", gate: false, drawn: true },
} as const;
export type CanonicalRelation = keyof typeof RELATION_SEMANTICS;

export function isCanonicalRelation(relation: string): relation is CanonicalRelation {
  return Object.prototype.hasOwnProperty.call(RELATION_SEMANTICS, relation);
}

export interface ProjectionCounts {
  universe: number;
  stars: number;
  planets: number;
  constellations: number;
  moons: number;
  satellites: number;
  asteroids: number;
  attached: Record<string, number>;
  orphans: number;
}

export interface Projection {
  counts: ProjectionCounts;
  /** Records whose parent chain cannot be resolved. They stay findable in the Index and are flagged. */
  orphans: NodeRecord[];
  /** Attached systems by their target record id. */
  attachedTo: Map<string, { node: NodeRecord; system: AttachedSystem }[]>;
}

const CELESTIAL_PARENT: Record<string, string[]> = {
  domain: ["discipline"],
  skill_family: ["discipline", "domain"],
  skill: ["skill_family", "domain"],
  subskill: ["skill"],
  micro_skill: ["subskill", "skill"],
};

/** Builds the typed projection. Pure: reads the snapshot, writes nothing. */
export function projectOntology(state: DbState): Projection {
  const counts: ProjectionCounts = {
    universe: 1,
    stars: 0,
    planets: 0,
    constellations: 0,
    moons: 0,
    satellites: 0,
    asteroids: 0,
    attached: {},
    orphans: 0,
  };
  const orphans: NodeRecord[] = [];
  const attachedTo = new Map<string, { node: NodeRecord; system: AttachedSystem }[]>();
  for (const n of Object.values(state.nodes)) {
    if (n.object_type === "discipline") counts.stars += 1;
    else if (n.object_type === "domain") counts.planets += 1;
    else if (n.object_type === "skill_family") counts.constellations += 1;
    else if (n.object_type === "skill") counts.moons += 1;
    else if (n.object_type === "subskill") counts.satellites += 1;
    else if (n.object_type === "micro_skill") counts.asteroids += 1;
    const meta = classifyObjectType(n.object_type);
    if (meta.attached) {
      counts.attached[meta.attached] = (counts.attached[meta.attached] ?? 0) + 1;
      const target = targetOf(state, n);
      if (target) {
        const list = attachedTo.get(target.id) ?? [];
        list.push({ node: n, system: meta.attached });
        attachedTo.set(target.id, list);
      }
    }
    const allowed = CELESTIAL_PARENT[n.object_type];
    if (!allowed) continue;
    // A discipline owner places the record under the right star, but it does not make the parent
    // chain valid. A skill with no domain/family parent is a structural orphan even when its owner is
    // known: it is still drawn (findable) and reported here for repair.
    const parent = n.parent_id ? state.nodes[n.parent_id] : undefined;
    if (!parent || !allowed.includes(parent.object_type)) {
      orphans.push(n);
      counts.orphans += 1;
    }
  }
  return { counts, orphans, attachedTo };
}

function targetOf(state: DbState, node: NodeRecord): NodeRecord | null {
  for (const e of Object.values(state.edges)) {
    if (e.source_id !== node.id && e.target_id !== node.id) continue;
    const other = state.nodes[e.source_id === node.id ? e.target_id : e.source_id];
    if (other && CLASS_OF_OBJECT[other.object_type]) return other;
  }
  if (node.parent_id) return state.nodes[node.parent_id] ?? null;
  return null;
}

export interface ProgressionState {
  node: NodeRecord;
  state: "available" | "blocked" | "held" | "needs_revision";
  /** Only real PREREQUISITE_FOR edges with gating === "hard" can block. */
  gates: { node: NodeRecord; held: boolean; justification: string | null }[];
  /** Chosen freely: browsing any record never unlocks or locks anything. */
  outOfSequence: boolean;
}

/**
 * Competency Progression View. A step is open when every hard prerequisite is held. Soft
 * PREREQUISITE_FOR edges and SUPPORTS links are shown as advice and never lock the record. The free
 * explorer ignores this function entirely.
 */
export function progressionFor(state: DbState, nodeId: string, held: (id: string) => boolean): ProgressionState | null {
  const node = state.nodes[nodeId];
  if (!node) return null;
  const gates: ProgressionState["gates"] = [];
  for (const e of Object.values(state.edges) as EdgeRecord[]) {
    if (e.relation_type !== "PREREQUISITE_FOR" || e.target_id !== nodeId) continue;
    if (e.gating !== "hard") continue;
    const p = state.nodes[e.source_id];
    if (!p) continue;
    gates.push({ node: p, held: held(p.id), justification: e.hard_gate_justification });
  }
  const blocked = gates.some((g) => !g.held);
  const isHeld = held(nodeId);
  return {
    node,
    state: isHeld ? "held" : blocked ? "blocked" : "available",
    gates,
    outOfSequence: blocked,
  };
}

/** Free-explorer filters, applied without consulting mastery or prerequisites. */
export interface ExplorerFilter {
  discipline?: string | null;
  domain?: string | null;
  family?: string | null;
  objectType?: string | null;
  status?: string | null;
  hasEvidence?: boolean | null;
  query?: string;
}

export function explorerFilter(state: DbState, filter: ExplorerFilter, hasEvidence: (id: string) => boolean): NodeRecord[] {
  const q = filter.query?.trim().toLowerCase() ?? "";
  return Object.values(state.nodes)
    .filter((n) => {
      if (filter.objectType && n.object_type !== filter.objectType) return false;
      if (filter.status && n.status !== filter.status) return false;
      if (filter.discipline && n.owner_discipline_id !== filter.discipline && n.code !== filter.discipline) return false;
      if (filter.domain && !ancestorChainHas(state, n, filter.domain, "domain")) return false;
      if (filter.family && !ancestorChainHas(state, n, filter.family, "skill_family")) return false;
      if (filter.hasEvidence === true && !hasEvidence(n.id)) return false;
      if (filter.hasEvidence === false && hasEvidence(n.id)) return false;
      if (q && !n.title.toLowerCase().includes(q) && !n.code.toLowerCase().includes(q)) return false;
      return true;
    })
    .sort((a, b) => a.code.localeCompare(b.code));
}

function ancestorChainHas(state: DbState, node: NodeRecord, code: string, type: string): boolean {
  let cursor: NodeRecord | undefined = node;
  const seen = new Set<string>();
  while (cursor && cursor.parent_id && !seen.has(cursor.id)) {
    seen.add(cursor.id);
    const parent: NodeRecord | undefined = state.nodes[cursor.parent_id];
    if (!parent) return false;
    if (parent.code === code && parent.object_type === type) return true;
    cursor = parent;
  }
  return false;
}

export function relationCounts(state: DbState): Record<string, number> {
  const out: Record<string, number> = {};
  for (const e of Object.values(state.edges)) out[e.relation_type] = (out[e.relation_type] ?? 0) + 1;
  return out;
}
