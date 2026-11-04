import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserPlus, MoreHorizontal, Eye, Ruler, Apple, CalendarPlus, Baby, SearchX } from "lucide-react";
import { PageHeader, DataTable, StatusBadge, Badge, EmptyState, Dropdown, Segmented, SearchInput } from "../components/ui";
import ChildCell from "../components/domain/ChildCell";
import { useActions } from "../components/forms/ActionHost";
import { useWorkerScope } from "../services/selectors";
import { growthStatus, STATUS, latestMeasurement, needsMeasurement } from "../services/growthService";
import { NUTRITION_STATUS } from "../services/nutritionService";
import { nextFor, bucket } from "../services/followupService";
import { ageInMonths, ageLabel, daysAgo, fmtShort, relativeDay } from "../lib/dates";

const NUTRI = { complete: ["success", "Up to date"], stale: ["warning", "Record is old"], missing: ["neutral", "No record"] };
const FILTERS = [["all", "All"], ["due", "Measurement due"], ["attention", "Needs review"], ["followup", "Follow-up due"]];

export default function Children() {
  const { state } = useWorkerScope();
  const navigate = useNavigate();
  const actions = useActions();
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState({ key: "name", dir: "asc" });
  const q = params.get("q") ?? "";
  const status = params.get("status") ?? "all";
  const setParam = (k, v) => setParams((p) => { const n = new URLSearchParams(p); if (v && v !== "all") n.set(k, v); else n.delete(k); return n; }, { replace: true });

  const rows = useMemo(() => state.children.map((c) => {
    const last = latestMeasurement(c), fu = nextFor(c.id, state);
    return { c, last, growth: growthStatus(c), nutrition: NUTRITION_STATUS(c.id, state), fu, due: needsMeasurement(c), age: ageInMonths(c.dob) };
  }), [state]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    let r = rows.filter((x) => !t || x.c.name.toLowerCase().includes(t) || x.c.guardian.toLowerCase().includes(t));
    if (status === "due") r = r.filter((x) => x.due);
    if (status === "attention") r = r.filter((x) => ["monitoring", "priority"].includes(x.growth));
    if (status === "followup") r = r.filter((x) => x.fu && ["overdue", "today"].includes(bucket(x.fu)));
    const dir = sort.dir === "asc" ? 1 : -1;
    const val = { name: (x) => x.c.name, age: (x) => x.age, last: (x) => x.last?.date ?? "", growth: (x) => STATUS[x.growth].rank }[sort.key];
    return [...r].sort((a, b) => (val(a) > val(b) ? dir : val(a) < val(b) ? -dir : 0));
  }, [rows, q, status, sort]);

  const onSort = (key) => setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));
  const counts = { all: rows.length, due: rows.filter((x) => x.due).length, attention: rows.filter((x) => ["monitoring", "priority"].includes(x.growth)).length,
    followup: rows.filter((x) => x.fu && ["overdue", "today"].includes(bucket(x.fu))).length };

  const columns = [
    { key: "name", header: "Child", sortable: true, mobile: "title", render: (x) => <ChildCell child={x.c} sub={`${ageLabel(x.c.dob)} · ${x.c.gender}`} /> },
    { key: "age", header: "Age", sortable: true, render: (x) => ageLabel(x.c.dob), mobile: "hide" },
    { key: "centre", header: "Centre", render: (x) => x.c.center.replace("Anganwadi ", "") },
    { key: "last", header: "Last measurement", sortable: true, render: (x) => x.last
      ? <span>{fmtShort(x.last.date)} <small className="muted">· {daysAgo(x.last.date)}d ago</small></span> : <span className="muted">None yet</span> },
    { key: "growth", header: "Growth status", sortable: true, render: (x) => <StatusBadge status={x.growth} /> },
    { key: "nutrition", header: "Nutrition", render: (x) => <Badge tone={NUTRI[x.nutrition][0]}>{NUTRI[x.nutrition][1]}</Badge> },
    { key: "fu", header: "Follow-up", render: (x) => x.fu ? <span className={bucket(x.fu) === "overdue" ? "text-warn" : ""}>{relativeDay(x.fu.due)}</span> : <span className="muted">None open</span> },
    { key: "actions", header: "Actions", align: "right", render: (x) => (
      <span onClick={(e) => e.stopPropagation()}>
        <Dropdown label={`Actions for ${x.c.name}`} trigger={<span className="icon-btn"><MoreHorizontal size={18} aria-hidden="true" /></span>}>
          <div className="menu" data-close>
            <button className="menu-item" onClick={() => navigate(`/children/${x.c.id}`)}><Eye size={15} />View profile</button>
            <button className="menu-item" onClick={() => actions.open("measurement", { childId: x.c.id })}><Ruler size={15} />Record measurement</button>
            <button className="menu-item" onClick={() => actions.open("nutrition", { childId: x.c.id })}><Apple size={15} />Add nutrition record</button>
            <button className="menu-item" onClick={() => actions.open("followup", { childId: x.c.id })}><CalendarPlus size={15} />Create follow-up</button>
          </div>
        </Dropdown>
      </span>) },
  ];

  return (
    <div className="page">
      <PageHeader title="Children" subtitle={`${rows.length} enrolled children`}
        actions={<button className="btn btn-primary" onClick={() => navigate("/children/new")}><UserPlus size={16} />Add child</button>} />
      <div className="filter-bar">
        <SearchInput value={q} onChange={(v) => setParam("q", v)} placeholder="Search by child or guardian name" label="Search children" />
        <Segmented label="Filter children" value={status} onChange={(v) => setParam("status", v)} options={FILTERS.map(([value, label]) => ({ value, label, count: counts[value] }))} />
      </div>
      <section className="card flush">
        {rows.length === 0
          ? <EmptyState icon={Baby} title="No children enrolled yet" message="Add the first child to start tracking growth and nutrition." action="Add child" onAction={() => navigate("/children/new")} />
          : filtered.length === 0
            ? <EmptyState icon={SearchX} title="No children match these filters" message="Try a different name or clear the filters." action="Clear filters" onAction={() => setParams({}, { replace: true })} />
            : <DataTable caption="Enrolled children" columns={columns} rows={filtered} rowKey={(x) => x.c.id} sort={sort} onSort={onSort} onRowClick={(x) => navigate(`/children/${x.c.id}`)} />}
      </section>
    </div>
  );
}
