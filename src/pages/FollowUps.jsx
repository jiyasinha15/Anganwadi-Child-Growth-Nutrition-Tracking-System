import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarPlus, Check, Pencil, Eye, CalendarCheck } from "lucide-react";
import { PageHeader, SectionHeader, Badge, PriorityBadge, EmptyState, ConfirmDialog, StatCard, useToast } from "../components/ui";
import ChildCell from "../components/domain/ChildCell";
import { useActions } from "../components/forms/ActionHost";
import { useWorkerScope } from "../services/selectors";
import { bucket, completeFollowup } from "../services/followupService";
import { workers } from "../data/seed";
import { fmtDate, relativeDay } from "../lib/dates";

const SECTIONS = [
  { key: "today", title: "Due today", empty: "Nothing is due today.", tone: "info" },
  { key: "overdue", title: "Overdue", empty: "No overdue follow-ups. Nicely done.", tone: "warning" },
  { key: "upcoming", title: "Upcoming", empty: "No upcoming follow-ups scheduled.", tone: "neutral" },
  { key: "completed", title: "Completed", empty: "Completed follow-ups will appear here.", tone: "success" },
];
const PR = { High: 0, Medium: 1, Low: 2 };

export default function FollowUps() {
  const { state } = useWorkerScope();
  const actions = useActions();
  const toast = useToast();
  const [confirm, setConfirm] = useState(null);
  const kids = useMemo(() => new Map(state.children.map((c) => [c.id, c])), [state.children]);

  const groups = useMemo(() => {
    const g = { today: [], overdue: [], upcoming: [], completed: [] };
    state.followups.forEach((f) => g[bucket(f)].push(f));
    g.overdue.sort((a, b) => PR[a.priority] - PR[b.priority] || a.due.localeCompare(b.due));
    g.today.sort((a, b) => PR[a.priority] - PR[b.priority]);
    g.upcoming.sort((a, b) => a.due.localeCompare(b.due));
    g.completed.sort((a, b) => b.completedOn.localeCompare(a.completedOn));
    return g;
  }, [state.followups]);

  return (
    <div className="page">
      <PageHeader title="Follow-ups" subtitle="Reminders to review or revisit children"
        actions={<button className="btn btn-primary" onClick={() => actions.open("followup")}><CalendarPlus size={16} />Create follow-up</button>} />
      <div className="grid grid-kpi">
        {SECTIONS.map((s) => <StatCard key={s.key} label={s.title} value={groups[s.key].length} tone={s.key === "overdue" && groups.overdue.length ? "warning" : s.key === "completed" ? "info" : "neutral"} />)}
      </div>
      {SECTIONS.map((s) => (
        <section key={s.key} className="card" aria-labelledby={`fu-${s.key}`}>
          <SectionHeader title={`${s.title} (${groups[s.key].length})`} />
          {groups[s.key].length === 0
            ? <EmptyState icon={CalendarCheck} title={s.empty} />
            : <ul className="fu-rows">
              {groups[s.key].map((f) => { const child = kids.get(f.childId); if (!child) return null; const done = f.status === "completed"; return (
                <li key={f.id} className="fu-row">
                  <ChildCell child={child} sub={f.reason} />
                  <div className="fu-meta">
                    <PriorityBadge priority={f.priority} />
                    <span>{done ? `Completed ${fmtDate(f.completedOn)}` : `${fmtDate(f.due)} · ${relativeDay(f.due)}`}</span>
                    <span className="muted">{workers.find((w) => w.id === f.workerId)?.name ?? "Unassigned"}</span>
                    <Badge tone={s.tone}>{s.title === "Due today" ? "Due today" : s.title}</Badge>
                  </div>
                  <div className="fu-actions">
                    <Link className="btn btn-ghost btn-sm" to={`/children/${child.id}`}><Eye size={14} />View child</Link>
                    {!done && <>
                      <button className="btn btn-ghost btn-sm" onClick={() => actions.open("editFollowup", { followup: f })}><Pencil size={14} />Edit</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setConfirm(f)}><Check size={14} />Complete</button></>}
                  </div>
                </li>); })}
            </ul>}
        </section>))}
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} title="Mark follow-up as complete?" confirmLabel="Mark complete"
        message={confirm ? `“${confirm.reason}” for ${kids.get(confirm.childId)?.name} will move to completed.` : ""}
        onConfirm={() => { completeFollowup(confirm.id); toast.success("Follow-up completed", kids.get(confirm.childId)?.name); }} />
    </div>
  );
}
