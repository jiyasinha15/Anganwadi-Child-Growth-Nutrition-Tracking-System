import { useNavigate } from "react-router-dom";
import { Clock, TrendingDown, Apple, Trophy, CalendarCheck, ArrowRight, Lightbulb } from "lucide-react";
import { Badge } from "./ui";

const ICONS = { Clock, TrendingDown, Apple, Trophy, CalendarCheck };
const SEV = {
  attention: { tone: "warning", label: "Attention" }, review: { tone: "insight", label: "Review" },
  positive: { tone: "success", label: "On track" }, info: { tone: "info", label: "Planning" },
};

export default function InsightCard({ insight }) {
  const navigate = useNavigate();
  const Icon = ICONS[insight.icon] ?? Clock, s = SEV[insight.severity] ?? SEV.info;
  return (
    <article className={`card insight sev-${s.tone}`}>
      <i className="insight-icon"><Icon size={18} aria-hidden="true" /></i>
      <div className="insight-main">
        <div className="insight-tags"><Badge tone={s.tone}>{s.label}</Badge>{insight.affected != null && <span className="caption">{insight.affected} affected</span>}</div>
        <h3>{insight.title}</h3><p>{insight.body}</p>
        {insight.suggestion && <p className="insight-suggest"><Lightbulb size={14} aria-hidden="true" /><span><b>Suggested action:</b> {insight.suggestion}</span></p>}
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(insight.to)}>{insight.cta}<ArrowRight size={14} /></button>
      </div>
    </article>
  );
}
