import { LayoutDashboard, Baby, TrendingUp, Apple, ClipboardCheck, Sparkles, BarChart3, Building2, Users, Bell, FlaskConical } from "lucide-react";

export const WORKER_NAV = [
  { to: "/worker", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/children", label: "Children", icon: Baby },
  { to: "/growth", label: "Growth", icon: TrendingUp, badge: "attention" },
  { to: "/nutrition", label: "Nutrition", icon: Apple },
  { to: "/followups", label: "Follow-ups", icon: ClipboardCheck, badge: "followups" },
  { to: "/insights", label: "Insights", icon: Sparkles },
  { to: "/notifications", label: "Notifications", icon: Bell, badge: "unread" },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];
export const ADMIN_NAV = [
  { to: "/admin", label: "Command centre", icon: LayoutDashboard, end: true },
  { to: "/admin/centres", label: "Centres", icon: Building2 },
  { to: "/admin/workers", label: "Workers", icon: Users },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/notifications", label: "Notifications", icon: Bell, badge: "unread" },
  { to: "/admin/settings", label: "Demo & system", icon: FlaskConical },
];
const w = (to) => WORKER_NAV.find((n) => n.to === to);
const a = (to) => ADMIN_NAV.find((n) => n.to === to);
// Bottom navigation on phones: four destinations plus "More" (opens the full menu).
export const MOBILE_TABS = {
  worker: [w("/worker"), w("/children"), w("/followups"), w("/insights")],
  admin: [a("/admin"), a("/admin/centres"), a("/admin/workers"), a("/admin/reports")],
};
