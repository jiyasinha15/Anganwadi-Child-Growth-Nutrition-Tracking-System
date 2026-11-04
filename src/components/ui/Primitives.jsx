import { useId } from "react";
import { Inbox, AlertCircle, RotateCw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { STATUS } from "../../services/growthService";

export function Badge({ tone = "neutral", icon: Icon, children, dot }) {
  return <span className={`badge badge-${tone}`}>{dot && <i className="dot" aria-hidden="true" />}{Icon && <Icon size={12} aria-hidden="true" />}{children}</span>;
}

// Status is always conveyed by text + icon shape, never colour alone.
export function StatusBadge({ status }) {
  const s = STATUS[status] ?? STATUS.new;
  return <Badge tone={s.tone} dot>{s.label}</Badge>;
}

export function ProgressBar({ value, tone = "primary", label, showValue = true }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="progress">
      {(label || showValue) && <div className="progress-top"><span>{label}</span>{showValue && <b>{v}%</b>}</div>}
      <div className={`progress-track tone-${tone}`} role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="progress-fill" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

export function Skeleton({ w = "100%", h = 14, r = 6, className = "" }) {
  return <span className={`skeleton ${className}`} style={{ width: w, height: h, borderRadius: r }} aria-hidden="true" />;
}
export function SkeletonCard({ lines = 3 }) {
  return <div className="card" aria-busy="true"><Skeleton w="40%" h={16} />{Array.from({ length: lines }, (_, i) => <div key={i} style={{ marginTop: 12 }}><Skeleton w={i === lines - 1 ? "60%" : "100%"} /></div>)}</div>;
}

export function EmptyState({ icon: Icon = Inbox, title, message, action, onAction }) {
  return (
    <div className="empty">
      <span className="empty-icon"><Icon size={22} aria-hidden="true" /></span>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action && <button className="btn btn-primary" onClick={onAction}>{action}</button>}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", message = "We couldn't load this information.", onRetry }) {
  return (
    <div className="empty" role="alert">
      <span className="empty-icon danger"><AlertCircle size={22} aria-hidden="true" /></span>
      <h3>{title}</h3><p>{message}</p>
      {onRetry && <button className="btn btn-secondary" onClick={onRetry}><RotateCw size={16} />Try again</button>}
    </div>
  );
}

const initials = (n) => n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
export function ChildAvatar({ name, gender, size = 36 }) {
  return <span className={`avatar av-${gender === "Female" ? "f" : "m"}`} style={{ width: size, height: size, fontSize: size * 0.38 }} aria-hidden="true">{initials(name)}</span>;
}

export function Tooltip({ label, children }) {
  const id = useId();
  return <span className="tip" aria-describedby={id}>{children}<span role="tooltip" id={id} className="tip-bubble">{label}</span></span>;
}

// trend: { dir: "up" | "down" | "flat", label } and must come from real data. Omit it when there's nothing to compare.
export function StatCard({ icon: Icon, label, value, hint, tone = "neutral", onClick, trend }) {
  const Tag = onClick ? "button" : "div";
  const TrendIcon = trend?.dir === "up" ? TrendingUp : trend?.dir === "down" ? TrendingDown : Minus;
  return (
    <Tag className={`card stat stat-${tone} ${onClick ? "stat-click" : ""}`} onClick={onClick}>
      <div className="stat-head"><span>{label}</span>{Icon && <i className={`stat-icon tone-${tone}`}><Icon size={16} aria-hidden="true" /></i>}</div>
      <div className="metric">{value}</div>
      <div className="stat-foot">
        {hint && <span className="stat-hint">{hint}</span>}
        {trend && <span className={`trend-chip ${trend.dir}`}><TrendIcon size={12} aria-hidden="true" />{trend.label}</span>}
      </div>
    </Tag>
  );
}

export function PageHeader({ title, subtitle, actions, back }) {
  return (
    <div className="page-head">
      <div>{back}<h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

const PRIORITY = { High: "warning", Medium: "info", Low: "neutral" };
// Priority uses amber/blue/grey so "High" doesn't read as an emergency.
export function PriorityBadge({ priority }) {
  return <Badge tone={PRIORITY[priority] ?? "neutral"}>{priority} priority</Badge>;
}

export function SectionHeader({ title, description, action }) {
  return <div className="card-head"><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>;
}

// Placeholder shown while a lazy route loads: mirrors the real page layout so nothing jumps.
export function PageSkeleton() {
  return (
    <div className="page" aria-busy="true" aria-label="Loading">
      <div><Skeleton w="220px" h={26} r={8} /><div style={{ marginTop: 10 }}><Skeleton w="min(340px, 80%)" h={14} /></div></div>
      <div className="grid grid-kpi">{Array.from({ length: 4 }, (_, i) => <div key={i} className="card"><Skeleton w="50%" h={12} /><div style={{ margin: "14px 0 10px" }}><Skeleton w="40%" h={28} r={8} /></div><Skeleton w="70%" h={11} /></div>)}</div>
      <div className="card"><Skeleton w="30%" h={16} /><div style={{ marginTop: 16 }}><Skeleton h={180} r={12} /></div></div>
    </div>
  );
}
