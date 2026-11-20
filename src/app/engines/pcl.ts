// Practical Capability Library. PCL is an index over canonical ATH-SKILL / ATH-SUB / ATH-MICRO
// records, not a nineteenth discipline and not a second ontology. Every card points at records that
// already exist; a card with no canonical match is reported as NEW, never silently invented as a skill.
import type { DbState, NodeRecord } from "../../domain/types.ts";
import { SKILL_TYPES } from "./types.ts";

export const PCL_TRACKS = [
  "social_fluency",
  "speaking_expression",
  "presence_movement",
  "personal_organisation",
  "digital_independence",
  "household_competence",
  "financial_judgement",
  "critical_media",
  "navigation_awareness",
  "practical_learning",
] as const;
export type PclTrackId = (typeof PCL_TRACKS)[number];

export interface PclTrack {
  id: PclTrackId;
  title: string;
  outcome: string;
  why: string[];
  sequence: string[];
  workedExample: string;
  practice: string[];
  errors: { wrong: string; correction: string }[];
  demonstration: string;
  rubric: { criterion: string; levels: string[] }[];
  transfer: string;
  progression: string;
  estimateMinutes: number;
  safety: string[];
  /** Canonical record hints: title words and code fragments used to find existing records. */
  hints: string[];
  disciplines: string[];
}

