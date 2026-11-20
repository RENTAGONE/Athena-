// Types for the operational records ATHENA keeps beside the knowledge graph. These are deliberately
// NOT knowledge nodes: a calendar event is not a competence, a project is not a discipline and a
// routine occurrence is not evidence. They link to canonical ATH-* records by id or code instead.
//
// Persistence lives in Dexie v2 (see src/adapters/store-dexie.ts). Nothing in this file invents a
// value: every field is either supplied by the learner, parsed from their words with the unresolved
// parts left null, or recorded from an action that actually happened.

export type IsoDateTime = string;

// ---------------------------------------------------------------------------------------------
// Schedule
// ---------------------------------------------------------------------------------------------

export const EVENT_KINDS = [
  "fixed_commitment",
  "confirmed_event",
  "tentative_plan",
  "routine_occurrence",
  "task",
  "deadline",
  "availability",
  "buffer",
  "actual",
  "cancelled",
  "recovery",
] as const;
export type EventKind = (typeof EVENT_KINDS)[number];

export const FLEXIBILITY = ["immovable", "constrained", "flexible", "optional"] as const;
export type Flexibility = (typeof FLEXIBILITY)[number];
export const PRIORITIES = ["critical", "high", "normal", "low"] as const;
export type Priority = (typeof PRIORITIES)[number];

export type EventStatus = "proposed" | "confirmed" | "in_progress" | "completed" | "partial" | "skipped" | "cancelled";

export interface RecurrenceRule {
  freq: "daily" | "weekly";
  /** 0 = Sunday … 6 = Saturday. Only used for weekly rules. */
  weekdays?: number[];
  interval?: number;
  until?: string | null;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  kind: EventKind;
  /** Local wall-clock times without an offset ("2026-11-21T08:00"). Local time is intentional: a
   *  recurring 08:00 commitment stays at 08:00 when the device changes timezone. */
  startLocal: string | null;
  endLocal: string | null;
  windowStart?: string | null;
  windowEnd?: string | null;
  timezone: string;
  estimatedMinutes: number | null;
  estimateConfidence: number | null;
  actualMinutes?: number | null;
  status: EventStatus;
  flexibility: Flexibility;
  priority: Priority;
  location?: string | null;
  travelBeforeMin: number;
  travelAfterMin: number;
  prepMin: number;
  recurrence?: RecurrenceRule | null;
  /** Local dates (YYYY-MM-DD) skipped without touching the rule. */
  exceptions?: string[];
  source: "manual" | "natural_language" | "import" | "routine" | "project" | "learning";
  lastConfirmedAt: IsoDateTime | null;
  links: Record<string, string[]>;
  revision: number;
}

export interface RoutineTemplate {
  id: string;
  title: string;
  category: string;
  recurrence: RecurrenceRule;
  preferredWindow: { startMinute: number; endMinute: number } | null;
  minDurationMin: number;
  maxDurationMin: number;
  blocks: { title: string; minutes: number; taskId?: string }[];
  minimumViableBlocks: number;
  exceptions: string[];
  paused: boolean;
  reviewDate: string | null;
}

export type OccurrenceState = "planned" | "adjusted" | "completed" | "partial" | "skipped";

export interface RoutineOccurrence {
  id: string;
  templateId: string;
  dateLocal: string;
  window: { startMinute: number; endMinute: number } | null;
  state: OccurrenceState;
  actualMinutes?: number | null;
  deviationReason?: string | null;
  taskLinks: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId?: string | null;
  milestoneId?: string | null;
  source: "manual" | "project" | "learning" | "import";
  minMinutes: number;
  maxMinutes: number;
  dueLocal: string | null;
  priority: Priority;
  flexibility: Flexibility;
  dependencies: string[];
  contextTools: string[];
  status: "open" | "active" | "done" | "dropped";
  evidenceIds: string[];
}

export interface AvailabilityWindow {
  id: string;
  startLocal: string;
  endLocal: string;
  source: "learner" | "routine" | "import";
  hard: boolean;
  timezone: string;
  exceptions: string[];
}

export interface ScheduleProposal {
  id: string;
  summary: string;
  changes: { id: string; before: Partial<ScheduleEvent>; after: Partial<ScheduleEvent> }[];
  conflictIds: string[];
  preservedIds: string[];
  beforeSnapshot: ScheduleEvent[];
  afterSnapshot: ScheduleEvent[];
  explanation: string;
  expiresAt: string;
  decision: "pending" | "accepted" | "rejected" | "edited";
  createdAt: string;
}

