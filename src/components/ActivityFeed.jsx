import { Link } from "react-router-dom";
import { Ruler, UserPlus, Apple, ClipboardCheck, Activity } from "lucide-react";
import { stampLabel } from "../lib/dates";

const KIND = { measurement: Ruler, register: UserPlus, nutrition: Apple, followup: ClipboardCheck };

// Used for both the centre-wide feed and a single child's timeline (variant="timeline").
export default function ActivityFeed({ items, limit, variant = "feed", linkChild = true }) {
  const list = limit ? items.slice(0, limit) : items;
  return (
    <ol className={variant === "timeline" ? "timeline" : "feed"}>
      {list.map((a) => {
        const Icon = KIND[a.kind] ?? Activity;
        const text = linkChild && a.childId ? <Link to={`/children/${a.childId}`}>{a.text}</Link> : <span className="feed-text">{a.text}</span>;
        return (
          <li key={a.id}>
            <i className="feed-icon"><Icon size={14} aria-hidden="true" /></i>
            <div>{text}<small>{stampLabel(a.at)}{a.actor ? ` · ${a.actor}` : ""}</small></div>
          </li>
        );
      })}
    </ol>
  );
}
