import { getState, update, uid } from "./store";
import { daysBetween, TODAY } from "../lib/dates";
import { getChild, nowTime, actor } from "./childrenService";
import { CURRENT_WORKER } from "../data/seed";

export function bucket(f) {
  if (f.status === "completed") return "completed";
  const d = daysBetween(TODAY, f.due);
  return d < 0 ? "overdue" : d === 0 ? "today" : "upcoming";
}
export const listFollowups = (s = getState()) => s.followups;
export const forChild = (id, s = getState()) => s.followups.filter((f) => f.childId === id);
export const nextFor = (id, s = getState()) =>
  forChild(id, s).filter((f) => f.status === "pending").sort((a, b) => a.due.localeCompare(b.due))[0] ?? null;

const log = (text, childId) => ({ id: uid("a"), at: `${TODAY}T${nowTime()}`, text, kind: "followup", childId, actor });

export function scheduleFollowup(childId, { reason, due, priority }) {
  const child = getChild(childId);
  update((s) => ({
    ...s,
    followups: [...s.followups, { id: uid("f"), childId, reason: reason.trim(), due, priority, status: "pending", workerId: CURRENT_WORKER.id, completedOn: null }],
    activity: [log(`${actor} scheduled a follow-up for ${child.name}`, childId), ...s.activity],
  }));
}
export function updateFollowup(id, { reason, due, priority }) {
  const f = getState().followups.find((x) => x.id === id);
  const child = getChild(f.childId);
  update((s) => ({
    ...s,
    followups: s.followups.map((x) => (x.id === id ? { ...x, reason: reason.trim(), due, priority } : x)),
    activity: [log(`Follow-up updated for ${child.name}`, f.childId), ...s.activity],
  }));
}
export function completeFollowup(id) {
  const f = getState().followups.find((x) => x.id === id);
  const child = getChild(f.childId);
  update((s) => ({
    ...s,
    followups: s.followups.map((x) => (x.id === id ? { ...x, status: "completed", completedOn: TODAY } : x)),
    activity: [log(`Follow-up completed for ${child.name}`, f.childId), ...s.activity],
  }));
}