export interface ActivityActual {
  id: string;
  targetId: string;
  targetKind: "event" | "task" | "routine" | "project" | "learning";
  startedAt: string;
  endedAt: string | null;
  actualMinutes: number | null;
  outcome: "completed" | "partial" | "skipped" | "interrupted";
  note: string;
  provenance: "learner" | "import" | "system";
}

export interface ScheduleAuditEvent {
  id: string;
  entityId: string;
  beforeRef: string | null;
  afterRef: string | null;
  approvedByUser: boolean;
  timestamp: string;
  reason: string;
  source: "learner" | "proposal" | "undo" | "import";
}

export type ConflictType =
  | "overlap"
  | "impossible_travel"
  | "missing_buffer"
  | "duration_exceeds_availability"
  | "deadline_risk"
  | "routine_collision"
  | "project_milestone_risk"
  | "recovery_infringement"
  | "daily_overload";

export interface ScheduleConflict {
  id: string;
  type: ConflictType;
  severity: "error" | "warning" | "info";
  involvedIds: string[];
  explanation: string;
  suggestions: string[];
}

// ---------------------------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------------------------

export const PROJECT_CLASSES = ["personal_use", "product_business", "intrinsic"] as const;
export type ProjectClass = (typeof PROJECT_CLASSES)[number];

export const PROJECT_STATES = ["captured_idea", "scoped", "active", "paused", "completed", "archived", "abandoned"] as const;
export type ProjectState = (typeof PROJECT_STATES)[number];

export interface ProjectMilestone {
  id: string;
  title: string;
  done: boolean;
  dependsOn: string[];
  acceptance: string[];
}

export interface ProjectRecord {
  id: string;
  title: string;
  projectClass: ProjectClass;
  purpose: string;
  goal: string;
  beneficiary?: string;
  creativeIntent: string;
  disciplineIds: string[];
  domainIds: string[];
  familyIds: string[];
  skillIds: string[];
  moduleIds: string[];
  objectiveIds: string[];
  deliverables: { id: string; title: string; accepted: boolean }[];
  acceptanceCriteria: { id: string; text: string; met: boolean }[];
  milestones: ProjectMilestone[];
  dependencies: string[];
  taskIds: string[];
  estimates: { minMinutes: number | null; maxMinutes: number | null; confidence: number | null };
  resources: string[];
  budget?: { amount: number; currency: string } | null;
  safetyNotes: string;
  collaborators: { name: string; role: string }[];
  decisions: { at: string; text: string }[];
  evidenceIds: string[];
  status: ProjectState;
  reflection: string;
  nextSteps: string[];
  updatedAt: string;
}

// ---------------------------------------------------------------------------------------------
// Practical Capability Library and atlas state
// ---------------------------------------------------------------------------------------------

export interface PclProgress {
  cardId: string;
  skillIds: string[];
  status: "not_started" | "practising" | "demonstrated" | "needs_revision";
  practiceCount: number;
  lastPractisedAt: string | null;
  notes: string;
}

export interface SpatialOverride {
  nodeId: string;
  x: number;
  y: number;
  z: number;
  assignedDisciplineId?: string;
  updatedAt: string;
}

export interface SideQuest {
  id: string;
  title: string;
  disciplineId?: string | null;
  objective: string;
  status: "open" | "assigned" | "done" | "dropped";
  sourcePack?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------------------------
// Persistence surface
// ---------------------------------------------------------------------------------------------

export const SYSTEM_TABLES = [
  "scheduleEvents",
  "routineTemplates",
  "routineOccurrences",
  "tasks",
  "availabilityWindows",
  "scheduleProposals",
  "activityActuals",
  "scheduleAuditEvents",
  "projects",
  "pclProgress",
  "spatialOverrides",
  "sideQuests",
] as const;
export type SystemTable = (typeof SYSTEM_TABLES)[number];

export type SystemRow = Record<string, unknown> & { id: string };

/** Which column each table is indexed by, in Dexie's schema-string syntax. */
export const SYSTEM_INDEXES: Record<SystemTable, string> = {
  scheduleEvents: "id, kind, status, startLocal",
  routineTemplates: "id, paused, category",
  routineOccurrences: "id, templateId, dateLocal, state",
  tasks: "id, projectId, status, dueLocal",
  availabilityWindows: "id, hard, startLocal",
  scheduleProposals: "id, decision, createdAt",
  activityActuals: "id, targetId, targetKind, startedAt",
  scheduleAuditEvents: "id, entityId, timestamp",
  projects: "id, projectClass, status, updatedAt",
  pclProgress: "cardId, status",
  spatialOverrides: "nodeId, assignedDisciplineId",
  sideQuests: "id, status, disciplineId",
};
