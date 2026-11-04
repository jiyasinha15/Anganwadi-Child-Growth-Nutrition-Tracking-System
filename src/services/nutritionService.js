import { getState, update, uid } from "./store";
import { daysAgo, TODAY } from "../lib/dates";
import { getChild, nowTime, actor } from "./childrenService";

export const recordsFor = (childId, s = getState()) => s.nutrition.filter((n) => n.childId === childId);
export const latestRecord = (childId, s = getState()) => recordsFor(childId, s)[0] ?? null;
// A child is "complete" when a record exists within the last 7 days.
export const isComplete = (childId, s = getState()) => { const r = latestRecord(childId, s); return !!r && daysAgo(r.date) <= 7; };
export const NUTRITION_STATUS = (childId, s = getState()) => {
  const r = latestRecord(childId, s);
  if (!r) return "missing";
  return daysAgo(r.date) <= 7 ? "complete" : "stale";
};

export function logNutrition(childId, rec) {
  const child = getChild(childId);
  update((s) => ({
    ...s,
    nutrition: [{ id: uid("n"), childId, ...rec, recordedBy: actor }, ...s.nutrition].sort((a, b) => b.date.localeCompare(a.date)),
    activity: [{ id: uid("a"), at: `${TODAY}T${nowTime()}`, text: `Nutrition record added for ${child.name}`, kind: "nutrition", childId, actor }, ...s.activity],
    notifications: [{ id: uid("nt"), type: "done", category: "Nutrition", body: `Nutrition record added for ${child.name}.`, at: `${TODAY}T${nowTime()}`, read: false, to: `/children/${childId}` }, ...s.notifications],
  }));
}
