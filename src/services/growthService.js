import { daysAgo, TODAY } from "../lib/dates";

export const calculateBMI = (weightKg, heightCm) => {
  const w = Number(weightKg), h = Number(heightCm) / 100;
  return w > 0 && h > 0 ? Number((w / (h * h)).toFixed(1)) : null;
};
export const latestMeasurement = (c) => c?.measurements?.at(-1) ?? null;

export const STATUS = {
  healthy: { label: "On track", tone: "success", rank: 0 },
  stable: { label: "Stable", tone: "info", rank: 1 },
  monitoring: { label: "Follow-up recommended", tone: "warning", rank: 2 },
  priority: { label: "Review recommended", tone: "danger", rank: 3 },
  new: { label: "New: no trend yet", tone: "neutral", rank: 1 },
};
// Plain-language monitoring note shown on a child's profile. Operational wording only; never a diagnosis.
export function monitoringNote(child) {
  const last = latestMeasurement(child);
  if (!last) return "No measurements yet";
  if (daysAgo(last.date) > 30) return "Measurement overdue";
  const k = growthStatus(child);
  return { healthy: "Monitoring on track", stable: "Monitoring on track", monitoring: "Measurement follow-up recommended", priority: "Growth trend requires review", new: "Not enough data for a trend" }[k];
}

// Operational monitoring only; not a clinical assessment.
export function growthStatus(child) {
  const m = child.measurements;
  if (!m.length || m.length < 2) return "new";
  const last = m.at(-1), prev = m.at(-2), prev2 = m.at(-3);
  const gap = daysAgo(last.date);
  const d1 = last.weight - prev.weight;
  const d2 = prev2 ? prev.weight - prev2.weight : 0;
  if ((d1 < 0 && d2 < 0) || gap > 60) return "priority";
  if (d1 < 0.1 || gap > 30) return "monitoring";
  if (d1 < 0.3) return "stable";
  return "healthy";
}

export function trend(child, key = "weight") {
  const m = child.measurements;
  if (m.length < 2) return { dir: "none", delta: 0, label: "Not enough data" };
  const delta = Number((m.at(-1)[key] - m.at(-2)[key]).toFixed(2));
  const floor = key === "height" ? 0.4 : 0.1;
  if (delta >= floor * 2) return { dir: "up", delta, label: "Improving" };
  if (delta >= floor) return { dir: "flat", delta, label: "Stable" };
  return { dir: "down", delta, label: "Needs attention" };
}

export function velocity(child) {
  const m = child.measurements;
  if (m.length < 2) return null;
  const a = m[0], b = m.at(-1);
  const months = Math.max(1, (new Date(b.date) - new Date(a.date)) / (30 * 86400000));
  return { height: Number(((b.height - a.height) / months).toFixed(2)), weight: Number(((b.weight - a.weight) / months).toFixed(2)) };
}

// Points for charts, optionally limited to a recent window in days.
export function seriesFor(child, days) {
  return child.measurements
    .filter((m) => !days || daysAgo(m.date) <= days)
    .map((m) => ({ ...m, bmi: calculateBMI(m.weight, m.height) }));
}

export function averageSeries(children, days = 180) {
  const buckets = {};
  children.forEach((c) => c.measurements.forEach((m) => {
    if (daysAgo(m.date) > days) return;
    const k = m.date.slice(0, 7);
    (buckets[k] ??= []).push(m);
  }));
  return Object.keys(buckets).sort().map((k) => {
    const arr = buckets[k];
    const avg = (f) => Number((arr.reduce((s, x) => s + x[f], 0) / arr.length).toFixed(1));
    return { month: k, height: avg("height"), weight: avg("weight"), measurements: arr.length };
  });
}

export const needsMeasurement = (c, days = 30) => !latestMeasurement(c) || daysAgo(latestMeasurement(c).date) > days;
export const todayISO = () => TODAY;
