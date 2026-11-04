import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Ruler, ClipboardCheck, Apple, UserPlus, CalendarPlus, ArrowRight, CheckCircle2, LineChart, Sparkles } from "lucide-react";
import { StatCard, SectionHeader, EmptyState, Badge, PriorityBadge, Segmented, ChildAvatar } from "../components/ui";
import GrowthChart from "../components/domain/GrowthChart";
import NutritionDonut from "../components/domain/NutritionDonut";
import ActivityFeed from "../components/ActivityFeed";
import { useActions } from "../components/forms/ActionHost";
import { useWorkerScope } from "../services/selectors";
import { overview, priorities } from "../services/analyticsService";
import { averageSeries } from "../services/growthService";
import { NUTRITION_STATUS } from "../services/nutritionService";
import { bucket } from "../services/followupService";
import { TODAY, fmtDate, relativeDay } from "../lib/dates";

const LEVEL = { high: { tone: "warning", label: "High priority" }, medium: { tone: "info", label: "Medium priority" }, done: { tone: "success", label: "Done" } };
const monthLabel = (ym) => new Date(`${ym}-01T00:00:00Z`).toLocaleDateString("en-IN", { month: "short", year: "2-digit", timeZone: "UTC" });
const compare = (now, before, noun) => {
  if (!before && !now) return null;
  const d = now - before;
  return { dir: d > 0 ? "up" : d < 0 ? "down" : "flat", label: d === 0 ? `Same as prior 30 days` : `${d > 0 ? "+" : ""}${d} ${noun} vs prior 30 days` };
};

