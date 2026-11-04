import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Baby, Users, Building2, ClipboardCheck, FileText, CornerDownLeft, Zap, LayoutDashboard, Sparkles, Bell } from "lucide-react";
import { Modal } from "../ui";
import { useActions } from "../forms/ActionHost";
import { useStore } from "../../services/store";
import { centres, workers } from "../../data/seed";
import { ageLabel } from "../../lib/dates";

const REPORTS = ["Child monitoring report", "Growth monitoring report", "Nutrition report", "Follow-up report", "Centre performance report"];

export default function SearchCommand({ open, onClose, role }) {
  const { children, followups } = useStore();
  const actions = useActions();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();
  const listRef = useRef(null);
  const admin = role === "admin";
  const base = admin ? "/admin" : "";

  const commands = useMemo(() => admin ? [
    { key: "c-dash", label: "Open command centre", icon: LayoutDashboard, to: "/admin" },
    { key: "c-cen", label: "Open centres", icon: Building2, to: "/admin/centres" },
    { key: "c-wrk", label: "Open workers", icon: Users, to: "/admin/workers" },
    { key: "c-rep", label: "Open reports", icon: FileText, to: "/admin/reports" },
    { key: "c-not", label: "Open notifications", icon: Bell, to: "/admin/notifications" },
  ] : [
    { key: "c-dash", label: "Open dashboard", icon: LayoutDashboard, to: "/worker" },
    { key: "c-add", label: "Add child", icon: Baby, to: "/children/new" },
    { key: "c-mea", label: "Record measurement", icon: Zap, act: "measurement" },
    { key: "c-nut", label: "Add nutrition", icon: Zap, act: "nutrition" },
    { key: "c-fup", label: "Create follow-up", icon: Zap, act: "followup" },
    { key: "c-chi", label: "Search child", icon: Baby, to: "/children" },
    { key: "c-ins", label: "Open insights", icon: Sparkles, to: "/insights" },
    { key: "c-not", label: "Open notifications", icon: Bell, to: "/notifications" },
  ], [admin]);

  const groups = useMemo(() => {
    const t = q.trim().toLowerCase();
    const has = (s) => (s ?? "").toLowerCase().includes(t);
    const g = [];
    if (!t) return [{ title: "Commands", icon: Zap, items: commands.map((c) => ({ ...c, sub: c.act ? "Action" : "Go to" })) }];
    const cmds = commands.filter((c) => has(c.label));
    if (cmds.length) g.push({ title: "Commands", icon: Zap, items: cmds.map((c) => ({ ...c, sub: c.act ? "Action" : "Go to" })) });
    if (!admin) {
      const kids = children.filter((c) => has(c.name) || has(c.guardian));
      if (kids.length) g.push({ title: `Children (${kids.length})`, icon: Baby, items: kids.slice(0, 5).map((c) => ({ key: `p${c.id}`, label: c.name, sub: `Child profile · ${ageLabel(c.dob)}`, to: `/children/${c.id}` })) });
      const fu = followups.filter((f) => f.status === "pending").filter((f) => has(f.reason) || has(children.find((c) => c.id === f.childId)?.name));
      if (fu.length) g.push({ title: `Follow-ups (${fu.length})`, icon: ClipboardCheck, items: fu.slice(0, 4).map((f) => ({ key: f.id, label: f.reason, sub: children.find((c) => c.id === f.childId)?.name, to: "/followups" })) });
    }
    const ce = centres.filter((x) => has(x.name) || has(x.location));
    if (ce.length) g.push({ title: `Centres (${ce.length})`, icon: Building2, items: ce.map((x) => ({ key: x.id, label: x.name, sub: x.location, to: admin ? `/admin/centres/${x.id}` : "/children" })) });
    if (admin) {
      const w = workers.filter((x) => has(x.name));
      if (w.length) g.push({ title: `Workers (${w.length})`, icon: Users, items: w.map((x) => ({ key: x.id, label: x.name, sub: x.role, to: `/admin/workers?worker=${x.id}` })) });
    }
    const re = REPORTS.filter((r) => has(r) || t === "report");
    if (re.length) g.push({ title: "Reports", icon: FileText, items: re.map((r) => ({ key: r, label: r, sub: "Report", to: `${base}/reports` })) });
    return g;
  }, [q, children, followups, commands, admin, base]);

  const flat = groups.flatMap((g) => g.items);
  useEffect(() => { setIdx(0); }, [q]);
  useEffect(() => { if (!open) setQ(""); }, [open]);
  useEffect(() => { listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" }); }, [idx]);

  const go = (item) => { onClose(); if (item.act) actions.open(item.act); else navigate(item.to); };
  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, flat.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && flat[idx]) go(flat[idx]);
  };
  let n = -1;

  return (
    <Modal open={open} onClose={onClose} title="Search" size="md" className="cmd">
      <div className="cmd-box">
        <Search size={18} aria-hidden="true" />
        <input data-autofocus className="cmd-input" placeholder={admin ? "Search centres, workers, reports…" : "Search children, follow-ups or type a command…"}
          value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} role="combobox" aria-expanded="true" aria-controls="cmd-list"
          aria-activedescendant={flat[idx] ? `cmd-${flat[idx].key}` : undefined} aria-label="Search" />
        <kbd>Esc</kbd>
      </div>
      <div id="cmd-list" ref={listRef} role="listbox" className="cmd-list">
        {q.trim() && !flat.length && <p className="cmd-hint">No results for “{q}”. Check the spelling or try a guardian's name.</p>}
        {groups.map((g) => (
          <div key={g.title} role="group" aria-label={g.title}><div className="cmd-group">{g.title}</div>
            {g.items.map((it) => { n += 1; const sel = n === idx; const i = n; const Icon = it.icon ?? g.icon; return (
              <button key={it.key} id={`cmd-${it.key}`} role="option" aria-selected={sel} className={`cmd-item ${sel ? "sel" : ""}`} onMouseEnter={() => setIdx(i)} onClick={() => go(it)}>
                <Icon size={16} aria-hidden="true" /><span><b>{it.label}</b><small>{it.sub}</small></span>{sel && <CornerDownLeft size={14} aria-hidden="true" />}
              </button>); })}
          </div>))}
      </div>
    </Modal>
  );
}
