// The 18 canonical disciplines, read from the content owner's registry file. IDs and names are never
// re-typed by hand: this module only adds a stable secondary colour and an icon to each registered record.
import type { LucideIcon } from "lucide-react";
import { Atom, Brain, Briefcase, Brush, CircuitBoard, Cpu, Dumbbell, HeartPulse, Landmark, Languages, MessageSquare, Mic, Palette, ShieldCheck, Sigma, Users, Workflow, Wrench } from "lucide-react";
import registry from "../../fixtures/pack-v1.0/DISCIPLINE_REGISTRY.json";

export interface DisciplineMeta {
  /** Canonical ATH-DISC-* code, exactly as registered. */
  id: string;
  /** Registered name, unmodified. */
  name: string;
  /** Short label for chips and rails; derived from the registered name, never used as an identifier. */
  short: string;
  color: string;
  Icon: LucideIcon;
}

interface Extras {
  short: string;
  color: string;
  Icon: LucideIcon;
}

const EXTRAS: Record<string, Extras> = {
  "ATH-DISC-ENG": { short: "Engineering", color: "#648bff", Icon: Cpu },
  "ATH-DISC-BIZ": { short: "Business", color: "#ffb86b", Icon: Briefcase },
  "ATH-DISC-ELEC": { short: "Electronics", color: "#4fd1e4", Icon: CircuitBoard },
  "ATH-DISC-FIN": { short: "Finance", color: "#86e39b", Icon: Landmark },
  "ATH-DISC-BODY": { short: "Body science", color: "#ff8fa3", Icon: HeartPulse },
  "ATH-DISC-PSY": { short: "Psychology", color: "#b49cff", Icon: Brain },
  "ATH-DISC-AEST": { short: "Visual design", color: "#f29bd0", Icon: Palette },
  "ATH-DISC-WORK": { short: "Workflow", color: "#8fa8c8", Icon: Workflow },
  "ATH-DISC-ART": { short: "Studio art", color: "#e8a87c", Icon: Brush },
  "ATH-DISC-ATH": { short: "Athletics", color: "#7be0b0", Icon: Dumbbell },
  "ATH-DISC-PERF": { short: "Performance", color: "#d6a2f5", Icon: Mic },
  "ATH-DISC-MATH": { short: "Mathematics", color: "#a8c4ff", Icon: Sigma },
  "ATH-DISC-CYBER": { short: "Cybersecurity", color: "#63d2b8", Icon: ShieldCheck },
  "ATH-DISC-LANG": { short: "Language", color: "#e9c46a", Icon: Languages },
  "ATH-DISC-RES": { short: "Research", color: "#9bc7a6", Icon: Atom },
  "ATH-DISC-INDEP": { short: "Independence", color: "#d8a98f", Icon: Wrench },
  "ATH-DISC-LEAD": { short: "Leadership", color: "#a5b4e8", Icon: Users },
  "ATH-DISC-COMM": { short: "Communication", color: "#f0a19c", Icon: MessageSquare },
};

interface RegistryEntry {
  id: string;
  name: string;
}

const entries = (registry as unknown as { disciplines: RegistryEntry[] }).disciplines;

export const DISCIPLINES: DisciplineMeta[] = entries.map((d) => {
  const extra = EXTRAS[d.id];
  if (!extra) throw new Error(`discipline ${d.id} has no colour/icon mapping; update src/ui/disciplines.ts`);
  return { id: d.id, name: d.name, short: extra.short, color: extra.color, Icon: extra.Icon };
});

export const DISCIPLINE_BY_ID: Record<string, DisciplineMeta> = Object.fromEntries(DISCIPLINES.map((d) => [d.id, d]));

export function disciplineColor(ownerCode: string | null | undefined): string {
  return (ownerCode && DISCIPLINE_BY_ID[ownerCode]?.color) || "var(--border)";
}

export function disciplineShort(ownerCode: string | null | undefined): string {
  return (ownerCode && DISCIPLINE_BY_ID[ownerCode]?.short) || "Unassigned";
}
