import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Printer, Download, FileText } from "lucide-react";
import { PageHeader, Field, DataTable, EmptyState, useToast } from "../components/ui";
import { Logo } from "../components/shell/AppShell";
import { useStore } from "../services/store";
import { useSession } from "../lib/session";
import { overview, centreStats, scopeState } from "../services/analyticsService";
import { growthStatus, latestMeasurement, STATUS, calculateBMI } from "../services/growthService";
import { NUTRITION_STATUS, latestRecord } from "../services/nutritionService";
import { bucket } from "../services/followupService";
import { centres, workers } from "../data/seed";
import { TODAY, ageLabel, fmtDate, daysAgo } from "../lib/dates";
import { toCSV, downloadCSV } from "../lib/csv";

const TYPES = [
  { id: "children", title: "Child monitoring report" },
  { id: "growth", title: "Growth monitoring report" },
  { id: "nutrition", title: "Nutrition report" },
  { id: "followups", title: "Follow-up report" },
  { id: "centres", title: "Centre performance report" },
];
const RANGE = [{ v: 30, l: "Last 30 days" }, { v: 90, l: "Last 90 days" }, { v: 180, l: "Last 6 months" }, { v: 0, l: "All time" }];
const nutriText = { complete: "Up to date", stale: "Record is old", missing: "No record" };

