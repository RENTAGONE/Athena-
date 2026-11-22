// Pure selectors over the persisted DbState. Nothing here reads the DOM, writes to the store, or opens
// a network connection: every screen renders from the same functions, so counts can never disagree.
import { CONSERVATIVE_V0 } from "../domain/competency.ts";
import { deriveIndependence } from "../domain/evidence.ts";
import type { DbState, EdgeRecord, EvidenceStored, NodeRecord, OutcomeValue } from "../domain/types.ts";
import registry from "../../fixtures/pack-v1.0/DISCIPLINE_REGISTRY.json" with { type: "json" };

export type MasteryTier = "unassessed" | "needs_revision" | "demonstrated" | "mastered";
export const MASTERY_TIERS: MasteryTier[] = ["unassessed", "needs_revision", "demonstrated", "mastered"];

const DAY = 86_400_000;
const DISCIPLINE_ORDER: string[] = (registry as unknown as { disciplines: { id: string }[] }).disciplines.map((d) => d.id);

/** Per-target evidence index, built once per state so the atlas does not rescan the evidence table per node. */
export interface EvidenceIndex {
  byTarget: Map<string, { ev: EvidenceStored; outcome: OutcomeValue; independent: boolean; at: number; day: string }[]>;
  total: number;
  scored: number;
  /** Targets the learner has explicitly confirmed as mastered. Only this set can produce the mastered tier. */
  confirmed: Set<string>;
}

export function evidenceIndex(state: DbState): EvidenceIndex {
  const byTarget = new Map<string, { ev: EvidenceStored; outcome: OutcomeValue; independent: boolean; at: number; day: string }[]>();
  const confirmed = new Set<string>();
  let scored = 0;
  const all = Object.values(state.evidence);
  for (const ev of all) {
    if (ev.conditions["mastery_confirmation"] === true) for (const t of ev.target_ids) confirmed.add(t);
    if (!ev.outcome_scored) continue;
    scored += 1;
    const independent = deriveIndependence(ev) === "independent";
    const at = Date.parse(ev.occurred_at);
    for (const o of ev.target_outcomes) {
      const list = byTarget.get(o.target_id) ?? [];
      list.push({ ev, outcome: o.outcome, independent, at: Number.isFinite(at) ? at : 0, day: ev.occurred_at.slice(0, 10) });
      byTarget.set(o.target_id, list);
    }
  }
  for (const list of byTarget.values()) list.sort((a, b) => a.at - b.at);
  return { byTarget, total: all.length, scored, confirmed };
}

/**
 * Four-tier mastery state used by the atlas rings. Derived only from stored, outcome-scored evidence:
 * opening a page, reading a card or a session timer can never change it. "mastered" requires the
 * conservative-v0 clauses (three independent demonstrations over three separate days spanning at least
 * fourteen days, plus a retained later demonstration) — the same constants the competency rules use.
 */
export function masteryTier(index: EvidenceIndex, targetId: string): MasteryTier {
  const entries = index.byTarget.get(targetId);
  if (!entries || entries.length === 0) return "unassessed";
  const indepDemo = entries.filter((e) => e.independent && e.outcome === "demonstrated");
  const latest = entries[entries.length - 1]!;
  if (latest.outcome === "not_demonstrated") return "needs_revision";
  if (indepDemo.length === 0) return entries.some((e) => e.outcome === "partial") ? "needs_revision" : "unassessed";
  const p = CONSERVATIVE_V0;
  const days = new Set(indepDemo.map((e) => e.day));
  const first = indepDemo[0]!;
  const span = (indepDemo[indepDemo.length - 1]!.at - first.at) / DAY;
  const retained = indepDemo.some((e) => e !== first && e.at - first.at >= p.retained_delay_days * DAY && e.ev.item_signature !== null && e.ev.item_signature !== first.ev.item_signature);
  const clauses = indepDemo.length >= p.m1_independent_demonstrations && days.size >= p.m1_separate_days && span >= p.m1_span_days && retained;
  return clauses && index.confirmed.has(targetId) ? "mastered" : "demonstrated";
}

export function tierCounts(index: EvidenceIndex, ids: string[]): Record<MasteryTier, number> {
  const out: Record<MasteryTier, number> = { unassessed: 0, needs_revision: 0, demonstrated: 0, mastered: 0 };
  for (const id of ids) out[masteryTier(index, id)] += 1;
  return out;
}

/** Skill-like records: the three competency levels the atlas keeps distinct. */
const MOON_TYPES = new Set(["skill", "subskill", "micro_skill"]);

