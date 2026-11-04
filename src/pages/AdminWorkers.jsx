import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Eye, Users } from "lucide-react";
import { PageHeader, DataTable, Badge, Drawer, EmptyState, SearchInput, ChildAvatar } from "../components/ui";
import { useStore } from "../services/store";
import { workerStats } from "../services/analyticsService";
import { stampLabel } from "../lib/dates";

export default function AdminWorkers() {
  const state = useStore();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState("");
  const all = useMemo(() => workerStats(state), [state]);
  const rows = all.filter((w) => !q.trim() || `${w.name} ${w.role} ${w.centreName}`.toLowerCase().includes(q.trim().toLowerCase()));
  const selected = all.find((w) => w.id === params.get("worker"));
  const close = () => setParams({}, { replace: true });

  const columns = [
    { key: "name", header: "Worker", mobile: "title", render: (w) => <span className="child-cell"><ChildAvatar name={w.name} gender="Female" size={34} /><span><b>{w.name}</b><small>{w.role}</small></span></span> },
    { key: "centre", header: "Centre", render: (w) => w.centreName },
    { key: "assigned", header: "Assigned children", render: (w) => w.assigned },
    { key: "last", header: "Recent activity", render: (w) => stampLabel(w.lastActive) },
    { key: "status", header: "Status", render: (w) => <Badge tone={w.status === "Active" ? "success" : "neutral"} dot>{w.status}</Badge> },
    { key: "a", header: "Action", align: "right", render: (w) => <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); setParams({ worker: w.id }); }}><Eye size={14} />View worker</button> },
  ];

  return (
    <div className="page">
      <PageHeader title="Workers" subtitle={`${all.length} worker accounts · view only in this demo`} />
      <div className="filter-bar"><SearchInput value={q} onChange={setQ} placeholder="Search by name, role or centre" label="Search workers" /></div>
      <section className="card flush">
        {rows.length === 0 ? <EmptyState icon={Users} title="No workers match" message="Try a different name or centre." action="Clear search" onAction={() => setQ("")} />
          : <DataTable caption="Workers" columns={columns} rows={rows} rowKey={(w) => w.id} onRowClick={(w) => setParams({ worker: w.id })} />}
      </section>
      <Drawer open={!!selected} onClose={close} title={selected?.name ?? ""} description={selected ? `${selected.role} · ${selected.centreName}` : ""}>
        {selected && <dl className="facts">
          <div><dt>Status</dt><dd><Badge tone={selected.status === "Active" ? "success" : "neutral"} dot>{selected.status}</Badge></dd></div>
          <div><dt>Last activity</dt><dd>{stampLabel(selected.lastActive)}</dd></div>
          <div><dt>Children at centre</dt><dd>{selected.assigned}</dd></div>
          <div><dt>Measurements this month (centre)</dt><dd>{selected.monthMeasurements}</dd></div>
          <div><dt>Follow-ups open / completed</dt><dd>{selected.open} / {selected.completed}</dd></div>
        </dl>}
      </Drawer>
    </div>
  );
}
