import { useState } from "react";
import { FlaskConical, RotateCcw, ShieldCheck } from "lucide-react";
import { PageHeader, SectionHeader, ConfirmDialog, useToast } from "../components/ui";
import { useStore, resetDemoData } from "../services/store";
import { TODAY, fmtDate } from "../lib/dates";

// Read-only system information. There are no configurable settings in this demo, so none are shown.
export default function AdminSettings() {
  const s = useStore();
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="page">
      <PageHeader title="Demo & system" subtitle="About the data in this environment" />
      <section className="card">
        <SectionHeader title="Demo mode" />
        <div className="demo-box"><FlaskConical size={18} aria-hidden="true" /><div><b>This environment uses fictional data for demonstration purposes.</b>
          <p>Names, guardians, centres and measurements are invented. The data is identical every time you start, and the demo date is fixed at {fmtDate(TODAY)}.</p></div></div>
      </section>
      <section className="card">
        <SectionHeader title="Data in this browser" description="Changes you make are stored locally and never leave this device." />
        <dl className="facts cols">
          <div><dt>Children</dt><dd>{s.children.length}</dd></div>
          <div><dt>Measurements</dt><dd>{s.children.reduce((n, c) => n + c.measurements.length, 0)}</dd></div>
          <div><dt>Nutrition records</dt><dd>{s.nutrition.length}</dd></div>
          <div><dt>Follow-ups</dt><dd>{s.followups.length}</dd></div>
        </dl>
        <button className="btn btn-secondary" onClick={() => setConfirm(true)}><RotateCcw size={16} />Reset demo data</button>
      </section>
      <section className="card"><SectionHeader title="Use of this tool" /><p className="muted"><ShieldCheck size={15} aria-hidden="true" style={{ verticalAlign: "-2px" }} /> ANGANSETU supports monitoring and follow-up. It does not provide medical diagnosis.</p></section>
      <ConfirmDialog open={confirm} onClose={() => setConfirm(false)} tone="danger" title="Reset demo data?" confirmLabel="Reset data"
        message="This removes anything you added and restores the original demo set." onConfirm={() => { resetDemoData(); toast.success("Demo data reset"); }} />
    </div>
  );
}
