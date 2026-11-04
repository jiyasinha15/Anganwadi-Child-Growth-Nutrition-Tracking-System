import { AlertOctagon, CalendarClock, Info, CheckCircle2 } from "lucide-react";
import { describe } from "../services/notificationService";
import { stampLabel } from "../lib/dates";

const ICON = { danger: AlertOctagon, warning: CalendarClock, info: Info, success: CheckCircle2 };

export default function NotificationItem({ n, onOpen, detailed }) {
  const d = describe(n), Icon = ICON[d.tone] ?? Info;
  return (
    <button className={`notif ${n.read ? "" : "unread"}`} onClick={() => onOpen(n)}>
      <i className={`notif-icon tone-${d.tone}`}><Icon size={16} aria-hidden="true" /></i>
      <span className="notif-body">
        <b>{d.label}{!n.read && <em className="new-dot" aria-label="Unread" />}</b>
        <span>{n.body}</span>
        <small>{detailed ? `${d.category} · ${d.priority} priority · ` : ""}{stampLabel(n.at)}</small>
      </span>
    </button>
  );
}
