import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Baby } from "lucide-react";
import { PageHeader, EmptyState } from "../components/ui";
import { MeasurementForm } from "../components/forms/forms";
import { useStore } from "../services/store";
import { getChild } from "../services/childrenService";

// Dedicated-page version of the record-measurement workflow (also reachable as a dialog from anywhere).
export default function AddMeasurement() {
  const { id } = useParams();
  const state = useStore();
  const navigate = useNavigate();
  const child = getChild(id, state);
  if (!child) return <div className="page"><section className="card"><EmptyState icon={Baby} title="Child not found" message="This record doesn't exist." action="Back to children" onAction={() => navigate("/children")} /></section></div>;
  return (
    <div className="page narrow">
      <PageHeader back={<Link to={`/children/${id}`} className="back-link"><ArrowLeft size={15} />{child.name}</Link>} title="Record measurement" subtitle={`Add a new height and weight for ${child.name}.`} />
      <section className="card"><MeasurementForm childId={id} onDone={() => navigate(`/children/${id}`)} onCancel={() => navigate(`/children/${id}`)} /></section>
    </div>
  );
}
