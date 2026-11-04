import { update } from "./store";

export const markRead = (id) => update((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }));
export const markAllRead = () => update((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));

const TYPE = {
  priority: { category: "Measurement", priority: "High", tone: "danger", label: "Priority review" },
  followup: { category: "Follow-up", priority: "Medium", tone: "warning", label: "Follow-up due" },
  reminder: { category: "Measurement", priority: "Low", tone: "info", label: "Reminder" },
  done: { category: "System", priority: "Low", tone: "success", label: "Completed" },
};
// Seed notifications carry only a type; newer ones may set their own category.
export const describe = (n) => {
  const t = TYPE[n.type] ?? TYPE.reminder;
  return { ...t, category: n.category ?? t.category };
};
export const CATEGORIES = ["Measurement", "Follow-up", "Nutrition", "System"];