export interface GalaxyMoon {
  node: NodeRecord;
  tier: MasteryTier;
  order: number;
  /** Component capability satellites (subskills) orbiting this moon. */
  satellites: GalaxyMoon[];
  /** Small observable action markers (micro-skills) orbiting this moon. */
  asteroids: GalaxyMoon[];
}

export interface GalaxyConstellation {
  node: NodeRecord;
  tier: MasteryTier;
  order: number;
  /** Planet index when the family sits inside a domain; null when it hangs off the star. */
  planet: number | null;
  members: GalaxyMoon[];
}

export interface GalaxyPlanet {
  node: NodeRecord;
  tier: MasteryTier;
  order: number;
  moons: GalaxyMoon[];
}

export interface GalaxyStar {
  discipline: NodeRecord;
  /** Canonical ATH-DISC-* code. */
  code: string;
  order: number;
  planets: GalaxyPlanet[];
  /** Skills that hang off the star because no domain/family ancestor resolves. */
  moons: GalaxyMoon[];
  /** Subskills without a skill parent, kept findable rather than hidden. */
  satellites: GalaxyMoon[];
  /** Unlinked micro-skills, still rendered as telemetry markers. */
  asteroids: GalaxyMoon[];
  constellations: GalaxyConstellation[];
}

export type CelestialKind = "star" | "planet" | "constellation" | "moon" | "satellite" | "asteroid";

export interface GalaxyLocation {
  star: number;
  planet: number | null;
  moon: number | null;
  kind: CelestialKind;
}

export interface Galaxy {
  stars: GalaxyStar[];
  /** node id → where it lives, so a selection can be resolved without a second scan. */
  location: Map<string, GalaxyLocation>;
  /** Custom/frontier records with no resolved discipline: rogue wanderer stars on the rim. */
  rogues: GalaxyMoon[];
  totals: { stars: number; planets: number; constellations: number; moons: number; satellites: number; asteroids: number };
}

const emptyBody = (node: NodeRecord, tier: MasteryTier, order: number): GalaxyMoon => ({ node, tier, order, satellites: [], asteroids: [] });

function parentChain(state: DbState, node: NodeRecord): NodeRecord[] {
  const out: NodeRecord[] = [];
  let cursor: NodeRecord | undefined = node;
  const seen = new Set<string>([node.id]);
  while (cursor && cursor.parent_id) {
    const parent: NodeRecord | undefined = state.nodes[cursor.parent_id];
    if (!parent || seen.has(parent.id)) break;
    seen.add(parent.id);
    out.push(parent);
    cursor = parent;
  }
  return out;
}

/** Nearest ancestor of one of the given types, walking CONTAINS parents only. */
function nearestAncestor(state: DbState, node: NodeRecord, types: string[]): NodeRecord | null {
  for (const p of parentChain(state, node)) if (types.includes(p.object_type)) return p;
  return null;
}

/** A micro-skill may carry no CONTAINS parent: it attaches through SUPPORTS to a skill or subskill. */
function supportsTarget(state: DbState, node: NodeRecord, types: string[]): NodeRecord | null {
  for (const e of Object.values(state.edges)) {
    if (e.relation_type !== "SUPPORTS" || e.source_id !== node.id) continue;
    const target = state.nodes[e.target_id];
    if (target && types.includes(target.object_type)) return target;
  }
  return null;
}

/**
 * The atlas projection. Six distinct celestial classes, never compressed:
 *   discipline → star · domain → planet · skill_family → constellation · skill → moon ·
 *   subskill → satellite · micro_skill → asteroid.
 * A record with no resolvable parent is still placed (under its owner's star) and counted as an
 * orphan by the ontology audit, so it can be found and repaired rather than disappear.
 */
