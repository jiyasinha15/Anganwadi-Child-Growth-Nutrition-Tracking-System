import { getState, update, uid } from "./store";
import { centres, CURRENT_WORKER } from "../data/seed";
import { TODAY } from "../lib/dates";
import { calculateBMI } from "./growthService";

export const listChildren = (s = getState()) => s.children;
export const getChild = (id, s = getState()) => s.children.find((c) => c.id === id);
export const centreName = (id) => centres.find((c) => c.id === id)?.name ?? "—";
export const nowTime = () => "11:00"; // fixed so demo activity stays deterministic
export const actor = CURRENT_WORKER.name.split(" ")[0];

const stamp = (text, kind, childId) => ({ id: uid("a"), at: `${TODAY}T${nowTime()}`, text, kind, childId, actor });
const note = (type, body, to, category) => ({ id: uid("nt"), type, category, body, at: `${TODAY}T${nowTime()}`, read: false, to });

export function registerChild(data) {
  const centre = centres.find((c) => c.id === data.centreId) ?? centres[0];
  const id = String(Math.max(0, ...getState().children.map((c) => Number(c.id))) + 1);
  const child = {
    id, name: data.name.trim(), dob: data.dob, gender: data.gender, guardian: data.guardian.trim(),
    phone: data.phone, centreId: centre.id, center: centre.name, address: data.address?.trim() || centre.location,
    registeredOn: TODAY, scenario: "new", measurements: [],
  };
  if (data.height && data.weight) {
    child.measurements.push({ date: data.date || TODAY, height: Number(data.height), weight: Number(data.weight), notes: "Initial measurement at registration", recordedBy: actor });
  }
  update((s) => ({
    ...s, children: [...s.children, child],
    activity: [stamp(`New child registered: ${child.name}`, "register", id), ...s.activity],
  }));
  return child;
}

// Records a measurement and updates the child, activity feed and notifications together.
export function addMeasurement(childId, { date, height, weight, notes }) {
  const child = getChild(childId);
  const entry = { date, height: Number(height), weight: Number(weight), notes: (notes || "").trim(), recordedBy: actor };
  update((s) => ({
    ...s,
    children: s.children.map((c) => c.id === childId
      ? { ...c, measurements: [...c.measurements, entry].sort((a, b) => a.date.localeCompare(b.date)) } : c),
    activity: [stamp(`${actor} recorded a measurement for ${child.name}`, "measurement", childId), ...s.activity],
    notifications: [note("done", `Measurement recorded for ${child.name}.`, `/children/${childId}`, "Measurement"), ...s.notifications],
  }));
  return { ...entry, bmi: calculateBMI(weight, height) };
}

// Child-specific timeline built from the shared activity log plus the registration date.
export function childTimeline(childId, s = getState()) {
  const child = getChild(childId, s);
  if (!child) return [];
  const items = s.activity.filter((a) => a.childId === childId)
    .map((a) => ({ id: a.id, at: a.at, text: a.text, kind: a.kind, actor: a.actor }));
  const measureDates = child.measurements.map((m) => ({ id: `m-${m.date}`, at: `${m.date}T09:00`, text: `Measurement recorded: ${m.height} cm, ${m.weight} kg`, kind: "measurement", actor: m.recordedBy }));
  const loggedMeasure = new Set(items.filter((i) => i.kind === "measurement").map((i) => i.at.slice(0, 10)));
  const merged = [...items, ...measureDates.filter((m) => !loggedMeasure.has(m.at.slice(0, 10)))];
  merged.push({ id: `reg-${child.id}`, at: `${child.registeredOn}T09:00`, text: `Registered at ${child.center}`, kind: "register" });
  return merged.sort((a, b) => b.at.localeCompare(a.at));
}
export const addNotification = (n) => update((s) => ({ ...s, notifications: [{ id: uid("nt"), read: false, at: `${TODAY}T${nowTime()}`, ...n }, ...s.notifications] }));
