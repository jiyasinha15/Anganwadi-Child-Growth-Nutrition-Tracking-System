import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Ruler, Apple, CalendarPlus, Check, Pencil, Weight, Activity, CalendarClock, ShieldCheck, LineChart, Baby } from "lucide-react";
import { PageHeader, StatCard, SectionHeader, StatusBadge, Badge, PriorityBadge, EmptyState, Segmented, ConfirmDialog, DataTable, useToast, ChildAvatar } from "../components/ui";
import GrowthChart, { METRICS } from "../components/domain/GrowthChart";
import ActivityFeed from "../components/ActivityFeed";
import { useActions } from "../components/forms/ActionHost";
import { useStore } from "../services/store";
import { getChild, childTimeline } from "../services/childrenService";
import { growthStatus, latestMeasurement, monitoringNote, seriesFor, calculateBMI, trend } from "../services/growthService";
import { recordsFor } from "../services/nutritionService";
import { forChild, bucket, completeFollowup } from "../services/followupService";
import { workers, centres } from "../data/seed";
import { ageLabel, daysAgo, fmtDate, fmtShort, relativeDay } from "../lib/dates";

const RANGES = [{ value: 90, label: "3 months" }, { value: 180, label: "6 months" }, { value: 365, label: "1 year" }, { value: 0, label: "All" }];
const FSTATE = { overdue: ["warning", "Overdue"], today: ["info", "Due today"], upcoming: ["neutral", "Upcoming"], completed: ["success", "Completed"] };
const workerName = (id) => workers.find((w) => w.id === id)?.name ?? "—";

