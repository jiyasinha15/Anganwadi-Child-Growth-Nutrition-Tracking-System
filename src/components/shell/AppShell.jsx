import { useEffect, useMemo, useState, Suspense } from "react";
import { NavLink, Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen, Search, LogOut, Menu, Plus, MoreHorizontal, UserPlus, Ruler, Apple, CalendarPlus, FileText, RotateCcw, FlaskConical, UserRound } from "lucide-react";
import { Dropdown, Modal, Tooltip, ChildAvatar, ConfirmDialog, useToast, PageSkeleton } from "../ui";
import NotificationPanel from "./NotificationPanel";
import SearchCommand from "./SearchCommand";
import { WORKER_NAV, ADMIN_NAV, MOBILE_TABS } from "./nav";
import { useSession, signOut } from "../../lib/session";
import { useStore, resetDemoData } from "../../services/store";
import { overview } from "../../services/analyticsService";
import { centres } from "../../data/seed";
import { readJSON, writeJSON } from "../../lib/storage";
import { useActions } from "../forms/ActionHost";
import { TODAY, fmtDate } from "../../lib/dates";

const COLLAPSE_KEY = "angansetu.sidebar.collapsed";
const TAGLINE = "Every Child. Every Milestone. Every Day.";

export function Logo({ compact }) {
  return (
    <Link to="/" className="logo" aria-label="AnganSetu home">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#0b5d46" /><path d="M6 22c4-1 6-5 10-5s6 4 10 5" fill="none" stroke="#e0eee6" strokeWidth="2.4" strokeLinecap="round" /><circle cx="16" cy="11" r="3.4" fill="#e0eee6" /></svg>
      {!compact && <span className="wordmark">AnganSetu</span>}
    </Link>
  );
}

const QUICK = [
  { label: "Register child", icon: UserPlus, to: "/children/new" },
  { label: "Record measurement", icon: Ruler, act: "measurement" },
  { label: "Nutrition check", icon: Apple, act: "nutrition" },
  { label: "Create follow-up", icon: CalendarPlus, act: "followup" },
  { label: "Generate report", icon: FileText, to: "/reports" },
];

