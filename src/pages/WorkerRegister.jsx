import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { Logo } from "../components/shell/AppShell";
import { Field, SubmitButton, useToast } from "../components/ui";
import { centres } from "../data/seed";
import { readJSON, writeJSON } from "../lib/storage";

const EMPTY = { name: "", email: "", phone: "", centre: "c1", password: "", confirm: "" };

function validate(f, existing) {
  const e = {};
  if (!f.name.trim()) e.name = "Enter your full name.";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address.";
  else if (existing.some((u) => u.email === f.email)) e.email = "An account with this email already exists on this device.";
  if (!/^\d{10}$/.test(f.phone.replace(/\s/g, ""))) e.phone = "Enter a 10-digit phone number.";
  if (f.password.length < 8) e.password = "Use at least 8 characters.";
  if (f.confirm !== f.password) e.confirm = "Passwords do not match.";
  return e;
}

// Demo-only: creates a local account in this browser so a reviewer can try the worker sign-in. Not real authentication.
export default function WorkerRegister() {
  const navigate = useNavigate();
  const toast = useToast();
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setErrors({ ...errors, [k]: undefined }); };

  const submit = (e) => {
    e.preventDefault();
    const users = readJSON("workerUsers", []);
    const found = validate(f, users);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    setTimeout(() => {
      writeJSON("workerUsers", [...users, { id: `u${users.length + 1}`, name: f.name.trim(), email: f.email, phone: f.phone, centre: f.centre, password: f.password }]);
      toast.success("Demo account created", "You can sign in now. The account stays on this device.");
      navigate("/worker-login");
    }, 250);
  };

  return (
    <div className="auth">
      <aside className="auth-brand">
        <Logo />
        <div><h1 className="display sm">Join your centre's team.</h1><p>Create a demo worker account to try ANGANSETU with fictional data.</p></div>
        <small>Every Child. Every Milestone. Every Day.</small>
      </aside>
      <main className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit} noValidate>
          <Link to="/worker-login" className="back-link"><ArrowLeft size={16} />Back to sign in</Link>
          <h2 className="auth-title">Create worker account</h2>
          <div className="demo-box" role="note"><FlaskConical size={16} aria-hidden="true" /><div><b>Demo mode.</b> This account is stored in this browser only. Don't use a real password.</div></div>
          <Field label="Full name" required error={errors.name}><input className="input" autoComplete="name" value={f.name} onChange={set("name")} /></Field>
          <Field label="Email" required error={errors.email}><input className="input" type="email" autoComplete="email" value={f.email} onChange={set("email")} /></Field>
          <Field label="Phone number" required error={errors.phone} hint="10 digits."><input className="input" type="tel" inputMode="numeric" autoComplete="tel" value={f.phone} onChange={set("phone")} /></Field>
          <Field label="Anganwadi centre" required><select className="input" value={f.centre} onChange={set("centre")}>{centres.filter((c) => c.status === "Active").map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
          <Field label="Password" required error={errors.password}><input className="input" type="password" autoComplete="new-password" value={f.password} onChange={set("password")} /></Field>
          <Field label="Confirm password" required error={errors.confirm}><input className="input" type="password" autoComplete="new-password" value={f.confirm} onChange={set("confirm")} /></Field>
          <SubmitButton saving={saving}>Create demo account</SubmitButton>
        </form>
      </main>
    </div>
  );
}