export default function Reports() {
  const full = useStore();
  const session = useSession();
  const toast = useToast();
  const admin = useLocation().pathname.startsWith("/admin");
  const [type, setType] = useState("children");
  const [centreId, setCentreId] = useState(admin ? "all" : session?.centreId ?? "c1");
  const [range, setRange] = useState(90);
  const [status, setStatus] = useState("all");

  const scope = useMemo(() => scopeState(full, centreId === "all" ? null : centreId), [full, centreId]);
  const inRange = (iso) => !range || (iso && daysAgo(iso) <= range);

  const table = useMemo(() => {
    const kids = scope.children;
    if (type === "centres") {
      const r = centreStats(full).filter((c) => centreId === "all" || c.id === centreId).filter((c) => status === "all" || c.performance === status);
      return { columns: [
        { header: "Centre", value: (c) => c.name }, { header: "Status", value: (c) => c.status }, { header: "Children", value: (c) => c.children },
        { header: "Monitoring coverage %", value: (c) => c.coveragePct }, { header: "Nutrition completion %", value: (c) => c.nutritionPct },
        { header: "Pending follow-ups", value: (c) => c.pending }, { header: "Performance", value: (c) => c.performance }], rows: r, key: (c) => c.id,
        summary: [["Centres", r.length], ["Children", r.reduce((n, c) => n + c.children, 0)], ["Pending follow-ups", r.reduce((n, c) => n + c.pending, 0)]],
        statuses: ["Strong", "On track", "Needs support", "Inactive"] };
    }
    if (type === "followups") {
      const r = scope.followups.filter((f) => inRange(f.status === "completed" ? f.completedOn : f.due) || bucket(f) === "overdue").filter((f) => status === "all" || bucket(f) === status);
      const name = (id) => kids.find((c) => c.id === id)?.name ?? "";
      return { columns: [
        { header: "Child", value: (f) => name(f.childId) }, { header: "Reason", value: (f) => f.reason }, { header: "Priority", value: (f) => f.priority },
        { header: "Due date", value: (f) => f.due }, { header: "Assigned to", value: (f) => workers.find((w) => w.id === f.workerId)?.name ?? "" }, { header: "Status", value: (f) => bucket(f) }], rows: r, key: (f) => f.id,
        summary: [["Follow-ups", r.length], ["Overdue", r.filter((f) => bucket(f) === "overdue").length], ["Completed", r.filter((f) => f.status === "completed").length]],
        statuses: ["overdue", "today", "upcoming", "completed"] };
    }
    const base = kids.map((c) => ({ c, last: latestMeasurement(c), g: growthStatus(c), n: NUTRITION_STATUS(c.id, scope), nr: latestRecord(c.id, scope) }));
    const stat = (r) => type === "nutrition" ? r.n : r.g;
    const r = base.filter((x) => status === "all" || stat(x) === status);
    const common = [{ header: "Child", value: (x) => x.c.name }, { header: "Age", value: (x) => ageLabel(x.c.dob) }, { header: "Centre", value: (x) => x.c.center }];
    const o = overview(scope);
    if (type === "nutrition") return { columns: [...common, { header: "Latest meal", value: (x) => x.nr?.meal ?? "" }, { header: "Participation", value: (x) => x.nr?.portion ?? "" },
      { header: "Last record", value: (x) => x.nr?.date ?? "" }, { header: "Status", value: (x) => nutriText[x.n] }], rows: r, key: (x) => x.c.id,
      summary: [["Children", r.length], ["Nutrition coverage", `${o.nutritionPct}%`], ["Need a record", r.filter((x) => x.n !== "complete").length]], statuses: ["complete", "stale", "missing"] };
    if (type === "growth") return { columns: [...common, { header: "Height (cm)", value: (x) => x.last?.height ?? "" }, { header: "Weight (kg)", value: (x) => x.last?.weight ?? "" },
      { header: "BMI", value: (x) => (x.last ? calculateBMI(x.last.weight, x.last.height) : "") }, { header: "Last measured", value: (x) => x.last?.date ?? "" }, { header: "Monitoring status", value: (x) => STATUS[x.g].label }], rows: r, key: (x) => x.c.id,
      summary: [["Children", r.length], ["Avg weight (kg)", o.avgWeight], ["Avg height (cm)", o.avgHeight]], statuses: Object.keys(STATUS) };
    return { columns: [...common, { header: "Guardian", value: (x) => x.c.guardian }, { header: "Registered", value: (x) => x.c.registeredOn },
      { header: "Last measured", value: (x) => x.last?.date ?? "" }, { header: "Monitoring status", value: (x) => STATUS[x.g].label }], rows: r, key: (x) => x.c.id,
      summary: [["Children", r.length], ["Monitoring coverage", `${o.coveragePct}%`], ["Measurements due", o.unmeasured.length]], statuses: Object.keys(STATUS) };
  }, [type, scope, full, centreId, status, range]);

  const meta = TYPES.find((t) => t.id === type);
  const centreLabel = centreId === "all" ? "All centres" : centres.find((c) => c.id === centreId)?.name;
  const rangeLabel = RANGE.find((r) => r.v === range).l;
  const statusLabel = (s) => STATUS[s]?.label ?? nutriText[s] ?? s[0].toUpperCase() + s.slice(1);

  const exportCsv = () => {
    downloadCSV(`angansetu-${type}-${TODAY}.csv`, toCSV(table.columns, table.rows));
    toast.success("CSV exported", `${table.rows.length} rows · ${meta.title}`);
  };
  const columns = table.columns.map((c, i) => ({ key: `c${i}`, header: c.header, mobile: i === 0 ? "title" : undefined, render: (r) => { const v = c.value(r); return v === "" || v == null ? <span className="muted">—</span> : v; } }));

  return (
    <div className="page report-page">
      <div className="no-print"><PageHeader title="Reports" subtitle="Choose a report, set filters, then print or export CSV."
        actions={<><button className="btn btn-secondary" onClick={exportCsv} disabled={!table.rows.length}><Download size={16} />Export CSV</button>
          <button className="btn btn-primary" onClick={() => window.print()}><Printer size={16} />Print report</button></>} /></div>

      <div className="card no-print">
        <div className="form-grid four">
          <Field label="Report"><select className="input" value={type} onChange={(e) => { setType(e.target.value); setStatus("all"); }}>{TYPES.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}</select></Field>
          <Field label="Centre"><select className="input" value={centreId} onChange={(e) => setCentreId(e.target.value)} disabled={!admin}>
            {admin && <option value="all">All centres</option>}{centres.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
          <Field label="Date range" hint={type === "children" || type === "growth" || type === "nutrition" || type === "centres" ? "Applies to follow-up reports" : undefined}>
            <select className="input" value={range} onChange={(e) => setRange(Number(e.target.value))}>{RANGE.map((r) => <option key={r.v} value={r.v}>{r.l}</option>)}</select></Field>
          <Field label="Status"><select className="input" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All</option>{table.statuses.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}</select></Field>
        </div>
      </div>

      <article className="report-sheet card" aria-label="Report preview">
        <header className="report-head">
          <Logo /><div className="report-title"><h2>{meta.title}</h2><p>Generated {fmtDate(TODAY)} · Demo data (fictional)</p></div>
        </header>
        <dl className="report-filters"><div><dt>Centre</dt><dd>{centreLabel}</dd></div><div><dt>Period</dt><dd>{rangeLabel}{type === "followups" ? "" : " (current records)"}</dd></div><div><dt>Status</dt><dd>{status === "all" ? "All" : statusLabel(status)}</dd></div></dl>
        <div className="report-summary">{table.summary.map(([k, v]) => <div key={k}><b>{v}</b><span>{k}</span></div>)}</div>
        {table.rows.length === 0
          ? <EmptyState icon={FileText} title="No records match these filters" message="Change the centre, date range or status to see data." />
          : <DataTable caption={meta.title} columns={columns} rows={table.rows} rowKey={table.key} />}
        <footer className="report-foot">ANGANSETU · Every Child. Every Milestone. Every Day. · This report supports monitoring and follow-up. It is not a medical assessment.</footer>
      </article>
    </div>
  );
}
