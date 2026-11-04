import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Building2, UserCheck, Gauge, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PageHeader, StatCard, SectionHeader, DataTable, Badge, ProgressBar, EmptyState } from "../components/ui";
import { useStore } from "../services/store";
import { overview, centreStats, workerStats, alerts } from "../services/analyticsService";
import { stampLabel } from "../lib/dates";

const PERF = { Strong: "success", "On track": "info", "Needs support": "warning", Inactive: "neutral" };

export default function AdminDashboard() {
  const state = useStore();
  const navigate = useNavigate();
  const o = useMemo(() => overview(state), [state]);
  const cs = useMemo(() => centreStats(state), [state]);
  const ws = useMemo(() => workerStats(state), [state]);
  const al = useMemo(() => alerts(state), [state]);
  const activeW = ws.filter((w) => w.status === "Active").length;

  const centreCols = [
    { key: "name", header: "Centre", mobile: "title", render: (c) => <span><b>{c.name}</b><small className="sub">{c.location}</small></span> },
    { key: "children", header: "Children", render: (c) => c.children },
    { key: "cov", header: "Monitoring coverage", render: (c) => <div className="cell-bar"><ProgressBar value={c.coveragePct} showValue tone={c.coveragePct >= 70 ? "primary" : "warning"} label="" /></div> },
    { key: "pending", header: "Pending follow-ups", render: (c) => c.pending },
    { key: "nut", header: "Nutrition completion", render: (c) => `${c.nutritionPct}%` },
    { key: "status", header: "Status", render: (c) => <Badge tone={PERF[c.performance]}>{c.performance}</Badge> },
  ];
  const workerCols = [
    { key: "name", header: "Worker", mobile: "title", render: (w) => <span><b>{w.name}</b><small className="sub">{w.role}</small></span> },
    { key: "centre", header: "Centre", render: (w) => w.centreShort },
    { key: "assigned", header: "Children at centre", render: (w) => w.assigned },
    { key: "m", header: "Measurements (30d, centre)", render: (w) => w.monthMeasurements },
    { key: "f", header: "Follow-ups open / done", render: (w) => `${w.open} / ${w.completed}` },
    { key: "last", header: "Last activity", render: (w) => stampLabel(w.lastActive) },
  ];

  return (
    <div className="page">
      <PageHeader title="Command centre" subtitle="Centre performance, workforce and monitoring coverage across the district" />
      <div className="grid grid-kpi">
        <StatCard icon={Users} label="Total children" value={o.children} hint="Enrolled across all centres" onClick={() => navigate("/admin/reports")} />
        <StatCard icon={Building2} label="Total centres" value={cs.length} hint={`${cs.filter((c) => c.status === "Active").length} active`} tone="info" onClick={() => navigate("/admin/centres")} />
        <StatCard icon={UserCheck} label="Active workers" value={activeW} hint={`of ${ws.length} accounts`} tone="insight" onClick={() => navigate("/admin/workers")} />
        <StatCard icon={Gauge} label="Monitoring coverage" value={`${o.coveragePct}%`} hint="Children measured in 30 days" tone={o.coveragePct >= 75 ? "neutral" : "warning"} />
      </div>

      <div className="split">
        <section className="card flush">
          <div className="pad"><SectionHeader title="Centre performance" description="Select a centre to see its workers, children and follow-ups." action={<Link to="/admin/centres" className="link-arrow">All centres <ArrowRight size={14} /></Link>} /></div>
          <DataTable caption="Centre performance" columns={centreCols} rows={cs} rowKey={(c) => c.id} onRowClick={(c) => navigate(`/admin/centres/${c.id}`)} />
        </section>
        <section className="card">
          <SectionHeader title="Operational alerts" description={al.length ? `${al.length} items to review` : undefined} />
          {al.length === 0 ? <EmptyState icon={CheckCircle2} title="No alerts" message="Coverage and follow-ups look healthy across centres." />
            : <ul className="alert-list">{al.slice(0, 6).map((a) => (
              <li key={a.id} className={`alert tone-${a.tone}`}><AlertTriangle size={16} aria-hidden="true" />
                <div><b>{a.title}</b><span>{a.body}</span><Link to={a.to} className="link-arrow">{a.cta} <ArrowRight size={13} /></Link></div></li>))}</ul>}
        </section>
      </div>

      <section className="card flush">
        <div className="pad"><SectionHeader title="Workforce" description="Operational summary by worker." action={<Link to="/admin/workers" className="link-arrow">All workers <ArrowRight size={14} /></Link>} /></div>
        <DataTable caption="Worker activity" columns={workerCols} rows={ws} rowKey={(w) => w.id} onRowClick={(w) => navigate(`/admin/workers?worker=${w.id}`)} />
      </section>
    </div>
  );
}