export const PCL_TRACK_CONTENT: Record<PclTrackId, PclTrack> = {
  social_fluency: {
    id: "social_fluency",
    title: "Social fluency and conversation",
    outcome: "You can start a conversation, keep it going, listen properly and end it without forcing it.",
    why: ["Meeting people in an unfamiliar room", "Working with a group you did not choose", "Asking for help without oversharing"],
    sequence: [
      "Practise one opening line in three versions: a question, an observation, an offer.",
      "Hold a two-minute conversation where your only job is to ask follow-ups and remember one detail.",
      "Take one turn telling a 40-second story with a beginning, a middle and a stop.",
      "Disagree once without attacking the person: name the point, state your view, ask theirs.",
    ],
    workedExample: "At a class break: “Is this your first time here?” → they answer → “What made you pick it?” → reflect back the reason in your own words.",
    practice: ["Three openings with a friend, then one in a real setting.", "One conversation where you speak less than half the time.", "One respectful disagreement, written out first, then said aloud."],
    errors: [
      { wrong: "Filling every silence with another question.", correction: "Leave two seconds after an answer; people often continue unprompted." },
      { wrong: "Planning a script for the whole conversation.", correction: "Prepare only the opening and one backup topic; the rest is a response." },
    ],
    demonstration: "Hold a five-minute conversation with someone new, ask at least two follow-ups, and end it deliberately.",
    rubric: [
      { criterion: "Openings", levels: ["Waits to be approached", "Uses one prepared opening", "Chooses an opening that fits the room"] },
      { criterion: "Listening", levels: ["Returns to own topic", "Asks a follow-up", "Reflects the other person's meaning before replying"] },
      { criterion: "Closing", levels: ["Drifts away", "Says goodbye", "Closes clearly and leaves the door open"] },
    ],
    transfer: "Use the same three moves in a phone call, a shop enquiry and a family conversation — different scripts, same structure.",
    progression: "Move from one-to-one to a group of three, then to a room where you know nobody.",
    estimateMinutes: 90,
    safety: [
      "Assess controllable behaviour, not whether someone likes you. Popularity is not a competence.",
      "Quiet and neurodivergent ways of participating count: written follow-ups, side conversations, prepared notes.",
      "No manipulation, deceptive mirroring or coercion. Boundaries are part of the skill.",
    ],
    hints: ["conversation", "listen", "question", "introduc", "disagree", "boundar", "communicat"],
    disciplines: ["ATH-DISC-COMM", "ATH-DISC-PSY", "ATH-DISC-PERF"],
  },
  speaking_expression: {
    id: "speaking_expression",
    title: "Speaking and self-expression",
    outcome: "You can explain an idea out loud so that one listener can repeat it back correctly.",
    why: ["Explaining your work", "Answering a question you did not expect", "Saying what you actually mean"],
    sequence: [
      "Write one sentence: what you want the listener to understand.",
      "Say it in 30 seconds without notes; record yourself if that helps.",
      "Add one concrete example and one boundary (“what this is not”).",
      "Ask the listener to repeat it back, then correct only the part they missed.",
    ],
    workedExample: "“I need two more days because the survey is finished but the analysis is not. Here is what is done, here is what remains, and here is when you will have it.”",
    practice: ["Explain a familiar task in 30 seconds.", "Answer “what do you do?” in two sentences.", "Give one piece of feedback using observation, effect, request."],
    errors: [
      { wrong: "Starting with a long preamble.", correction: "Lead with the point; context comes second." },
      { wrong: "Speeding up when nervous.", correction: "Pause at the end of each sentence; the pause reads as control." },
    ],
    demonstration: "Explain a topic for 60 seconds and have the listener summarise it accurately.",
    rubric: [
      { criterion: "Clarity", levels: ["Listener asks what you mean", "Listener follows most of it", "Listener can restate the point"] },
      { criterion: "Structure", levels: ["No clear point", "Point plus detail", "Point, example, limit"] },
      { criterion: "Pace", levels: ["Rushed", "Mostly even", "Pauses used deliberately"] },
    ],
    transfer: "Record a 45-second voice note explaining the same idea to a different person.",
    progression: "One listener → small group → a recorded explanation you keep and review.",
    estimateMinutes: 75,
    safety: ["Stuttering, accent and dialect are not defects; work with how you speak.", "Do not imitate a voice that is not yours for approval."],
    hints: ["speak", "present", "explain", "story", "voice", "feedback"],
    disciplines: ["ATH-DISC-COMM", "ATH-DISC-PERF", "ATH-DISC-LANG"],
  },
  presence_movement: {
    id: "presence_movement",
    title: "Presence and everyday movement",
    outcome: "You can move through a familiar place with balance, awareness and a pace you choose.",
    why: ["Walking into a room without bracing", "Carrying something without losing balance", "Moving safely in a crowd"],
    sequence: [
      "Walk a familiar route at an even pace and notice where you speed up.",
      "Practise standing still for 30 seconds with weight evenly spread.",
      "Turn and change direction slowly, then at normal speed.",
      "Carry a light bag on one side, then the other, keeping the stride natural.",
    ],
    workedExample: "Before entering a busy room: stop at the door, feel both feet, choose a first destination, then walk to it without weaving.",
    practice: ["Two minutes of even-pace walking.", "One doorway entry with a deliberate pause.", "One carry across a room and back."],
    errors: [
      { wrong: "Copying an idealised posture.", correction: "Comfort and balance come first; there is no single correct gait or body shape." },
      { wrong: "Pushing through pain or dizziness.", correction: "Stop. Persistent pain or dizziness belongs with a qualified professional." },
    ],
    demonstration: "Walk a set route, turn twice and carry a light object without losing your pace or balance.",
    rubric: [
      { criterion: "Balance", levels: ["Unsteady", "Steady on flat ground", "Steady through turns and changes"] },
      { criterion: "Awareness", levels: ["Surprised by obstacles", "Notices obstacles", "Adjusts early without stopping"] },
      { criterion: "Comfort", levels: ["Braced", "Mostly relaxed", "Relaxed while moving at chosen pace"] },
    ],
    transfer: "Repeat on an unfamiliar route where the surface and the crowd are different.",
    progression: "Familiar room → corridor → street → crowded public space, at your own pace.",
    estimateMinutes: 60,
    safety: [
      "No medical or rehabilitation claims. This is not corrective exercise.",
      "Skip weighted drills; they are not part of this track.",
      "Pain, injury or persistent difficulty: refer to a trusted adult or qualified professional.",
    ],
    hints: ["walk", "posture", "balance", "movement", "body", "physical", "presence"],
    disciplines: ["ATH-DISC-ATH", "ATH-DISC-BODY", "ATH-DISC-PERF"],
  },
  personal_organisation: {
    id: "personal_organisation",
    title: "Personal organisation and self-management",
    outcome: "You can turn a vague intention into a scheduled first action you actually start.",
    why: ["A week with too many commitments", "A task you keep avoiding", "Knowing what to do next without a mood check"],
    sequence: [
      "Capture every open item in one list, including the small ones.",
      "Mark each item's real next action as a verb (“write two lines”, not “essay”).",
      "Estimate the first action in minutes, deliberately low.",
      "Put one action into a real window with a start time and a stop time.",
    ],
    workedExample: "“Clean the kitchen” becomes “clear one counter, 10 minutes, after lunch”, with the rest left visible rather than hidden.",
    practice: ["One capture sweep of 10 items.", "Three next actions written as verbs.", "One action scheduled and started at the stated time."],
    errors: [
      { wrong: "Building a perfect system before using it.", correction: "Use a plain list for a week; add structure where it actually hurt." },
      { wrong: "Rolling every unfinished task into tomorrow.", correction: "Decide again tomorrow: keep, shrink, reschedule or drop. No debt pile." },
    ],
    demonstration: "Capture a messy list, choose one next action and start it within the planned window.",
    rubric: [
      { criterion: "Capture", levels: ["Kept in head", "Some items written", "Everything open is captured once"] },
      { criterion: "Next action", levels: ["Vague topic", "Verb but broad", "Specific, small, startable"] },
      { criterion: "Follow-through", levels: ["Never started", "Started late", "Started at the planned time"] },
    ],
    transfer: "Apply the same capture-and-shrink routine to a different area: study, money or household.",
    progression: "One list → a daily review → a weekly review that removes as much as it adds.",
    estimateMinutes: 45,
    safety: ["No streak punishment. Missing a day is information, not a moral failure.", "Protect sleep and recovery as real commitments."],
    hints: ["organis", "plan", "priorit", "time", "habit", "routine", "focus", "manage"],
    disciplines: ["ATH-DISC-WORK", "ATH-DISC-INDEP", "ATH-DISC-PSY"],
  },
  digital_independence: {
    id: "digital_independence",
    title: "Digital independence and troubleshooting",
    outcome: "You can diagnose a failing device or account and recover it without guessing.",
    why: ["An account locked before a deadline", "A device that will not connect", "A file you cannot find"],
    sequence: [
      "Write the exact symptom and the last thing that changed.",
      "Check the smallest layer first: power, cable, connection, sign-in.",
      "Change one variable at a time and note the result.",
      "Before trying a fix, confirm you can undo it; back up what matters first.",
    ],
    workedExample: "Laptop will not load a page: check another site → check another device → check the cable/router → only then restart the router. Each step eliminates one layer.",
    practice: ["Reproduce one fault deliberately and fix it.", "Write a five-line recovery note a friend could follow.", "Check the backup and restore one file from it."],
    errors: [
      { wrong: "Changing several settings at once.", correction: "One change at a time, recorded, so you know what worked." },
      { wrong: "Following a fix from a stranger without checking what it does.", correction: "Read what the command or setting changes before running it." },
    ],
    demonstration: "Diagnose an induced fault and restore normal operation, explaining each step.",
    rubric: [
      { criterion: "Diagnosis", levels: ["Random tries", "Checks the obvious", "Eliminates layers in order"] },
      { criterion: "Safety", levels: ["No backup", "Backs up sometimes", "Confirms reversibility before changing"] },
      { criterion: "Explanation", levels: ["Cannot explain", "Names the fix", "Explains cause and evidence"] },
    ],
    transfer: "Diagnose a different class of fault: account, storage or network.",
    progression: "Single device → account recovery → a small network with more than one user.",
    estimateMinutes: 80,
    safety: ["Never put passwords in a note or a chat.", "Check recovery options before locking yourself out.", "Scam messages are designed to rush you; slow down."],
    hints: ["digital", "computer", "software", "internet", "security", "password", "file", "troubleshoot"],
    disciplines: ["ATH-DISC-CYBER", "ATH-DISC-ENG", "ATH-DISC-ELEC"],
  },
  household_competence: {
    id: "household_competence",
    title: "Practical household competence",
    outcome: "You can keep a living space functional: food, laundry, surfaces and small repairs.",
    why: ["Living alone for the first time", "A shared flat with no system", "Something breaks and nobody is coming"],
    sequence: [
      "Choose one repeatable meal and cook it three times, adjusting only one thing each time.",
      "Run one full laundry cycle: sort, dose, wash, dry, fold.",
      "Clean one surface properly, including the part you usually skip.",
      "Fix one small thing with the right tool, or stop and find out what the right tool is.",
    ],
    workedExample: "A 20-minute meal: rice on, protein seasoned, vegetable cut, all finished within five minutes of each other. The second attempt shortens the wait, not the recipe.",
    practice: ["Cook the same meal twice.", "Do one full laundry cycle unaided.", "Complete one repair or report it with the correct name for the part."],
    errors: [
      { wrong: "Buying equipment before knowing the job.", correction: "Name the task and the material first; then choose the tool." },
      { wrong: "Mixing cleaning chemicals to save time.", correction: "Never mix. Use one product, read the label, ventilate." },
    ],
    demonstration: "Prepare a meal, run a laundry cycle and leave the kitchen clean in one session.",
    rubric: [
      { criterion: "Food", levels: ["Relies on others", "Follows a recipe", "Adapts with what is available"] },
      { criterion: "Upkeep", levels: ["Waits until unusable", "Reacts when needed", "Keeps a repeatable rhythm"] },
      { criterion: "Safety", levels: ["Ignores labels", "Reads labels", "Reads labels and plans the safe order"] },
    ],
    transfer: "Cook the same meal for two people and adjust quantities and timing.",
    progression: "One meal and one laundry cycle → a week of meals → shared-household coordination.",
    estimateMinutes: 120,
    safety: ["Knives, heat and chemicals need attention, not fear.", "Gas, electrical or structural problems: isolate and call someone qualified."],
    hints: ["cook", "food", "clean", "laundry", "home", "repair", "household", "kitchen"],
    disciplines: ["ATH-DISC-INDEP", "ATH-DISC-WORK", "ATH-DISC-ENG"],
  },
  financial_judgement: {
    id: "financial_judgement",
    title: "Financial and consumer judgement",
    outcome: "You can compare two real options, state the true total cost and explain your choice.",
    why: ["A subscription that renews", "A purchase with a hidden fee", "A decision you cannot undo"],
    sequence: [
      "Write the total cost over the whole period, not the monthly headline.",
      "List what happens if you cancel, return or miss a payment.",
      "Compare at least two options on the same three criteria.",
      "Wait one day before any purchase you cannot reverse.",
    ],
    workedExample: "Phone contract A: 24 × 18 = 432 plus 30 setup. Contract B: 12 × 25 = 300 then 12 × 15 = 180, total 480. A is cheaper across two years even though B looks cheaper monthly.",
    practice: ["Total-cost one real subscription.", "Compare two products on identical criteria.", "Write the cancellation terms in your own words."],
    errors: [
      { wrong: "Comparing monthly prices with different contract lengths.", correction: "Normalise to the same period before comparing." },
      { wrong: "Treating a discount as a reason to buy.", correction: "Decide whether you need it at full price first." },
    ],
    demonstration: "Produce a one-page comparison of two real options with total cost and exit terms.",
    rubric: [
      { criterion: "Total cost", levels: ["Headline price only", "Includes fees", "Includes fees, period and exit cost"] },
      { criterion: "Risk", levels: ["Not considered", "Names one risk", "States what happens if it goes wrong"] },
      { criterion: "Decision", levels: ["Impulse", "Delayed", "Delayed with written criteria"] },
    ],
    transfer: "Apply the same comparison to a service you already pay for and decide to keep, change or cancel it.",
    progression: "One purchase → a monthly budget → a yearly commitment with an exit plan.",
    estimateMinutes: 60,
    safety: ["This is judgement practice, not regulated financial advice.", "Never share account credentials or one-time codes.", "Urgency is a sales technique; treat a countdown as a reason to slow down."],
    hints: ["money", "financ", "budget", "consumer", "cost", "purchas", "invest"],
    disciplines: ["ATH-DISC-FIN", "ATH-DISC-BIZ", "ATH-DISC-MATH"],
  },
  critical_media: {
    id: "critical_media",
    title: "Critical judgement and media literacy",
    outcome: "You can separate a claim from its evidence and say what would change your mind.",
    why: ["A screenshot circulating as proof", "A statistic with no source", "A recommendation that benefits the recommender"],
    sequence: [
      "Restate the claim in one sentence, without the emotion of the original.",
      "Ask what evidence is offered, who produced it and when.",
      "Find the primary source, or record that there is none.",
      "State what evidence would change your mind before you decide.",
    ],
    workedExample: "“Studies show…” → which study, by whom, on how many people, over what period? If the only source is the article itself, the claim is unsupported, not proven false.",
    practice: ["Trace one claim to its primary source.", "Identify the interest of the person making a recommendation.", "Write a falsifiable counter-claim."],
    errors: [
      { wrong: "Treating a confident tone as evidence.", correction: "Confidence is not a source; look for the underlying record." },
      { wrong: "Rejecting a claim because you dislike the speaker.", correction: "Assess the evidence separately from the messenger." },
    ],
    demonstration: "Take one real claim, trace its source and write a short assessment with what remains unknown.",
    rubric: [
      { criterion: "Claim", levels: ["Repeats the headline", "Restates it plainly", "Restates it and names the implied scope"] },
      { criterion: "Source", levels: ["None checked", "Finds a secondary source", "Finds the primary record or documents its absence"] },
      { criterion: "Uncertainty", levels: ["Certain", "Some doubt", "States what would change the conclusion"] },
    ],
    transfer: "Assess a claim in a different medium: video, advertisement or a conversation.",
    progression: "One claim → a feed of claims → a decision where the evidence is genuinely mixed.",
    estimateMinutes: 70,
    safety: ["Do not harass the person behind a claim.", "Check before sharing anything that names a private individual."],
    hints: ["critical", "media", "evidence", "source", "research", "inform", "bias"],
    disciplines: ["ATH-DISC-RES", "ATH-DISC-COMM", "ATH-DISC-PSY"],
  },
  navigation_awareness: {
    id: "navigation_awareness",
    title: "Navigation and situational awareness",
    outcome: "You can get to an unfamiliar place and back, and notice what is around you on the way.",
    why: ["A new city", "A phone battery that dies", "A route that changes at night"],
    sequence: [
      "Before leaving, name your start, destination and one landmark between them.",
      "Travel without turn-by-turn for one leg, checking the map at decision points only.",
      "On arrival, note two features that will help you return.",
      "On the return, take a different but safe route and compare.",
    ],
    workedExample: "Leave the station, orient by the river, walk two blocks parallel to it, turn at the bridge, then use the tower as the final landmark.",
    practice: ["One leg without guidance.", "One return by a different route.", "One map drawn from memory and corrected."],
    errors: [
      { wrong: "Following the dot without looking up.", correction: "Check the map at junctions, then walk with your eyes on the street." },
      { wrong: "Taking an unfamiliar shortcut at night to save time.", correction: "Choose the lit, populated route; time is not worth the risk." },
    ],
    demonstration: "Reach an unfamiliar destination and return using a different route, without continuous guidance.",
    rubric: [
      { criterion: "Orientation", levels: ["Lost without the phone", "Uses landmarks", "Knows the cardinal direction and a fallback"] },
      { criterion: "Awareness", levels: ["Head down", "Notices crossings", "Tracks exits, people and changes"] },
      { criterion: "Recovery", levels: ["Stops", "Asks for help", "Re-plans from the current position"] },
    ],
    transfer: "Navigate an unfamiliar building or a transport network with the same three steps.",
    progression: "Familiar route → unfamiliar route → a journey with a disruption.",
    estimateMinutes: 90,
    safety: ["Share your route with someone you trust when travelling alone at night.", "Trust your discomfort; leave a situation before explaining it."],
    hints: ["navigat", "map", "direction", "travel", "spatial", "orient"],
    disciplines: ["ATH-DISC-INDEP", "ATH-DISC-ATH", "ATH-DISC-WORK"],
  },
  practical_learning: {
    id: "practical_learning",
    title: "Practical learning and communication",
    outcome: "You can learn a small practical skill from an example and teach it back accurately.",
    why: ["A skill nobody will sit down and teach you", "A tutorial that assumes too much", "Explaining what you just learned"],
    sequence: [
      "Watch the example once without copying, and name the goal.",
      "Break it into three steps you can say out loud.",
      "Do it slowly, narrating each step; correct one thing per attempt.",
      "Teach it to someone else and answer one question you did not prepare for.",
    ],
    workedExample: "Tying a secure knot: hold the standing line, form the loop, pass the working end, tighten in the direction that keeps the loop. Three steps, one correction per attempt.",
    practice: ["Learn one small skill from a demonstration.", "Write the three-step version.", "Teach it back and note the question you could not answer."],
    errors: [
      { wrong: "Copying quickly and hoping the shape is right.", correction: "Slow down until each step is deliberate, then build speed." },
      { wrong: "Explaining with jargon you cannot define.", correction: "Use the plainest word that is still accurate." },
    ],
    demonstration: "Perform a small skill and teach it to another person who then performs it correctly.",
    rubric: [
      { criterion: "Accuracy", levels: ["Rough result", "Works with help", "Works unaided"] },
      { criterion: "Explanation", levels: ["Cannot explain", "Lists steps", "Explains why each step matters"] },
      { criterion: "Transfer", levels: ["Only this exact case", "Similar case", "Adapts to a changed material or tool"] },
    ],
    transfer: "Teach the same skill with a different tool or material and note what changed.",
    progression: "One skill → a family of related skills → designing your own practice sequence.",
    estimateMinutes: 60,
    safety: ["Check the tool and the environment before practising.", "Stop when tired; errors cluster at the end of a session."],
    hints: ["learn", "practice", "teach", "study", "explain", "skill"],
    disciplines: ["ATH-DISC-RES", "ATH-DISC-COMM", "ATH-DISC-WORK"],
  },
};

