import { getState } from "./store";
import { centres, workers } from "../data/seed";
import { daysAgo } from "../lib/dates";
import { growthStatus, latestMeasurement, needsMeasurement, trend } from "./growthService";
import { isComplete } from "./nutritionService";
import { bucket } from "./followupService";

const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

export function overview(s = getState(), centreId = null) {
  const kids = centreId ? s.children.filter((c) => c.centreId === centreId) : s.children;
  const ids = new Set(kids.map((c) => c.id));
  const fups = s.followups.filter((f) => ids.has(f.childId));
  const statuses = kids.reduce((a, c) => { const k = growthStatus(c); a[k] = (a[k] || 0) + 1; return a; }, {});
  const monthMeasurements = kids.reduce((n, c) => n + c.measurements.filter((m) => daysAgo(m.date) <= 30).length, 0);
  const prevMonthMeasurements = kids.reduce((n, c) => n + c.measurements.filter((m) => daysAgo(m.date) > 30 && daysAgo(m.date) <= 60).length, 0);
  const completedWeek = fups.filter((f) => f.status === "completed" && f.completedOn && daysAgo(f.completedOn) <= 7).length;
  const nutritionDone = kids.filter((c) => isComplete(c.id, s)).length;
  const pending = fups.filter((f) => f.status === "pending");
  const completed = fups.filter((f) => f.status === "completed").length;
  return {
    children: kids.length,
    statuses,
    attention: kids.filter((c) => ["monitoring", "priority"].includes(growthStatus(c))).length,
    unmeasured: kids.filter((c) => needsMeasurement(c)),
    monthMeasurements, prevMonthMeasurements, completedWeek,
    avgWeight: avg(kids, "weight"), avgHeight: avg(kids, "height"),
    nutritionDone, nutritionPct: pct(nutritionDone, kids.length),
    pending: pending.length,
    overdue: pending.filter((f) => bucket(f) === "overdue").length,
    dueToday: pending.filter((f) => bucket(f) === "today").length,
    dueWeek: pending.filter((f) => ["today", "upcoming"].includes(bucket(f)) && daysAgo(f.due) >= -7).length,
    followupCompletionPct: pct(completed, fups.length),
    coveragePct: pct(kids.length - kids.filter((c) => needsMeasurement(c)).length, kids.length),
  };
}
function avg(kids, key) {
  const v = kids.map(latestMeasurement).filter(Boolean).map((m) => m[key]);
  return v.length ? Number((v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)) : 0;
}

export function centreStats(s = getState()) {
  return centres.map((c) => {
    const o = overview(s, c.id);
    const score = Math.round((o.coveragePct + o.nutritionPct + o.followupCompletionPct) / 3);
    return { ...c, ...o, workers: workers.filter((w) => w.centre === c.id).length, score,
      performance: c.status === "Inactive" ? "Inactive" : score >= 75 ? "Strong" : score >= 55 ? "On track" : "Needs support" };
  });
}

// Today's priorities for the worker, ordered by urgency.
export function priorities(s = getState()) {
  const items = [];
  s.followups.filter((f) => f.status === "pending" && bucket(f) !== "upcoming").forEach((f) => {
    const child = s.children.find((c) => c.id === f.childId);
    items.push({ id: f.id, level: f.priority === "High" || bucket(f) === "overdue" ? "high" : "medium", child, reason: f.reason,
      when: bucket(f) === "overdue" ? `Overdue ${daysAgo(f.due)}d` : "Due today", action: "followup", followup: f });
  });
  s.children.filter((c) => growthStatus(c) === "priority" && !items.some((i) => i.child.id === c.id)).forEach((c) =>
    items.push({ id: `p${c.id}`, level: "high", child: c, reason: "Growth trend requires review", when: "Needs review", action: "review" }));
  s.children.filter((c) => needsMeasurement(c) && !items.some((i) => i.child.id === c.id)).forEach((c) => {
    const last = latestMeasurement(c);
    items.push({ id: `m${c.id}`, level: last && daysAgo(last.date) > 45 ? "high" : "medium", child: c, reason: "Measurement overdue",
      when: last ? `Last measured ${daysAgo(last.date)} days ago` : "No measurement yet", action: "measure" });
  });
  const rank = { high: 0, medium: 1 };
  const out = items.sort((a, b) => rank[a.level] - rank[b.level]);
  const done = s.followups.filter((f) => f.status === "completed" && daysAgo(f.completedOn) <= 3).slice(0, 2).map((f) => ({
    id: `d${f.id}`, level: "done", child: s.children.find((c) => c.id === f.childId), reason: f.reason, when: `Done ${daysAgo(f.completedOn)}d ago`, action: "profile" }));
  return [...out, ...done];
}

// Limits state to one centre so worker screens only ever see their own children.
export function scopeState(s, centreId) {
  if (!centreId) return s;
  const kids = s.children.filter((c) => c.centreId === centreId);
  const ids = new Set(kids.map((c) => c.id));
  return { ...s, children: kids, followups: s.followups.filter((f) => ids.has(f.childId)),
    nutrition: s.nutrition.filter((n) => ids.has(n.childId)), activity: s.activity.filter((a) => !a.childId || ids.has(a.childId)) };
}

