import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCheck, BellOff } from "lucide-react";
import { PageHeader, EmptyState, Segmented } from "../components/ui";
import NotificationItem from "../components/NotificationItem";
import { useStore } from "../services/store";
import { markRead, markAllRead, describe, CATEGORIES } from "../services/notificationService";

export default function Notifications() {
  const { notifications } = useStore();
  const navigate = useNavigate();
  const admin = useLocation().pathname.startsWith("/admin");
  const [cat, setCat] = useState("All");
  const [readFilter, setReadFilter] = useState("all");
  const unread = notifications.filter((n) => !n.read).length;

  const shown = useMemo(() => notifications
    .filter((n) => cat === "All" || describe(n).category === cat)
    .filter((n) => readFilter === "all" || !n.read), [notifications, cat, readFilter]);
  const counts = useMemo(() => Object.fromEntries(CATEGORIES.map((c) => [c, notifications.filter((n) => describe(n).category === c).length])), [notifications]);

  const open = (n) => { markRead(n.id); navigate(admin && !n.to.startsWith("/admin") ? "/admin" : n.to); };

  return (
    <div className="page">
      <PageHeader title="Notifications" subtitle={unread ? `${unread} unread` : "You're all caught up."}
        actions={<button className="btn btn-secondary" onClick={markAllRead} disabled={!unread}><CheckCheck size={16} />Mark all as read</button>} />
      <div className="filter-bar">
        <Segmented label="Category" value={cat} onChange={setCat}
          options={[{ value: "All", label: "All", count: notifications.length }, ...CATEGORIES.map((c) => ({ value: c, label: c, count: counts[c] }))]} />
        <Segmented label="Read state" value={readFilter} onChange={setReadFilter} options={[{ value: "all", label: "All" }, { value: "unread", label: "Unread" }]} />
      </div>
      <section className="card flush">
        {shown.length === 0
          ? <EmptyState icon={BellOff} title="No notifications here" message={cat === "All" && readFilter === "all" ? "Alerts about measurements, follow-ups and nutrition will appear here." : "Nothing matches these filters. Try showing all categories."} />
          : <div className="notif-list wide">{shown.map((n) => <NotificationItem key={n.id} n={n} onOpen={open} detailed />)}</div>}
      </section>
    </div>
  );
}
