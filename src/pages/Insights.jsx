import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHeader, SectionHeader, EmptyState } from "../components/ui";
import InsightCard from "../components/InsightCard";
import ActivityFeed from "../components/ActivityFeed";
import { useWorkerScope } from "../services/selectors";
import { insights } from "../services/analyticsService";

export default function Insights() {
  const { state, centre } = useWorkerScope();
  const list = useMemo(() => insights(state), [state]);
  return (
    <div className="page">
      <PageHeader title="Insights" subtitle={`Operational patterns for ${centre.name}, generated from current records.`} />
      <p className="note">These are operational monitoring insights, not medical diagnoses. Review any concerns with an appropriate health professional.</p>
      <div className="split">
        <div className="grid">{list.map((i) => <InsightCard key={i.id} insight={i} />)}</div>
        <section className="card">
          <SectionHeader title="Recent activity" description="What your team has done lately." action={<Link to="/notifications" className="link-arrow">Notifications <ArrowRight size={14} /></Link>} />
          {state.activity.length ? <ActivityFeed items={state.activity} limit={8} /> : <EmptyState title="No activity yet" message="Record a measurement to see insights update." />}
        </section>
      </div>
    </div>
  );
}