export default function ChildProfile() {
  const { id } = useParams();
  const state = useStore();
  const navigate = useNavigate();
  const actions = useActions();
  const toast = useToast();
  const [metric, setMetric] = useState("weight");
  const [range, setRange] = useState(180);
  const [confirm, setConfirm] = useState(null);

  const child = getChild(id, state);
  const series = useMemo(() => (child ? seriesFor(child, range) : []), [child, range]);
  const history = useMemo(() => (child ? [...child.measurements].reverse().map((m, i, arr) => ({ ...m, bmi: calculateBMI(m.weight, m.height), key: `${m.date}-${i}`, prev: arr[i + 1] })) : []), [child]);
  const timeline = useMemo(() => childTimeline(id, state), [id, state]);
  const nutrition = recordsFor(id, state);
  const followups = forChild(id, state);

  if (!child) return (
    <div className="page"><section className="card"><EmptyState icon={Baby} title="Child not found" message="This record doesn't exist, or it belongs to another centre." action="Back to children" onAction={() => navigate("/children")} /></section></div>);

  const last = latestMeasurement(child), status = growthStatus(child);
  const open = followups.filter((f) => f.status === "pending").sort((a, b) => a.due.localeCompare(b.due));
  const done = followups.filter((f) => f.status === "completed").sort((a, b) => b.completedOn.localeCompare(a.completedOn));
  const centre = centres.find((c) => c.id === child.centreId);
  const m = METRICS[metric];
  const wt = trend(child, "weight"), ht = trend(child, "height");
  const dl = (t, unit) => (t.dir === "none" ? "Not enough data" : `${t.delta > 0 ? "+" : ""}${t.delta} ${unit} since previous`);

  const historyCols = [
    { key: "date", header: "Date", mobile: "title", render: (r) => fmtDate(r.date) },
    { key: "height", header: "Height", render: (r) => `${r.height} cm` },
    { key: "weight", header: "Weight", render: (r) => `${r.weight} kg` },
    { key: "bmi", header: "BMI", render: (r) => r.bmi ?? "—" },
    { key: "by", header: "Recorded by", render: (r) => r.recordedBy ?? "Centre team" },
    { key: "notes", header: "Notes", render: (r) => r.notes || <span className="muted">—</span> },
  ];

  return (
    <div className="page">
      <PageHeader
        back={<Link to="/children" className="back-link"><ArrowLeft size={15} />Children</Link>}
        title={child.name}
        subtitle={`${ageLabel(child.dob)} · ${child.gender} · ${child.center} · Registered ${fmtDate(child.registeredOn)}`}
        actions={<>
          <button className="btn btn-primary" onClick={() => actions.open("measurement", { childId: id })}><Ruler size={16} />Record measurement</button>
          <button className="btn btn-secondary" onClick={() => actions.open("nutrition", { childId: id })}><Apple size={16} />Add nutrition</button>
          <button className="btn btn-secondary" onClick={() => actions.open("followup", { childId: id })}><CalendarPlus size={16} />Create follow-up</button>
        </>} />

      <div className="status-line"><ChildAvatar name={child.name} gender={child.gender} size={40} /><div><StatusBadge status={status} /><p>{monitoringNote(child)}. Guardian: {child.guardian} · {child.phone}</p></div></div>

      <div className="grid grid-kpi">
        <StatCard icon={Ruler} label="Height" value={last ? `${last.height} cm` : "—"} hint={dl(ht, "cm")} />
        <StatCard icon={Weight} label="Weight" value={last ? `${last.weight} kg` : "—"} hint={dl(wt, "kg")} tone="info" />
        <StatCard icon={Activity} label="BMI" value={last ? calculateBMI(last.weight, last.height) : "—"} hint="Calculated for record keeping" tone="insight" />
        <StatCard icon={CalendarClock} label="Last measurement" value={last ? fmtShort(last.date) : "None"} hint={last ? `${daysAgo(last.date)} days ago` : "No measurements yet"} tone={last && daysAgo(last.date) > 30 ? "warning" : "neutral"} />
        <StatCard icon={ShieldCheck} label="Monitoring status" value={<span className="metric-text">{STATUS_SHORT[status]}</span>} hint={monitoringNote(child)} tone={status === "priority" ? "danger" : status === "monitoring" ? "warning" : "neutral"} />
      </div>

      <section className="card">
        <SectionHeader title="Growth journey" description={`${m.label} over time`}
          action={<div className="ctl-row">
            <Segmented label="Metric" value={metric} onChange={setMetric} options={[{ value: "height", label: "Height" }, { value: "weight", label: "Weight" }, { value: "bmi", label: "BMI" }]} />
            <Segmented label="Time range" value={range} onChange={setRange} options={RANGES} /></div>} />
        {series.length < 2
          ? <EmptyState icon={LineChart} title={child.measurements.length ? "Not enough measurements in this range" : "No measurements recorded yet"}
              message={child.measurements.length ? "Choose a longer time range, or record a new measurement." : "Record the first measurement to begin tracking this child's growth journey."}
              action="Record measurement" onAction={() => actions.open("measurement", { childId: id })} />
          : <GrowthChart data={series} metric={metric} />}
      </section>

      <section className="card flush">
        <div className="pad"><SectionHeader title="Measurement history" description={`${history.length} ${history.length === 1 ? "record" : "records"}, newest first`} /></div>
        {history.length === 0 ? <EmptyState title="No measurements yet" message="Records you add will appear here." action="Record measurement" onAction={() => actions.open("measurement", { childId: id })} />
          : <DataTable caption="Measurement history" columns={historyCols} rows={history} rowKey={(r) => r.key} />}
      </section>

      <div className="split even">
        <section className="card">
          <SectionHeader title="Nutrition" description={nutrition[0] ? `Latest record ${relativeDay(nutrition[0].date).toLowerCase()}` : undefined}
            action={<button className="btn btn-secondary btn-sm" onClick={() => actions.open("nutrition", { childId: id })}><Apple size={14} />Add record</button>} />
          {nutrition.length === 0
            ? <EmptyState icon={Apple} title="No nutrition records yet" message="Add a record to track meals, participation and dietary notes." action="Add nutrition record" onAction={() => actions.open("nutrition", { childId: id })} />
            : <>
              <dl className="facts">
                <div><dt>Meal</dt><dd>{nutrition[0].meal}</dd></div>
                <div><dt>Participation</dt><dd>{nutrition[0].portion} portion · appetite {nutrition[0].appetite.toLowerCase()}</dd></div>
                <div><dt>Supplement</dt><dd>{nutrition[0].supplement}</dd></div>
                <div><dt>Dietary notes</dt><dd>{nutrition[0].observation}</dd></div>
              </dl>
              {nutrition.length > 1 && <><h3 className="sub-h">Recent history</h3><ul className="mini-list">{nutrition.slice(1, 5).map((n) => <li key={n.id}><span>{fmtShort(n.date)}</span><span>{n.meal}</span><Badge tone="neutral">{n.portion}</Badge></li>)}</ul></>}
            </>}
        </section>

        <section className="card">
          <SectionHeader title="Follow-ups" description={`${open.length} open · ${done.length} completed`}
            action={<button className="btn btn-secondary btn-sm" onClick={() => actions.open("followup", { childId: id })}><CalendarPlus size={14} />Create</button>} />
          {followups.length === 0
            ? <EmptyState icon={CalendarPlus} title="No follow-ups" message="Create a follow-up to remember to revisit this child." action="Create follow-up" onAction={() => actions.open("followup", { childId: id })} />
            : <ul className="fu-list">
              {[...open, ...done.slice(0, 3)].map((f) => { const b = bucket(f), [tone, label] = FSTATE[b]; return (
                <li key={f.id} className="fu">
                  <div className="fu-main"><b>{f.reason}</b>
                    <span>{b === "completed" ? `Completed ${relativeDay(f.completedOn).toLowerCase()}` : `Due ${relativeDay(f.due).toLowerCase()}`} · {workerName(f.workerId)}</span>
                    <span className="fu-tags"><Badge tone={tone}>{label}</Badge><PriorityBadge priority={f.priority} /></span></div>
                  {b !== "completed" && <div className="fu-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => actions.open("editFollowup", { followup: f })}><Pencil size={14} />Edit</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setConfirm(f)}><Check size={14} />Complete</button></div>}
                </li>); })}
            </ul>}
        </section>
      </div>

      <section className="card">
        <SectionHeader title="Activity timeline" description="Everything recorded for this child" />
        <ActivityFeed items={timeline} variant="timeline" linkChild={false} />
      </section>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} title="Mark follow-up as complete?" confirmLabel="Mark complete"
        message={confirm ? `“${confirm.reason}” for ${child.name} will move to completed.` : ""}
        onConfirm={() => { completeFollowup(confirm.id); toast.success("Follow-up completed", child.name); }} />
    </div>
  );
}

const STATUS_SHORT = { healthy: "On track", stable: "Stable", monitoring: "Follow up", priority: "Review", new: "New" };