export default function AppShell({ role }) {
  const session = useSession();
  const state = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [demoInfo, setDemoInfo] = useState(false);
  const actions = useActions();
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [quick, setQuick] = useState(false);
  const [confirmOut, setConfirmOut] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const nav = role === "admin" ? ADMIN_NAV : WORKER_NAV;
  const o = useMemo(() => overview(state), [state]);
  const unread = state.notifications.filter((n) => !n.read).length;
  const badges = { attention: o.attention, followups: o.overdue + o.dueToday, unread };
  const centre = centres.find((c) => c.id === session?.centreId) ?? centres[0];
  const profilePath = role === "admin" ? "/admin/profile" : "/profile";

  useEffect(() => { setCollapsed(readJSON(COLLAPSE_KEY, false)); }, []);
  const toggleCollapsed = () => setCollapsed((c) => { writeJSON(COLLAPSE_KEY, !c); return !c; });
  useEffect(() => { setDrawer(false); window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => {
    const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearch(true); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const logout = () => { signOut(); navigate("/"); toast.info("Signed out", "Demo session ended."); };
  const NavItem = ({ item, showLabel = true, tip }) => {
    const Icon = item.icon, count = item.badge ? badges[item.badge] : 0;
    const link = (
      <NavLink to={item.to} end={item.end} className="nav-link" aria-label={showLabel ? undefined : item.label}>
        <Icon size={18} aria-hidden="true" />{showLabel && <span>{item.label}</span>}
        {count > 0 && <em className="nav-badge" aria-label={`${count} ${item.badge === "unread" ? "unread" : "need attention"}`}>{count}</em>}
      </NavLink>);
    return tip ? <Tooltip label={item.label}>{link}</Tooltip> : link;
  };

  const profile = (
    <div className="profile-card">
      <ChildAvatar name={session?.name ?? "User"} size={34} />
      <div className="profile-meta"><b>{session?.name}</b><small><i className="online" aria-hidden="true" />Online · {role === "admin" ? "Administrator" : centre.short}</small></div>
    </div>
  );

  return (
    <div className={`shell ${collapsed ? "is-collapsed" : ""}`}>
      <a href="#main" className="skip-link">Skip to content</a>

      <aside className="sidebar" aria-label="Primary">
        <div className="sidebar-top"><Logo compact={collapsed} /></div>
        <nav className="sidebar-nav">
          {role === "admin" && !collapsed && <div className="nav-section">Administration</div>}
          {nav.map((item) => <NavItem key={item.to} item={item} showLabel={!collapsed} tip={collapsed} />)}
        </nav>
        <div className="sidebar-bottom">
          {!collapsed && profile}
          <button className="nav-link nav-btn" onClick={toggleCollapsed} aria-pressed={collapsed} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}{!collapsed && <span>Collapse</span>}
          </button>
          {collapsed ? <Tooltip label="Sign out"><button className="nav-link nav-btn" onClick={() => setConfirmOut(true)} aria-label="Sign out"><LogOut size={18} /></button></Tooltip>
            : <button className="nav-link nav-btn" onClick={() => setConfirmOut(true)}><LogOut size={18} /><span>Sign out</span></button>}
        </div>
      </aside>

      <div className="shell-main">
        <header className="topbar">
          <button className="icon-btn only-mobile" onClick={() => setDrawer(true)} aria-label="Open menu"><Menu size={20} /></button>
          <div className="only-mobile"><Logo compact /></div>
          <div className="topbar-hello">
            <b>{role === "admin" ? "All centres" : centre.name}</b>
            <small>{fmtDate(TODAY, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</small>
          </div>
          <button className="search-trigger" onClick={() => setSearch(true)} aria-label="Search (Ctrl+K)">
            <Search size={16} aria-hidden="true" /><span>Search…</span><kbd>Ctrl K</kbd>
          </button>
          <div className="topbar-right">
            <button className="demo-pill" onClick={() => setDemoInfo(true)} aria-label="Demo mode: about this data"><FlaskConical size={13} aria-hidden="true" /><span>Demo mode</span></button>
            <button className="icon-btn only-mobile" onClick={() => setSearch(true)} aria-label="Search"><Search size={19} /></button>
            <NotificationPanel role={role} />
            <Dropdown label="Profile menu" trigger={<ChildAvatar name={session?.name ?? "User"} size={34} />}>
              <div className="menu">
                <div className="menu-head"><b>{session?.name}</b><small>{role === "admin" ? "Administrator" : `Worker · ${centre.name}`}</small></div>
                                <button className="menu-item" data-close onClick={() => navigate(profilePath)}><UserRound size={15} />My profile</button>
                <button className="menu-item" data-close onClick={() => setDemoInfo(true)}><FlaskConical size={15} />Demo mode</button>
                <button className="menu-item" data-close onClick={() => setConfirmReset(true)}><RotateCcw size={15} />Reset demo data</button>
                <button className="menu-item" data-close onClick={() => setConfirmOut(true)}><LogOut size={15} />Sign out</button>
              </div>
            </Dropdown>
          </div>
        </header>

        <main id="main" className="content" tabIndex={-1}>
          <Suspense fallback={<PageSkeleton />}>
            <div key={pathname} className="route-fade"><Outlet /></div>
          </Suspense>
        </main>
      </div>

      {/* Mobile */}
      {role === "worker" && <button className="fab" onClick={() => setQuick(true)} aria-label="Quick actions"><Plus size={24} /></button>}
      <nav className="bottom-nav" aria-label="Primary mobile">
        {MOBILE_TABS[role].map((item) => { const Icon = item.icon; return (
          <NavLink key={item.to} to={item.to} end={item.end} className="tab"><Icon size={20} aria-hidden="true" /><span>{item.label}</span>
            {item.badge && badges[item.badge] > 0 && <em className="nav-badge">{badges[item.badge]}</em>}</NavLink>); })}
        <button className="tab" onClick={() => setDrawer(true)}><MoreHorizontal size={20} aria-hidden="true" /><span>More</span></button>
      </nav>

      {drawer && <div className="m-drawer-wrap" onMouseDown={(e) => e.target === e.currentTarget && setDrawer(false)}>
        <aside className="m-drawer" aria-label="Menu">
          <div className="sidebar-top"><Logo /></div>
          <nav className="sidebar-nav">{nav.map((item) => <NavItem key={item.to} item={item} />)}</nav>
          <div className="sidebar-bottom">{profile}
            <button className="nav-link nav-btn" onClick={() => setConfirmOut(true)}><LogOut size={18} /><span>Sign out</span></button></div>
        </aside></div>}

      <Modal open={quick} onClose={() => setQuick(false)} title="Quick actions" size="sm">
        <div className="quick-list">{QUICK.map((a) => <button key={a.label} className="quick-item" onClick={() => { setQuick(false); if (a.act) actions.open(a.act); else navigate(a.to); }}><a.icon size={18} />{a.label}</button>)}</div>
      </Modal>
      <SearchCommand open={search} onClose={() => setSearch(false)} role={role} />
      <Modal open={demoInfo} onClose={() => setDemoInfo(false)} title="Demo mode" size="sm"
        footer={<button className="btn btn-primary" onClick={() => setDemoInfo(false)}>Got it</button>}>
        <div className="demo-info">
          <p>This environment uses <b>fictional data</b> for demonstration purposes. Names, guardians and measurements are not real people.</p>
          <p className="muted">The data is the same every time you start. Changes you make are saved in this browser only, and you can restore the original set from the profile menu. {TAGLINE}</p>
          <p className="muted">ANGANSETU is a monitoring support tool. It does not provide medical diagnosis.</p>
        </div>
      </Modal>
      <ConfirmDialog open={confirmOut} onClose={() => setConfirmOut(false)} onConfirm={logout} title="Sign out?" message="You'll return to the ANGANSETU start page. Demo data stays saved in this browser." confirmLabel="Sign out" />
      <ConfirmDialog open={confirmReset} onClose={() => setConfirmReset(false)} tone="danger" title="Reset demo data?" confirmLabel="Reset data"
        message="This removes any children, measurements, nutrition records and follow-ups you added and restores the original demo set."
        onConfirm={() => { resetDemoData(); toast.success("Demo data reset"); }} />
    </div>
  );
}