export default function WorkerDashboard() {
  const { state, centre, session } = useWorkerScope();
  const navigate = useNavigate();
  const actions = useActions();
  const [metric, setMetric] = useState("weight");
  const [range, setRange] = useState(180);

  const o = useMemo(() => overview(state), [state]);
  const items = useMemo(() => priorities(state), [state]);
  const open = items.filter((i) => i.level !== "done");
  const data = useMemo(() => averageSeries(state.children, range).map((r) => ({ ...r, month: monthLabel(r.month) })), [state.children, range]);
  const nutri = useMemo(() => state.children.reduce((a, c) => { const k = NUTRITION_STATUS(c.id, state); a[k] = (a[k] || 0) + 1; return a; }, {}), [state]);
  const upcoming = useMemo(() => state.followups.filter((f) => f.status === "pending" && bucket(f) !== "overdue").sort((a, b) => a.due.localeCompare(b.due)).slice(0, 4), [state.followups]);
  const kid = (id) => state.children.find((c) => c.id === id);
  const first = session?.name?.split(" ")[0] ?? "there";

  const act = (i) => {
    if (i.action === "measure") return { label: "Record measurement", run: () => actions.open("measurement", { childId: i.child.id }) };
    if (i.action === "followup") return { label: "View follow-up", run: () => navigate("/followups") };
    return { label: "Open profile", run: () => navigate(`/children/${i.child.id}`) };
  };

  return (
    <div className="page">
      <section className="hero" aria-labelledby="hero-h">
        <div className="hero-main">
          <p className="hero-date">{fmtDate(TODAY, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
          <h1 id="hero-h">Good morning, {first}</h1>
          <p className="hero-sub">{centre.name}</p>
          <p className={`hero-status ${open.length ? "" : "clear"}`} aria-live="polite">
            {open.length
              ? <><b>{open.length}</b> {open.length === 1 ? "child needs" : "children need"} your attention today</>
              : <><CheckCircle2 size={16} aria-hidden="true" /> Nothing needs attention right now</>}
          </p>
        </div>
        <div className="hero-side">
          <div className="hero-chip"><b>{o.coveragePct}%</b><span>monitoring coverage</span></div>
          <div className="hero-chip"><b>{o.overdue + o.dueToday}</b><span>follow-ups due</span></div>
          <button className="btn btn-hero" onClick={() => navigate("/children/new")}><UserPlus size={16} />Add child</button>
        </div>
      </section>

      <div className="grid grid-kpi">
        <StatCard icon={Users} label="Children monitored" value={o.children} hint={`${o.coveragePct}% measured in 30 days`} onClick={() => navigate("/children")} />
        <StatCard icon={Ruler} label="Measurements due" value={o.unmeasured.length} tone={o.unmeasured.length ? "warning" : "neutral"} hint="Not measured in 30+ days"
          trend={compare(o.monthMeasurements, o.prevMonthMeasurements, "measurements")} onClick={() => navigate("/children?status=due")} />
        <StatCard icon={ClipboardCheck} label="Follow-ups due" value={o.overdue + o.dueToday} tone={o.overdue ? "danger" : "info"} hint={`${o.overdue} overdue · ${o.dueToday} due today`}
          trend={o.completedWeek ? { dir: "up", label: `${o.completedWeek} completed this week` } : null} onClick={() => navigate("/followups")} />
        <StatCard icon={Apple} label="Nutrition coverage" value={`${o.nutritionPct}%`} tone="insight" hint={`${o.nutritionDone} of ${o.children} have a record this week`} onClick={() => navigate("/nutrition")} />
      </div>

      <div className="split">
        <section className="card" aria-labelledby="prio-h">
          <SectionHeader title="Today's priorities" description="Most urgent first. Each item opens the right workflow."
            action={<Link to="/followups" className="link-arrow">All follow-ups <ArrowRight size={14} /></Link>} />
          {items.length === 0
            ? <EmptyState icon={CheckCircle2} title="No priorities today" message="Measurements and follow-ups are up to date. New items appear here as they come due." />
            : <ol className="prio-list">
              {items.slice(0, 7).map((i, n) => { const a = act(i), l = LEVEL[i.level]; return (
                <li key={i.id} className={`prio ${i.level}`}>
                  <span className="prio-n" aria-hidden="true">{i.level === "done" ? <CheckCircle2 size={16} /> : n + 1}</span>
                  <ChildAvatar name={i.child.name} gender={i.child.gender} size={36} />
                  <div className="prio-main">
                    <b>{i.reason}</b>
                    <span><Link to={`/children/${i.child.id}`}>{i.child.name}</Link> · {i.when}</span>
                  </div>
                  <Badge tone={l.tone}>{l.label}</Badge>
                  {i.level !== "done" && <button className="btn btn-secondary btn-sm" onClick={a.run}>{a.label}</button>}
                </li>); })}
            </ol>}
        </section>

        <div className="stack">
          <section className="card">
            <SectionHeader title="Quick actions" />
            <div className="quick-grid">
              <button className="quick-item" onClick={() => navigate("/children/new")}><UserPlus size={18} />Add child</button>
              <button className="quick-item" onClick={() => actions.open("measurement")}><Ruler size={18} />Record measurement</button>
              <button className="quick-item" onClick={() => actions.open("nutrition")}><Apple size={18} />Nutrition check</button>
              <button className="quick-item" onClick={() => actions.open("followup")}><CalendarPlus size={18} />Create follow-up</button>
            </div>
          </section>
          <section className="card">
            <SectionHeader title="Nutrition overview" description="Records within the last 7 days" action={<Link to="/nutrition" className="link-arrow">Open <ArrowRight size={14} /></Link>} />
            {o.children === 0 ? <EmptyState icon={Apple} title="No children yet" message="Add a child to start nutrition tracking." /> : <NutritionDonut counts={nutri} total={o.children} />}
          </section>
        </div>
      </div>

      <section className="card chart-card">
        <SectionHeader title="Growth overview" description={`Average ${metric} across ${centre.short}, by month`}
          action={<div className="ctl-row"><Segmented label="Metric" value={metric} onChange={setMetric} options={[{ value: "height", label: "Height" }, { value: "weight", label: "Weight" }]} />
            <Segmented label="Date range" value={range} onChange={setRange} options={[{ value: 90, label: "3 months" }, { value: 180, label: "6 months" }]} /></div>} />
        {data.length < 2
          ? <EmptyState icon={LineChart} title="Not enough measurements yet" message="Record measurements across at least two months to see the centre's growth overview." action="Record measurement" onAction={() => actions.open("measurement")} />
          : <GrowthChart data={data} xKey="month" metric={metric} lines={[{ key: metric, name: `Average ${metric}` }]} height={260} />}
      </section>

      <div className="split even">
        <section className="card">
          <SectionHeader title="Coming up" description="Next follow-ups on the calendar" action={<button className="btn btn-secondary btn-sm" onClick={() => actions.open("followup")}><CalendarPlus size={14} />Create</button>} />
          {upcoming.length === 0 ? <EmptyState icon={Sparkles} title="Nothing scheduled" message="Create a follow-up to keep track of the next visit." />
            : <ul className="coming">{upcoming.map((f) => { const c = kid(f.childId); return c && (
              <li key={f.id}><ChildAvatar name={c.name} gender={c.gender} size={34} />
                <div><Link to={`/children/${c.id}`}>{c.name}</Link><span>{f.reason}</span></div>
                <div className="coming-when"><b>{relativeDay(f.due)}</b><PriorityBadge priority={f.priority} /></div></li>); })}</ul>}
        </section>
        <section className="card">
          <SectionHeader title="Recent activity" action={<Link to="/insights" className="link-arrow">Insights <ArrowRight size={14} /></Link>} />
          {state.activity.length ? <ActivityFeed items={state.activity} limit={6} /> : <EmptyState title="No activity yet" message="Recording measurements and follow-ups will show up here." />}
        </section>
      </div>
    </div>
  );
}
