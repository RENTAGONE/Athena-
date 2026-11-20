// Project Engine. Exactly three canonical classes; teamwork is a collaboration format, not a class.
// Lifecycle transitions and milestone dependencies are validated here so the UI cannot offer a move the
// record does not support. Evidence is referenced, never duplicated; project tasks are shared with the
// schedule by id, never copied.
import type { ProjectClass, ProjectMilestone, ProjectRecord, ProjectState, ScheduleEvent, Task } from "../../domain/system.ts";

export const PROJECT_CLASS_META: Record<ProjectClass, { label: string; intent: string; success: string; metrics: boolean }> = {
  personal_use: {
    label: "Personal-use",
    intent: "Made to solve a real problem in your own life, work or environment.",
    success: "Demonstrable usefulness to you.",
    metrics: false,
  },
  product_business: {
    label: "Product / business-foundation",
    intent: "Made to serve other people as a product, service, offer or business asset.",
    success: "A real user, a real problem, and evidence that the thing works for them.",
    metrics: true,
  },
  intrinsic: {
    label: "Intrinsic / for its own sake",
    intent: "Made for exploration, craft, curiosity or expression.",
    success: "The making itself. No commercial or external outcome is required.",
    metrics: false,
  },
};

/** Allowed moves. Paused is not failed; abandoned is a deliberate outcome that keeps the work. */
export const LIFECYCLE: Record<ProjectState, ProjectState[]> = {
  captured_idea: ["scoped", "archived", "abandoned"],
  scoped: ["active", "paused", "archived", "abandoned", "captured_idea"],
  active: ["paused", "completed", "archived", "abandoned"],
  paused: ["active", "completed", "archived", "abandoned"],
  completed: ["archived", "active"],
  archived: ["captured_idea", "active"],
  abandoned: ["captured_idea", "archived"],
};

export function nextStates(state: ProjectState): ProjectState[] {
  return LIFECYCLE[state] ?? [];
}

export function canTransition(from: ProjectState, to: ProjectState): boolean {
  return nextStates(from).includes(to);
}

export interface ProjectIssue {
  code: string;
  severity: "error" | "warning";
  message: string;
}

export function validateProject(project: ProjectRecord): ProjectIssue[] {
  const issues: ProjectIssue[] = [];
  if (!project.title.trim()) issues.push({ code: "title_missing", severity: "error", message: "A project needs a title." });
  if (!(project.projectClass in PROJECT_CLASS_META)) issues.push({ code: "class_invalid", severity: "error", message: "A project must declare one of the three canonical classes." });
  if (!project.purpose.trim()) issues.push({ code: "purpose_missing", severity: "warning", message: "No purpose recorded. Why does this exist?" });
  if (project.status === "active" && !project.goal.trim()) issues.push({ code: "goal_missing", severity: "error", message: "An active project needs a stated goal." });
  if (project.status === "active" && project.milestones.length === 0 && project.deliverables.length === 0) {
    issues.push({ code: "no_deliverable", severity: "warning", message: "Nothing deliverable is defined yet, so completion cannot be judged." });
  }
  const ids = new Set(project.milestones.map((m) => m.id));
  for (const m of project.milestones) {
    for (const dep of m.dependsOn) {
      if (!ids.has(dep)) issues.push({ code: "milestone_dependency_missing", severity: "error", message: `Milestone “${m.title}” depends on ${dep}, which is not in this project.` });
    }
  }
  if (hasMilestoneCycle(project.milestones)) issues.push({ code: "milestone_cycle", severity: "error", message: "Milestone dependencies form a cycle, so no order can satisfy them." });
  if (project.status === "completed") {
    const open = project.milestones.filter((m) => !m.done);
    const unaccepted = project.deliverables.filter((d) => !d.accepted);
    if (open.length > 0) issues.push({ code: "milestones_open", severity: "error", message: `${open.length} milestone${open.length === 1 ? "" : "s"} are still open.` });
    if (unaccepted.length > 0) issues.push({ code: "deliverables_unaccepted", severity: "error", message: `${unaccepted.length} deliverable${unaccepted.length === 1 ? "" : "s"} have not been accepted.` });
  }
  if (project.projectClass === "product_business" && project.status === "completed" && project.evidenceIds.length === 0) {
    issues.push({ code: "claim_without_evidence", severity: "error", message: "A product claim needs attached evidence. No evidence is linked to this project." });
  }
  if (project.projectClass === "intrinsic" && project.budget && project.budget.amount > 0) {
    issues.push({ code: "intrinsic_budget", severity: "warning", message: "An intrinsic project does not need a business budget. Keep a materials cost instead if it matters." });
  }
  const dupes = new Set<string>();
  for (const id of project.skillIds) {
    if (dupes.has(id)) issues.push({ code: "duplicate_skill", severity: "warning", message: `Skill ${id} is linked twice.` });
    dupes.add(id);
  }
  return issues;
}

function hasMilestoneCycle(milestones: ProjectMilestone[]): boolean {
  const byId = new Map(milestones.map((m) => [m.id, m]));
  const state = new Map<string, 0 | 1 | 2>();
  const visit = (id: string): boolean => {
    const s = state.get(id);
    if (s === 1) return true;
    if (s === 2) return false;
    state.set(id, 1);
    const m = byId.get(id);
    if (m) for (const dep of m.dependsOn) if (visit(dep)) return true;
    state.set(id, 2);
    return false;
  };
  for (const m of milestones) if (visit(m.id)) return true;
  return false;
}

