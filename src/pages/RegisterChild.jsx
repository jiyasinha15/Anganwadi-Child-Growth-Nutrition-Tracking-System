import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "../components/ui";
import { RegisterForm } from "../components/forms/forms";

export default function RegisterChild() {
  const navigate = useNavigate();
  return (
    <div className="page narrow">
      <PageHeader back={<Link to="/children" className="back-link"><ArrowLeft size={15} />Children</Link>} title="Add child" subtitle="Register a child and, optionally, their first measurement." />
      <RegisterForm onDone={(c) => navigate(`/children/${c.id}`)} onCancel={() => navigate("/children")} />
    </div>
  );
}
