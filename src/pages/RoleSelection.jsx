import { Link, Navigate } from "react-router-dom";
import { ClipboardList, ShieldCheck, ArrowRight, FlaskConical, Ruler, Lightbulb, Target, CalendarCheck } from "lucide-react";
import { Logo } from "../components/shell/AppShell";
import GrowthIllustration from "../components/domain/GrowthIllustration";
import { useSession } from "../lib/session";

const STEPS = [
  { icon: Ruler, title: "Track", text: "Record height, weight and meals at every visit, in seconds." },
  { icon: Lightbulb, title: "Understand", text: "See each child's growth journey and where coverage is slipping." },
  { icon: Target, title: "Act", text: "Start the day with a short, ordered list of who needs you." },
  { icon: CalendarCheck, title: "Follow up", text: "Close the loop with reminders that don't get lost." },
];

export default function RoleSelection() {
  const session = useSession();
  if (session) return <Navigate to={session.role === "admin" ? "/admin" : "/worker"} replace />;
  return (
    <div className="lp">
      <header className="lp-nav">
        <Logo />
        <span className="demo-pill"><FlaskConical size={13} aria-hidden="true" /><span>Demo mode · fictional data</span></span>
      </header>

      <main>
        <section className="lp-hero" aria-labelledby="lp-title">
          <div className="lp-copy">
            <p className="lp-eyebrow">Intelligent growth &amp; nutrition monitoring</p>
            <h1 id="lp-title" className="display">Every Child. <em>Every Milestone.</em> Every Day.</h1>
            <p className="lp-sub">A calm, dependable bridge between the Anganwadi worker, the child and the centre: so no measurement is missed and no follow-up is forgotten.</p>
            <div className="lp-entry" role="group" aria-label="Choose how to continue">
              <Link to="/worker-login" className="lp-card">
                <span className="lp-card-icon"><ClipboardList size={22} aria-hidden="true" /></span>
                <span className="lp-card-text"><b>Worker workspace</b><small>Record measurements, log meals and see who needs you today.</small></span>
                <ArrowRight size={18} className="lp-arrow" aria-hidden="true" />
              </Link>
              <Link to="/admin-login" className="lp-card alt">
                <span className="lp-card-icon"><ShieldCheck size={22} aria-hidden="true" /></span>
                <span className="lp-card-text"><b>Admin command centre</b><small>Compare centres, review coverage and generate reports.</small></span>
                <ArrowRight size={18} className="lp-arrow" aria-hidden="true" />
              </Link>
            </div>
            <p className="caption">A monitoring support tool, not a diagnostic system.</p>
          </div>
          <div className="lp-visual"><GrowthIllustration /></div>
        </section>

        <section className="lp-mission" aria-label="Our mission">
          <blockquote>
            <p>Behind every measurement is a child, and behind every child is a family hoping they're growing well. <em>ANGANSETU</em> gives the people who care for them the clarity to act early.</p>
          </blockquote>
        </section>

        <section className="lp-steps" aria-labelledby="lp-how">
          <h2 id="lp-how" className="lp-h2">How ANGANSETU works</h2>
          <ol className="lp-step-grid">
            {STEPS.map((s, i) => (
              <li key={s.title} className="lp-step" style={{ "--i": i }}>
                <span className="lp-step-icon"><s.icon size={20} aria-hidden="true" /></span>
                <b>{s.title}</b><p>{s.text}</p>
              </li>))}
          </ol>
        </section>
      </main>

      <footer className="lp-foot"><span>ANGANSETU · Every Child. Every Milestone. Every Day.</span><span>Demonstration build with fictional data.</span></footer>
    </div>
  );
}