export interface PclCard {
  id: PclTrackId;
  track: PclTrack;
  canonical: NodeRecord[];
  disposition: "REUSE" | "EXTEND" | "NEW" | "DEFER";
  sections: {
    outcome: string;
    why: string[];
    foundations: { title: string; code: string }[];
    gates: { title: string; code: string }[];
    sequence: string[];
    workedExample: string;
    practice: string[];
    errors: { wrong: string; correction: string }[];
    demonstration: string;
    rubric: { criterion: string; levels: string[] }[];
    transfer: string;
    progression: string;
    estimateMinutes: number;
    safety: string[];
    links: { title: string; code: string; type: string }[];
    provenance: string;
  };
}

function matchesTrack(state: DbState, track: PclTrack): NodeRecord[] {
  const hints = track.hints;
  const out: NodeRecord[] = [];
  for (const n of Object.values(state.nodes)) {
    if (!SKILL_TYPES.has(n.object_type)) continue;
    const hay = `${n.title} ${n.code}`.toLowerCase();
    if (!hints.some((h) => hay.includes(h))) continue;
    if (track.disciplines.length > 0 && n.owner_discipline_id && !track.disciplines.includes(n.owner_discipline_id)) continue;
    out.push(n);
  }
  return out.sort((a, b) => a.code.localeCompare(b.code)).slice(0, 8);
}