export function buildGalaxy(state: DbState, index: EvidenceIndex = evidenceIndex(state)): Galaxy {
  const disciplines = Object.values(state.nodes)
    .filter((n) => n.object_type === "discipline")
    .sort((a, b) => {
      const ai = DISCIPLINE_ORDER.indexOf(a.code);
      const bi = DISCIPLINE_ORDER.indexOf(b.code);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi) || a.code.localeCompare(b.code);
    });
  const starByCode = new Map<string, GalaxyStar>();
  const stars: GalaxyStar[] = disciplines.map((d, i) => {
    const s: GalaxyStar = { discipline: d, code: d.code, order: i, planets: [], moons: [], satellites: [], asteroids: [], constellations: [] };
    starByCode.set(d.code, s);
    return s;
  });
  const location = new Map<string, GalaxyLocation>();
  const planetByNode = new Map<string, { star: GalaxyStar; idx: number }>();
  const familyByNode = new Map<string, GalaxyConstellation>();
  const moonByNode = new Map<string, GalaxyMoon>();
  const satelliteByNode = new Map<string, GalaxyMoon>();

  const starOf = (n: NodeRecord): GalaxyStar | undefined => {
    const owner = n.owner_discipline_id ? starByCode.get(n.owner_discipline_id) : undefined;
    if (owner) return owner;
    const disc = nearestAncestor(state, n, ["discipline"]);
    return disc ? starByCode.get(disc.code) : undefined;
  };

  // Tier 1: planets are domains only. A skill family is a constellation, never a planet.
  for (const n of Object.values(state.nodes)) {
    if (n.object_type !== "domain") continue;
    const star = starOf(n);
    if (!star) continue;
    const idx = star.planets.length;
    star.planets.push({ node: n, tier: masteryTier(index, n.id), order: idx, moons: [] });
    planetByNode.set(n.id, { star, idx });
    location.set(n.id, { star: star.order, planet: idx, moon: null, kind: "planet" });
  }

  // Tier 2: skill families are constellations. They can nest inside a domain or hang off the star.
  const families = Object.values(state.nodes).filter((n) => n.object_type === "skill_family").sort((a, b) => a.code.localeCompare(b.code));
  for (const n of families) {
    const star = starOf(n);
    if (!star) continue;
    const domain = nearestAncestor(state, n, ["domain"]);
    const planet = domain ? (planetByNode.get(domain.id)?.idx ?? null) : null;
    const c: GalaxyConstellation = { node: n, tier: masteryTier(index, n.id), order: star.constellations.length, planet, members: [] };
    star.constellations.push(c);
    familyByNode.set(n.id, c);
    location.set(n.id, { star: star.order, planet, moon: null, kind: "constellation" });
  }

  // Tier 3: skills are major moons. Their domain ancestor decides the orbit; a family-only skill still
  // orbits the star and is listed as a constellation member.
  const skills = Object.values(state.nodes).filter((n) => n.object_type === "skill").sort((a, b) => a.code.localeCompare(b.code));
  for (const n of skills) {
    const star = starOf(n);
    if (!star) continue;
    const domain = nearestAncestor(state, n, ["domain"]);
    const family = nearestAncestor(state, n, ["skill_family"]);
    const planet = domain ? planetByNode.get(domain.id) : undefined;
    const moon = emptyBody(n, masteryTier(index, n.id), 0);
    if (planet) {
      moon.order = planet.star.planets[planet.idx]!.moons.length;
      planet.star.planets[planet.idx]!.moons.push(moon);
      location.set(n.id, { star: star.order, planet: planet.idx, moon: moon.order, kind: "moon" });
    } else {
      moon.order = star.moons.length;
      star.moons.push(moon);
      location.set(n.id, { star: star.order, planet: null, moon: moon.order, kind: "moon" });
    }
    moonByNode.set(n.id, moon);
    if (family) familyByNode.get(family.id)?.members.push(moon);
  }

  // Tier 4: subskills are satellites, attached to their skill when one resolves.
  const subskills = Object.values(state.nodes).filter((n) => n.object_type === "subskill").sort((a, b) => a.code.localeCompare(b.code));
  for (const n of subskills) {
    const star = starOf(n);
    if (!star) continue;
    const parent = nearestAncestor(state, n, ["skill"]) ?? supportsTarget(state, n, ["skill"]);
    const moon = parent ? moonByNode.get(parent.id) : undefined;
    const satellite = emptyBody(n, masteryTier(index, n.id), moon ? moon.satellites.length : star.satellites.length);
    if (moon) moon.satellites.push(satellite);
    else star.satellites.push(satellite);
    satelliteByNode.set(n.id, satellite);
    const host = parent ? location.get(parent.id) : undefined;
    location.set(n.id, { star: star.order, planet: host?.planet ?? null, moon: host?.moon ?? null, kind: "satellite" });
  }

  // Tier 5: micro-skills are telemetry asteroid markers. They keep draft/review status and stay visible
  // even when no parent edge exists.
  const micros = Object.values(state.nodes).filter((n) => n.object_type === "micro_skill").sort((a, b) => a.code.localeCompare(b.code));
  for (const n of micros) {
    const star = starOf(n);
    if (!star) continue;
    const sub = nearestAncestor(state, n, ["subskill"]) ?? supportsTarget(state, n, ["subskill"]);
    const skill = nearestAncestor(state, n, ["skill"]) ?? supportsTarget(state, n, ["skill"]);
    const host = satelliteByNode.get(sub?.id ?? "") ?? moonByNode.get(skill?.id ?? "");
    const asteroid = emptyBody(n, masteryTier(index, n.id), host ? host.asteroids.length : star.asteroids.length);
    if (host) host.asteroids.push(asteroid);
    else star.asteroids.push(asteroid);
    const hostLoc = host ? location.get(host.node.id) : undefined;
    location.set(n.id, { star: star.order, planet: hostLoc?.planet ?? null, moon: hostLoc?.moon ?? null, kind: "asteroid" });
  }

  // Rogue wanderers: real records that resolve to no discipline sector. They are not dropped — the
  // atlas draws them drifting along the galactic rim until the learner assigns one.
  const rogues: GalaxyMoon[] = [];
  for (const n of Object.values(state.nodes)) {
    if (n.object_type === "discipline") continue;
    if (!["domain", "skill_family", "skill", "subskill", "micro_skill"].includes(n.object_type)) continue;
    if (starOf(n)) continue;
    rogues.push(emptyBody(n, masteryTier(index, n.id), rogues.length));
  }

  const planets = stars.reduce((sum, s) => sum + s.planets.length, 0);
  const constellations = stars.reduce((sum, s) => sum + s.constellations.length, 0);
  const moonCount = stars.reduce((sum, s) => sum + s.moons.length + s.planets.reduce((m, p) => m + p.moons.length, 0), 0);
  const satellites = stars.reduce((sum, s) => sum + s.satellites.length + s.moons.reduce((m, p) => m + p.satellites.length, 0) + s.planets.reduce((m, p) => m + p.moons.reduce((k, q) => k + q.satellites.length, 0), 0), 0);
  const asteroids = stars.reduce((sum, s) => sum + s.asteroids.length + s.moons.reduce((m, p) => m + p.asteroids.length, 0) + s.planets.reduce((m, p) => m + p.moons.reduce((k, q) => k + q.asteroids.length + q.satellites.reduce((x, r) => x + r.asteroids.length, 0), 0), 0), 0);
  return { stars, location, rogues, totals: { stars: stars.length, planets, constellations, moons: moonCount, satellites, asteroids } };
}

