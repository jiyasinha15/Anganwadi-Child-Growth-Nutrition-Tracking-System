import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { Dropdown } from "../ui";
import NotificationItem from "../NotificationItem";
import { useStore } from "../../services/store";
import { markRead, markAllRead } from "../../services/notificationService";

export default function NotificationPanel({ role }) {
  const { notifications } = useStore();
  const navigate = useNavigate();
  const unread = notifications.filter((n) => !n.read).length;
  const all = role === "admin" ? "/admin/notifications" : "/notifications";
  const open = (n) => { markRead(n.id); navigate(role === "admin" && !n.to.startsWith("/admin") ? "/admin" : n.to); };

  return (
    <Dropdown label={`Notifications, ${unread} unread`} trigger={
      <span className="icon-btn"><Bell size={19} aria-hidden="true" />{unread > 0 && <span className="bell-badge">{unread}</span>}</span>}>
      <div className="notif-panel">
        <div className="notif-head"><h3>Notifications</h3>
          <button className="btn btn-ghost btn-sm" onClick={markAllRead} disabled={!unread}>Mark all read</button></div>
        <div className="notif-list" data-close>
          {notifications.length === 0 && <p className="cmd-hint">You're all caught up.</p>}
          {notifications.slice(0, 4).map((n) => <NotificationItem key={n.id} n={n} onOpen={open} />)}
        </div>
        <button className="notif-all" data-close onClick={() => navigate(all)}>View all notifications</button>
      </div>
    </Dropdown>
  );
}
