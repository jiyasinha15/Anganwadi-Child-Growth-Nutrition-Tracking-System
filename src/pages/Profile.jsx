import { FlaskConical } from "lucide-react";
import { PageHeader, ChildAvatar, SectionHeader } from "../components/ui";
import { useSession } from "../lib/session";
import { centres, workers } from "../data/seed";
import { fmtDate, TODAY } from "../lib/dates";

export default function Profile() {
  const session = useSession();
  const admin = session?.role === "admin";
  const me = workers.find((w) => w.name === session?.name);
  const centre = centres.find((c) => c.id === session?.centreId) ?? centres[0];
  return (
    <div className="page narrow">
      <PageHeader title="My profile" subtitle="Your demo account details" />
      <section className="card">
        <div className="status-line"><ChildAvatar name={session?.name ?? "User"} size={56} /><div><h2>{session?.name}</h2><p className="muted">{admin ? "District administrator" : me?.role ?? "Anganwadi Worker"}</p></div></div>
        <dl className="facts">
          <div><dt>Role</dt><dd>{admin ? "Administrator" : "Worker"}</dd></div>
          <div><dt>Centre</dt><dd>{admin ? "All centres" : centre.name}</dd></div>
          {!admin && <div><dt>Location</dt><dd>{centre.location}</dd></div>}
          <div><dt>Demo date</dt><dd>{fmtDate(TODAY)}</dd></div>
        </dl>
      </section>
      <section className="card"><SectionHeader title="Demo mode" /><p className="muted"><FlaskConical size={15} aria-hidden="true" style={{ verticalAlign: "-2px" }} /> This account and its data are fictional and exist for demonstration only.</p></section>
    </div>
  );
}