export interface EdgePartitions {
  /** CONTAINS and PREREQUISITE_FOR links that stay inside one discipline. */
  intra: EdgeRecord[];
  /** ATH-XFER-* links, cross-discipline RELATED_TO and cross-discipline SUPPORTS. */
  cross: EdgeRecord[];
  /** Everything else (learning units, assessments, objectives); listed but not drawn as threads. */
  other: EdgeRecord[];
}

export function partitionEdges(state: DbState): EdgePartitions {
  const intra: EdgeRecord[] = [];
  const cross: EdgeRecord[] = [];
  const other: EdgeRecord[] = [];
  const disc = (id: string): string | null => state.nodes[id]?.owner_discipline_id ?? null;
  for (const e of Object.values(state.edges)) {
    const a = disc(e.source_id);
    const b = disc(e.target_id);
    const isTransfer = (e.code ?? "").startsWith("ATH-XFER-") || e.relation_type === "TRANSFER_TO";
    if (isTransfer) cross.push(e);
    else if ((e.relation_type === "CONTAINS" || e.relation_type === "PREREQUISITE_FOR") && a && a === b) intra.push(e);
    else if ((e.relation_type === "RELATED_TO" || e.relation_type === "SUPPORTS") && a && b && a !== b) cross.push(e);
    else other.push(e);
  }
  return { intra, cross, other };
}

/** The knowledge Index: every record grouped by its owner discipline, searchable and keyboard reachable. */
export interface IndexGroup {
  discipline: string | null;
  items: { node: NodeRecord; tier: MasteryTier }[];
}

export function indexGroups(state: DbState, index: EvidenceIndex = evidenceIndex(state)): IndexGroup[] {
  const groups = new Map<string, IndexGroup>();
  for (const d of DISCIPLINE_ORDER) groups.set(d, { discipline: d, items: [] });
  for (const n of Object.values(state.nodes)) {
    if (n.object_type === "discipline") continue;
    const key = n.owner_discipline_id && groups.has(n.owner_discipline_id) ? n.owner_discipline_id : "unassigned";
    let g = groups.get(key);
    if (!g) {
      g = { discipline: null, items: [] };
      groups.set(key, g);
    }
    g.items.push({ node: n, tier: masteryTier(index, n.id) });
  }
  const out = [...groups.values()].filter((g) => g.items.length > 0);
  for (const g of out) g.items.sort((a, b) => a.node.title.localeCompare(b.node.title));
  return out;
}