export function insights(s = getState()) {
  const o = overview(s);
  const slower = s.children.filter((c) => trend(c).dir === "down");
  const lowNutrition = s.children.filter((c) => !isComplete(c.id, s));
  const centre = centres.find((c) => c.id === s.children[0]?.centreId);
  return [
    { id: "i1", severity: o.unmeasured.length ? "attention" : "positive", icon: "Clock", affected: o.unmeasured.length,
      title: `${o.unmeasured.length} ${o.unmeasured.length === 1 ? "child has" : "children have"} not been measured in the last 30 days`,
      body: "Regular measurements keep growth records reliable and make trends easier to review.",
      suggestion: "Record a measurement for each child listed.", cta: "Review children", to: "/children?status=due" },
    { id: "i2", severity: slower.length ? "review" : "positive", icon: "TrendingDown", affected: slower.length,
      title: `${slower.length} ${slower.length === 1 ? "child shows" : "children show"} slower weight progression than their previous measurements`,
      body: "This is a monitoring signal, not a diagnosis. Review with an appropriate health professional.",
      suggestion: "Open growth monitoring and review each trend.", cta: "Open growth monitoring", to: "/growth" },
    { id: "i3", severity: o.nutritionPct >= 80 ? "positive" : "attention", icon: "Apple", affected: lowNutrition.length,
      title: `Nutrition records are complete for ${o.nutritionPct}% of enrolled children`,
      body: "Complete means a nutrition record within the last 7 days.",
      suggestion: lowNutrition.length ? "Add records for children without a recent entry." : "No action needed this week.", cta: "Open nutrition", to: "/nutrition?filter=attention" },
    { id: "i4", severity: o.coveragePct >= 80 ? "positive" : "attention", icon: "Trophy", affected: o.children,
      title: `${centre?.short ?? "Your centre"} has ${o.coveragePct}% monitoring coverage`,
      body: "Coverage is the share of enrolled children measured in the last 30 days.",
      suggestion: "Keep coverage above 80% by measuring children on schedule.", cta: "View children", to: "/children" },
    { id: "i5", severity: o.overdue ? "attention" : "info", icon: "CalendarCheck", affected: o.dueWeek + o.overdue,
      title: `${o.dueWeek} follow-ups are due this week`,
      body: `${o.overdue} more ${o.overdue === 1 ? "is" : "are"} already overdue.`,
      suggestion: "Complete or reschedule the follow-ups that are due.", cta: "Review follow-ups", to: "/followups" },
  ];
}

export function workerStats(s = getState()) {
  const cs = centreStats(s);
  return workers.map((w) => {
    const c = cs.find((x) => x.id === w.centre);
    const mine = s.followups.filter((f) => f.workerId === w.id);
    return { ...w, centreName: c?.name ?? "—", centreShort: c?.short ?? "—", assigned: c?.children ?? 0, monthMeasurements: c?.monthMeasurements ?? 0,
      open: mine.filter((f) => f.status === "pending").length, completed: mine.filter((f) => f.status === "completed").length };
  });
}

// Operational alerts for the admin command centre. Each carries a destination so no alert is a dead end.
export function alerts(s = getState()) {
  const out = [];
  centreStats(s).filter((c) => c.status === "Active").forEach((c) => {
    if (c.coveragePct < 70) out.push({ id: `cov-${c.id}`, tone: "warning", title: `${c.short} has low monitoring coverage`, body: `${c.coveragePct}% of ${c.children} children measured in the last 30 days.`, cta: "Review centre", to: `/admin/centres/${c.id}?tab=monitoring` });
    if (c.overdue > 0) out.push({ id: `od-${c.id}`, tone: "danger", title: `${c.short} has ${c.overdue} overdue follow-ups`, body: "Follow-ups past their due date are waiting for action.", cta: "View follow-ups", to: `/admin/centres/${c.id}?tab=followups` });
    if (c.unmeasured.length > 0) out.push({ id: `mis-${c.id}`, tone: "info", title: `${c.short}: ${c.unmeasured.length} missing measurements`, body: "These children have no measurement in the last 30 days.", cta: "View children", to: `/admin/centres/${c.id}?tab=children` });
  });
  const idle = workers.filter((w) => w.status === "Inactive");
  if (idle.length) out.push({ id: "inactive-w", tone: "neutral", title: `${idle.length} inactive worker accounts`, body: "No recent activity recorded for these accounts.", cta: "View workers", to: "/admin/workers" });
  centreStats(s).filter((c) => c.status === "Inactive" && c.children > 0).forEach((c) => out.push({ id: `in-${c.id}`, tone: "warning", title: `${c.short} is inactive with ${c.children} enrolled children`, body: "Records at inactive centres may be out of date.", cta: "Open centre", to: `/admin/centres/${c.id}` }));
  const rank = { danger: 0, warning: 1, info: 2, neutral: 3 };
  return out.sort((a, b) => rank[a.tone] - rank[b.tone]);
}
