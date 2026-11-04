import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ruler, TrendingUp, TrendingDown, Minus, LineChart } from "lucide-react";
import { PageHeader, StatCard, SectionHeader, DataTable, StatusBadge, Segmented, EmptyState, ProgressBar } from "../components/ui";
import ChildCell from "../components/domain/ChildCell";
import GrowthChart from "../components/domain/GrowthChart";
import { useActions } from "../components/forms/ActionHost";
import { useWorkerScope } from "../services/selectors";
import { overview } from "../services/analyticsService";
import { growthStatus, latestMeasurement, trend, averageSeries, STATUS } from "../services/growthService";
import { daysAgo, fmtShort } from "../lib/dates";

const TREND = { up: [TrendingUp, "Increasing"], flat: [Minus, "Steady"], down: [TrendingDown, "Below previous"], none: [Minus, "Not enough data"] };
const monthLabel = (ym) => new Date(`${ym}-01T00:00:00Z`).toLocaleDateString("en-IN", { month: "short", year: "2-digit", timeZone: "UTC" });

export default function Growth() {
  const { state } = useWorkerScope();
  const navigate = useNavigate();
  const actions = useActions();
  const [view, setView] = useState("all");
  const o = useMemo(() => overview(state), [state]);
  const rows = useMemo(() => state.children.map((c) => ({ c, status: growthStatus(c), last: latestMeasurement(c), wt: trend(c, "weight") })), [state.children]);
  const shown = rows.filter((r) => view === "all" || (view === "review" && ["monitoring", "priority"].includes(r.status)))
    .sort((a, b) => STATUS[b.status].rank - STATUS[a.status].rank);
  const series = useMemo(() => averageSeries(state.children, 180).map((r) => ({ ...r, month: monthLabel(r.month) })), [state.children]);

  const columns = [
    { key: "c", header: "Child", mobile: "title", render: (r) => <ChildCell child={r.c} /> },
    { key: "s", header: "Monitoring status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "h", header: "Height", render: (r) => r.last ? `${r.last.height} cm` : "—" },
    { key: "w", header: "Weight", render: (r) => r.last ? `${r.last.weight} kg` : "—" },
    { key: "t", header: "Weight trend", render: (r) => { const [I, l] = TREND[r.wt.dir]; return <span className="trend"><I size={14} aria-hidden="true" />{l}</span>; } },
    { key: "d", header: "Last measured", render: (r) => r.last ? `${fmtShort(r.last.date)} · ${daysAgo(r.last.date)}d ago` : "Never" },
    { key: "a", header: "Action", align: "right", render: (r) => <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); actions.open("measurement", { childId: r.c.id }); }}><Ruler size={14} />Measure</button> },
  ];

  return (
    <div className="page">
      <PageHeader title="Growth monitoring" subtitle="Measurement coverage and weight trends. Monitoring signals only, not diagnoses."
        actions={<button className="btn btn-primary" onClick={() => actions.open("measurement")}><Ruler size={16} />Record measurement</button>} />
      <div className="grid grid-kpi">
        <StatCard icon={Ruler} label="Measured this month" value={o.monthMeasurements} hint="Measurements in the last 30 days" />
        <StatCard label="Monitoring coverage" value={`${o.coveragePct}%`} hint="Children measured in 30 days" tone="info" />
        <StatCard label="Review recommended" value={rows.filter((r) => ["monitoring", "priority"].includes(r.status)).length} hint="Follow-up or trend review" tone="warning" />
        <StatCard label="Average weight" value={`${o.avgWeight} kg`} hint={`Average height ${o.avgHeight} cm`} tone="insight" />
      </div>
      <section className="card">
        <SectionHeader title="Centre growth trend" description="Average weight by month" />
        {series.length < 2 ? <EmptyState icon={LineChart} title="Not enough data yet" message="Two or more months of measurements are needed to draw a trend." />
          : <GrowthChart data={series} xKey="month" metric="weight" lines={[{ key: "weight", name: "Average weight" }]} height={240} />}
        <div style={{ marginTop: 12 }}><ProgressBar value={o.coveragePct} label="Monitoring coverage" tone={o.coveragePct >= 80 ? "primary" : "warning"} /></div>
      </section>
      <div className="filter-bar"><Segmented label="Show" value={view} onChange={setView} options={[{ value: "all", label: "All children", count: rows.length }, { value: "review", label: "Needs review", count: rows.filter((r) => ["monitoring", "priority"].includes(r.status)).length }]} /></div>
      <section className="card flush">
        {shown.length === 0 ? <EmptyState title="No children to review" message="Everyone is on track. Switch to all children to see the full list." />
          : <DataTable caption="Growth monitoring by child" columns={columns} rows={shown} rowKey={(r) => r.c.id} onRowClick={(r) => navigate(`/children/${r.c.id}`)} />}
      </section>
    </div>
  );
}