export interface ProjectGroup {
  key: "personal_use" | "product_business" | "intrinsic";
  label: string;
  description: string;
  projects: NodeRecord[];
}

export function projectGroups(state: DbState): ProjectGroup[] {
  const definitions: { key: ProjectGroup["key"]; label: string; description: string }[] = [
    { key: "personal_use", label: "Personal-use", description: "Made to be used by you, for your own life or work." },
    { key: "product_business", label: "Product / business-foundation", description: "Made to serve other people, as an offer or a business asset." },
    { key: "intrinsic", label: "Intrinsic / for its own sake", description: "Made because the making is the point; no set outcome." },
  ];
  const projects = Object.values(state.nodes).filter((n) => n.object_type === "project");
  return definitions.map((d) => ({
    ...d,
    projects: projects.filter((p) => {
      const cls = p.body["project_class"] ?? p.body["class"];
      return typeof cls === "string" && cls.toLowerCase() === d.key;
    }),
  }));
}

export interface FocusCandidate {
  node: NodeRecord;
  tier: MasteryTier;
  evidence: number;
}

export interface TodayView {
  isoDate: string;
  localDate: string;
  counts: { nodes: number; edges: number; evidence: number; scoredEvidence: number; draft: number; disciplines: number; domains: number; skills: number; projects: number };
  lastImport: { at: string; packageId: string; state: string } | null;
  focus: { discipline: string; needsRevision: number; demonstrated: number; total: number }[];
  review: FocusCandidate[];
  active: FocusCandidate[];
  projects: ProjectGroup[];
}

export function todayView(state: DbState, index: EvidenceIndex = evidenceIndex(state), now: Date = new Date()): TodayView {
  const nodes = Object.values(state.nodes);
  const skillLike = nodes.filter((n) => MOON_TYPES.has(n.object_type));
  const review: FocusCandidate[] = [];
  const active: FocusCandidate[] = [];
  for (const n of skillLike) {
    const tier = masteryTier(index, n.id);
    const entries = index.byTarget.get(n.id) ?? [];
    if (tier === "needs_revision") review.push({ node: n, tier, evidence: entries.length });
    else if (tier === "demonstrated") active.push({ node: n, tier, evidence: entries.length });
  }
  review.sort((a, b) => b.evidence - a.evidence || a.node.title.localeCompare(b.node.title));
  active.sort((a, b) => b.evidence - a.evidence || a.node.title.localeCompare(b.node.title));
  const byDiscipline = new Map<string, { needsRevision: number; demonstrated: number; total: number }>();
  for (const n of skillLike) {
    const code = n.owner_discipline_id ?? "unassigned";
    const row = byDiscipline.get(code) ?? { needsRevision: 0, demonstrated: 0, total: 0 };
    const tier = masteryTier(index, n.id);
    if (tier === "needs_revision") row.needsRevision += 1;
    if (tier === "demonstrated" || tier === "mastered") row.demonstrated += 1;
    row.total += 1;
    byDiscipline.set(code, row);
  }
  const focus = [...byDiscipline.entries()]
    .map(([discipline, v]) => ({ discipline, ...v }))
    .sort((a, b) => b.needsRevision - a.needsRevision || b.demonstrated - a.demonstrated || b.total - a.total);
  const receipts = Object.values(state.receipts).sort((a, b) => b.at.localeCompare(a.at));
  const last = receipts[0];
  return {
    isoDate: now.toISOString().slice(0, 10),
    localDate: now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    counts: {
      nodes: nodes.length,
      edges: Object.keys(state.edges).length,
      evidence: index.total,
      scoredEvidence: index.scored,
      draft: nodes.filter((n) => n.status === "draft").length,
      disciplines: nodes.filter((n) => n.object_type === "discipline").length,
      domains: nodes.filter((n) => n.object_type === "domain").length,
      skills: skillLike.length,
      projects: nodes.filter((n) => n.object_type === "project").length,
    },
    lastImport: last ? { at: last.at, packageId: last.package_id, state: last.state } : null,
    focus,
    review,
    active,
    projects: projectGroups(state),
  };
}

export function nodeByCode(state: DbState, code: string): NodeRecord | undefined {
  const entry = state.codes[code];
  return entry ? state.nodes[entry.id] : undefined;
}

/** Prerequisite count for a record, read from PREREQUISITE_FOR edges pointing at it. */
export function prerequisiteCount(state: DbState, id: string): number {
  return Object.values(state.edges).filter((e) => e.relation_type === "PREREQUISITE_FOR" && e.target_id === id).length;
}
