import { useMemo } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Building2, Users, Gauge, ClipboardCheck, Apple } from "lucide-react";
import { PageHeader, StatCard, SectionHeader, DataTable, Badge, StatusBadge, PriorityBadge, ProgressBar, EmptyState, Segmented } from "../components/ui";
import ChildCell from "../components/domain/ChildCell";
import ActivityFeed from "../components/ActivityFeed";
import { useStore } from "../services/store";
import { centreStats, scopeState } from "../services/analyticsService";
import { growthStatus, latestMeasurement, needsMeasurement } from "../services/growthService";
import { bucket } from "../services/followupService";
import { workers } from "../data/seed";
import { daysAgo, fmtDate, fmtShort, stampLabel } from "../lib/dates";

const TABS = ["Overview", "Workers", "Children", "Monitoring", "Follow-ups", "Activity"];

export default function AdminCentreDetail() {
  const { id } = useParams();
  const state = useStore();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = TABS.find((t) => t.toLowerCase() === params.get("tab")) ?? "Overview";
  const c = useMemo(() => centreStats(state).find((x) => x.id === id), [state, id]);
  const scoped = useMemo(() => scopeState(state, id), [state, id]);
  const team = workers.filter((w) => w.centre === id);
  const kids = useMemo(() => scoped.children.map((k) => ({ k, last: latestMeasurement(k), g: growthStatus(k), due: needsMeasurement(k) })), [scoped.children]);

  if (!c) return <div className="page"><section className="card"><EmptyState icon={Building2} title="Centre not found" message="This centre doesn't exist." action="Back to centres" onAction={() => navigate("/admin/centres")} /></section></div>;

  const fu = scoped.followups.filter((f) => f.status === "pending").sort((a, b) => a.due.localeCompare(b.due));
  const name = (cid) => scoped.children.find((k) => k.id === cid)?.name;

  return (
    <div className="page">
      <PageHeader back={<Link to="/admin/centres" className="back-link"><ArrowLeft size={15} />Centres</Link>} title={c.name} subtitle={`${c.location} · ${c.status}`}
        actions={<Link to="/admin/reports" className="btn btn-secondary">Centre report</Link>} />
      <Segmented label="Centre sections" value={tab} onChange={(t) => setParams({ tab: t.toLowerCase() }, { replace: true })} options={TABS} />

      {tab === "Overview" && <>
        <div className="grid grid-kpi">
          <StatCard icon={Users} label="Children" value={c.children} />
          <StatCard icon={Users} label="Workers" value={c.workers} tone="info" />
          <StatCard icon={Gauge} label="Monitoring coverage" value={`${c.coveragePct}%`} tone={c.coveragePct >= 70 ? "neutral" : "warning"} />
          <StatCard icon={Apple} label="Nutrition completion" value={`${c.nutritionPct}%`} tone="insight" />
          <StatCard icon={ClipboardCheck} label="Pending follow-ups" value={c.pending} hint={`${c.overdue} overdue`} tone={c.overdue ? "danger" : "neutral"} />
        </div>
      </>}

      {tab === "Workers" && <section className="card">
        <SectionHeader title="Workers" />
        {team.length === 0 ? <EmptyState title="No workers assigned" message="No worker accounts are linked to this centre." /> :
          <ul className="mini-list stacked">{team.map((w) => <li key={w.id}><b>{w.name}</b><span>{w.role}</span><small className="muted">Last active {stampLabel(w.lastActive)} · <Badge tone={w.status === "Active" ? "success" : "neutral"}>{w.status}</Badge></small></li>)}</ul>}
      </section>}

      {tab === "Children" && <section className="card flush">
        <div className="pad"><SectionHeader title={`Children (${kids.length})`} /></div>
        {kids.length === 0 ? <EmptyState title="No children enrolled" message="Enrolled children will be listed here." /> :
          <DataTable caption="Children at this centre" rows={kids} rowKey={(r) => r.k.id}
            columns={[{ key: "n", header: "Child", mobile: "title", render: (r) => <ChildCell child={r.k} /> },
              { key: "g", header: "Monitoring status", render: (r) => <StatusBadge status={r.g} /> },
              { key: "l", header: "Last measured", render: (r) => (r.last ? fmtShort(r.last.date) : "Never") }]} />}
      </section>}

      {tab === "Monitoring" && <section className="card">
        <SectionHeader title="Monitoring coverage" description="Children measured in the last 30 days" />
        <ProgressBar value={c.coveragePct} label={`${c.children - c.unmeasured.length} of ${c.children} children`} tone={c.coveragePct >= 70 ? "primary" : "warning"} />
        <h3 className="sub-h">Measurement due ({c.unmeasured.length})</h3>
        {c.unmeasured.length === 0 ? <p className="muted">Every child has a recent measurement.</p> :
          <ul className="mini-list stacked">{c.unmeasured.map((k) => { const l = latestMeasurement(k); return <li key={k.id}><b>{k.name}</b><span>{l ? `Last measured ${daysAgo(l.date)} days ago (${fmtDate(l.date)})` : "No measurement yet"}</span></li>; })}</ul>}
      </section>}

      {tab === "Follow-ups" && <section className="card">
        <SectionHeader title={`Open follow-ups (${fu.length})`} />
        {fu.length === 0 ? <EmptyState title="No open follow-ups" message="Nothing is waiting at this centre." /> :
          <ul className="mini-list stacked">{fu.map((f) => <li key={f.id}><b>{name(f.childId)}</b><span>{f.reason}</span><small className="muted">{fmtDate(f.due)} · {bucket(f) === "overdue" ? "Overdue" : bucket(f) === "today" ? "Due today" : "Upcoming"} · <PriorityBadge priority={f.priority} /></small></li>)}</ul>}
      </section>}

      {tab === "Activity" && <section className="card">
        <SectionHeader title="Recent activity" />
        {scoped.activity.length === 0 ? <EmptyState title="No activity yet" message="Activity at this centre will appear here." /> : <ActivityFeed items={scoped.activity} limit={12} linkChild={false} />}
      </section>}
    </div>
  );
}