export type TransitionResult = { ok: true; project: ProjectRecord; issues: ProjectIssue[] } | { ok: false; reason: string; issues: ProjectIssue[] };

export function transition(project: ProjectRecord, to: ProjectState, now: Date): TransitionResult {
  if (!canTransition(project.status, to)) {
    return { ok: false, reason: `Cannot move a project from ${project.status} to ${to}.`, issues: validateProject(project) };
  }
  const next: ProjectRecord = { ...project, status: to, updatedAt: now.toISOString() };
  if (to === "active") {
    next.decisions = [...project.decisions, { at: now.toISOString(), text: `Resumed from ${project.status}.` }];
  }
  if (to === "paused") next.decisions = [...project.decisions, { at: now.toISOString(), text: "Paused deliberately; work is preserved." }];
  if (to === "abandoned") next.decisions = [...project.decisions, { at: now.toISOString(), text: "Abandoned as a deliberate decision; work and reason preserved." }];
  const issues = validateProject(next);
  const blocking = issues.filter((i) => i.severity === "error");
  if (blocking.length > 0) return { ok: false, reason: blocking[0]!.message, issues };
  return { ok: true, project: next, issues };
}

/** A milestone can start only when every declared dependency is done. */
export function milestoneBlockers(project: ProjectRecord, milestoneId: string): ProjectMilestone[] {
  const target = project.milestones.find((m) => m.id === milestoneId);
  if (!target) return [];
  return target.dependsOn.map((id) => project.milestones.find((m) => m.id === id)).filter((m): m is ProjectMilestone => !!m && !m.done);
}

export function completeMilestone(project: ProjectRecord, milestoneId: string, now: Date): { ok: true; project: ProjectRecord } | { ok: false; reason: string } {
  const blockers = milestoneBlockers(project, milestoneId);
  if (blockers.length > 0) {
    return { ok: false, reason: `Finish ${blockers.map((b) => `“${b.title}”`).join(", ")} first.` };
  }
  return {
    ok: true,
    project: {
      ...project,
      milestones: project.milestones.map((m) => (m.id === milestoneId ? { ...m, done: true } : m)),
      updatedAt: now.toISOString(),
    },
  };
}

export function setAcceptance(project: ProjectRecord, criterionId: string, met: boolean, now: Date): ProjectRecord {
  return {
    ...project,
    acceptanceCriteria: project.acceptanceCriteria.map((c) => (c.id === criterionId ? { ...c, met } : c)),
    updatedAt: now.toISOString(),
  };
}

/** Schedule integration by reference: the project stores the task id, the schedule owns the task. */
export function linkedTasks(project: ProjectRecord, tasks: Task[]): Task[] {
  return tasks.filter((t) => t.projectId === project.id || project.taskIds.includes(t.id));
}

export function scheduleEventsForProject(project: ProjectRecord, tasks: Task[], events: ScheduleEvent[]): ScheduleEvent[] {
  const ids = new Set(linkedTasks(project, tasks).map((t) => t.id));
  return events.filter((e) => (e.links["task"] ?? []).some((id) => ids.has(id)));
}

/** Read-only rollup. No percentage is invented; it reports counts of real items. */
export interface ProjectSummary {
  milestonesDone: number;
  milestonesTotal: number;
  deliverablesAccepted: number;
  deliverablesTotal: number;
  criteriaMet: number;
  criteriaTotal: number;
  linkedSkills: number;
  evidence: number;
  blocked: string[];
}

export function summarise(project: ProjectRecord): ProjectSummary {
  return {
    milestonesDone: project.milestones.filter((m) => m.done).length,
    milestonesTotal: project.milestones.length,
    deliverablesAccepted: project.deliverables.filter((d) => d.accepted).length,
    deliverablesTotal: project.deliverables.length,
    criteriaMet: project.acceptanceCriteria.filter((c) => c.met).length,
    criteriaTotal: project.acceptanceCriteria.length,
    linkedSkills: project.skillIds.length,
    evidence: project.evidenceIds.length,
    blocked: project.milestones.filter((m) => !m.done && milestoneBlockers(project, m.id).length > 0).map((m) => m.title),
  };
}

export function emptyProject(id: string, title: string, projectClass: ProjectClass, now: Date): ProjectRecord {
  return {
    id,
    title,
    projectClass,
    purpose: "",
    goal: "",
    creativeIntent: "",
    disciplineIds: [],
    domainIds: [],
    familyIds: [],
    skillIds: [],
    moduleIds: [],
    objectiveIds: [],
    deliverables: [],
    acceptanceCriteria: [],
    milestones: [],
    dependencies: [],
    taskIds: [],
    estimates: { minMinutes: null, maxMinutes: null, confidence: null },
    resources: [],
    budget: null,
    safetyNotes: "",
    collaborators: [],
    decisions: [],
    evidenceIds: [],
    status: "captured_idea",
    reflection: "",
    nextSteps: [],
    updatedAt: now.toISOString(),
  };
}
