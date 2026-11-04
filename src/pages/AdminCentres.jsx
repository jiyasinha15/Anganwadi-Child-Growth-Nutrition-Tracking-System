import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { PageHeader, Badge, ProgressBar } from "../components/ui";
import { useStore } from "../services/store";
import { centreStats } from "../services/analyticsService";

const PERF = { Strong: "success", "On track": "info", "Needs support": "warning", Inactive: "neutral" };

export default function AdminCentres() {
  const state = useStore();
  const navigate = useNavigate();
  const cs = useMemo(() => centreStats(state), [state]);
  return (
    <div className="page">
      <PageHeader title="Centres" subtitle={`${cs.length} Anganwadi centres`} />
      <div className="grid grid-cards">
        {cs.map((c) => (
          <button key={c.id} className="card centre-card" onClick={() => navigate(`/admin/centres/${c.id}`)} aria-label={`Open ${c.name}`}>
            <div className="centre-top"><div><h2>{c.name}</h2><p><MapPin size={13} aria-hidden="true" /> {c.location}</p></div><Badge tone={PERF[c.performance]}>{c.performance}</Badge></div>
            <div className="centre-nums"><span><b>{c.children}</b>Children</span><span><b>{c.workers}</b>Workers</span><span><b>{c.pending}</b>Open follow-ups</span></div>
            <ProgressBar value={c.coveragePct} label="Monitoring coverage" tone={c.coveragePct >= 70 ? "primary" : "warning"} />
            <span className="link-arrow">View centre <ArrowRight size={14} /></span>
          </button>))}
      </div>
    </div>
  );
}