/**
 * Builds the ten capability cards. Content is authored guidance; canonical links are existing records.
 * An empty match list is reported honestly as NEW rather than manufacturing a skill record.
 */
export function buildCapabilityCards(state: DbState): PclCard[] {
  return PCL_TRACKS.map((id) => {
    const track = PCL_TRACK_CONTENT[id];
    const canonical = matchesTrack(state, track);
    const foundations = canonical.filter((n) => n.object_type === "subskill" || n.object_type === "micro_skill").slice(0, 4);
    const gates = canonical.filter((n) => n.object_type === "skill").slice(0, 3);
    return {
      id,
      track,
      canonical,
      disposition: canonical.length >= 3 ? "REUSE" : canonical.length > 0 ? "EXTEND" : "NEW",
      sections: {
        outcome: track.outcome,
        why: track.why,
        foundations: foundations.map((n) => ({ title: n.title, code: n.code })),
        gates: gates.map((n) => ({ title: n.title, code: n.code })),
        sequence: track.sequence,
        workedExample: track.workedExample,
        practice: track.practice,
        errors: track.errors,
        demonstration: track.demonstration,
        rubric: track.rubric,
        transfer: track.transfer,
        progression: track.progression,
        estimateMinutes: track.estimateMinutes,
        safety: track.safety,
        links: canonical.map((n) => ({ title: n.title, code: n.code, type: n.object_type })),
        provenance: "Authored PCL guidance over canonical records already in this local store; no core ontology was duplicated.",
      },
    };
  });
}

export interface PclAuditRow {
  track: PclTrackId;
  disposition: PclCard["disposition"];
  matches: number;
  codes: string[];
}

export function pclAudit(state: DbState): PclAuditRow[] {
  return buildCapabilityCards(state).map((c) => ({ track: c.id, disposition: c.disposition, matches: c.canonical.length, codes: c.canonical.map((n) => n.code) }));
}
