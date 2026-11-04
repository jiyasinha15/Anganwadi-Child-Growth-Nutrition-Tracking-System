import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Apple, Plus, UtensilsCrossed } from "lucide-react";
import { PageHeader, StatCard, SectionHeader, ProgressBar, DataTable, Badge, EmptyState, Segmented, SearchInput } from "../components/ui";
import ChildCell from "../components/domain/ChildCell";
import { useActions } from "../components/forms/ActionHost";
import { useWorkerScope } from "../services/selectors";
import { overview } from "../services/analyticsService";
import { latestRecord, NUTRITION_STATUS } from "../services/nutritionService";
import { nextFor } from "../services/followupService";
import { fmtShort, relativeDay } from "../lib/dates";

const STATE = { complete: ["success", "Up to date"], stale: ["warning", "Needs a new record"], missing: ["neutral", "No record yet"] };

export default function Nutrition() {
  const { state } = useWorkerScope();
  const navigate = useNavigate();
  const actions = useActions();
  const [params, setParams] = useSearchParams();
  const filter = params.get("filter") ?? "all";
  const q = params.get("q") ?? "";
  const set = (k, v) => setParams((p) => { const n = new URLSearchParams(p); if (v && v !== "all") n.set(k, v); else n.delete(k); return n; }, { replace: true });

  const o = useMemo(() => overview(state), [state]);
  const rows = useMemo(() => state.children.map((c) => ({ c, st: NUTRITION_STATUS(c.id, state), rec: latestRecord(c.id, state), fu: nextFor(c.id, state) })), [state]);
  const followupRows = rows.filter((r) => r.fu && /nutrition/i.test(r.fu.reason));
  const counts = { all: rows.length, attention: rows.filter((r) => r.st !== "complete").length, completed: rows.filter((r) => r.st === "complete").length, followup: followupRows.length };
  const shown = rows.filter((r) => {
    const t = q.trim().toLowerCase();
    if (t && !r.c.name.toLowerCase().includes(t)) return false;
    return filter === "all" || (filter === "attention" && r.st !== "complete") || (filter === "completed" && r.st === "complete") || (filter === "followup" && r.fu && /nutrition/i.test(r.fu.reason));
  });
  const participation = useMemo(() => { const recent = state.nutrition.slice(0, 40); const full = recent.filter((r) => r.portion === "Full").length; return recent.length ? Math.round((full / recent.length) * 100) : 0; }, [state.nutrition]);
  const notes = state.nutrition.filter((n) => n.observation && !/^No concerns|^Finished|^Ate with/.test(n.observation)).slice(0, 4);

  const columns = [
    { key: "c", header: "Child", mobile: "title", render: (r) => <ChildCell child={r.c} /> },
    { key: "st", header: "Status", render: (r) => <Badge tone={STATE[r.st][0]}>{STATE[r.st][1]}</Badge> },
    { key: "meal", header: "Latest meal", render: (r) => r.rec ? r.rec.meal : <span className="muted">—</span> },
    { key: "part", header: "Participation", render: (r) => r.rec ? `${r.rec.portion} · ${r.rec.appetite.toLowerCase()} appetite` : <span className="muted">—</span> },
    { key: "date", header: "Recorded", render: (r) => r.rec ? fmtShort(r.rec.date) : <span className="muted">Never</span> },
    { key: "fu", header: "Follow-up", render: (r) => r.fu && /nutrition/i.test(r.fu.reason) ? relativeDay(r.fu.due) : <span className="muted">—</span> },
    { key: "a", header: "Action", align: "right", render: (r) => <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); actions.open("nutrition", { childId: r.c.id }); }}><Plus size={14} />Add record</button> },
  ];

  return (
    <div className="page">
      <PageHeader title="Nutrition" subtitle="Meals, participation and dietary notes across your centre"
        actions={<button className="btn btn-primary" onClick={() => actions.open("nutrition")}><Plus size={16} />Add nutrition record</button>} />
      <div className="grid grid-kpi">
        <StatCard icon={Apple} label="Nutrition coverage" value={`${o.nutritionPct}%`} hint="Record within the last 7 days" tone="insight" />
        <StatCard icon={UtensilsCrossed} label="Full-portion meals" value={`${participation}%`} hint="Across recent records" tone="info" />
        <StatCard label="Need a record" value={counts.attention} hint="No recent nutrition record" tone={counts.attention ? "warning" : "neutral"} />
        <StatCard label="Nutrition follow-ups" value={counts.followup} hint="Open follow-ups about nutrition" />
      </div>
      <div className="split">
        <div className="stack">
          <div className="filter-bar">
            <SearchInput value={q} onChange={(v) => set("q", v)} placeholder="Search children" label="Search nutrition records" />
            <Segmented label="Filter" value={filter} onChange={(v) => set("filter", v)}
              options={[{ value: "all", label: "All", count: counts.all }, { value: "attention", label: "Needs attention", count: counts.attention }, { value: "completed", label: "Completed", count: counts.completed }, { value: "followup", label: "Follow-up", count: counts.followup }]} />
          </div>
          <section className="card flush">
            {shown.length === 0
              ? <EmptyState icon={Apple} title="No children match" message={filter === "all" && !q ? "Enrol a child to start nutrition records." : "Try a different filter or search."} action="Show all" onAction={() => setParams({}, { replace: true })} />
              : <DataTable caption="Nutrition status by child" columns={columns} rows={shown} rowKey={(r) => r.c.id} onRowClick={(r) => navigate(`/children/${r.c.id}`)} />}
          </section>
        </div>
        <div className="stack">
          <section className="card"><SectionHeader title="Coverage" /><ProgressBar value={o.nutritionPct} label={`${o.nutritionDone} of ${o.children} children`} tone={o.nutritionPct >= 80 ? "primary" : "warning"} /></section>
          <section className="card">
            <SectionHeader title="Recent dietary notes" />
            {notes.length === 0 ? <p className="muted">No notes need attention.</p>
              : <ul className="mini-list stacked">{notes.map((n) => <li key={n.id}><b>{state.children.find((c) => c.id === n.childId)?.name}</b><span>{n.observation}</span><small className="muted">{fmtShort(n.date)}</small></li>)}</ul>}
          </section>
        </div>
      </div>
    </div>
  );
}
