import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, FlaskConical, LogIn } from "lucide-react";
import { Logo } from "../components/shell/AppShell";
import { useToast } from "../components/ui";
import { useSession, signIn } from "../lib/session";
import { readJSON } from "../lib/storage";

const ADMIN = { email: "admin@anganwadi.com", password: "Admin@123", key: "ANGANWADI-ADMIN" };
const DEMO_WORKER = { email: "priya@anganwadi.demo", password: "Worker@123" };

export default function AuthPage({ role }) {
  const isAdmin = role === "admin";
  const navigate = useNavigate();
  const toast = useToast();
  const session = useSession();
  const [f, setF] = useState({ email: "", password: "", key: "" });
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  if (session) return <Navigate to={session.role === "admin" ? "/admin" : "/worker"} replace />;

  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setError(""); };
  const enter = (s) => { signIn(s, remember); toast.success(`Welcome, ${s.name.split(" ")[0]}`, "You're in demo mode."); navigate(isAdmin ? "/admin" : "/worker"); };
  const demo = () => enter(isAdmin ? { role, name: "District Admin" } : { role, name: "Priya Yadav", centreId: "c1" });

  const submit = (e) => {
    e.preventDefault();
    if (isAdmin) {
      if (f.email === ADMIN.email && f.password === ADMIN.password && f.key === ADMIN.key) return enter({ role, name: "District Admin" });
      return setError("Email, password or access key is incorrect. Use the demo details shown below.");
    }
    const users = readJSON("workerUsers", []);
    const hit = f.email === DEMO_WORKER.email && f.password === DEMO_WORKER.password ? { name: "Priya Yadav", centre: "c1" } : users.find((u) => u.email === f.email && u.password === f.password);
    if (!hit) return setError("Email or password is incorrect. Use the demo details shown below.");
    enter({ role, name: hit.name, centreId: /^c\d$/.test(hit.centre) ? hit.centre : "c1" });
  };

  return (
    <div className="auth">
      <aside className="auth-brand">
        <Logo />
        <div><h1 className="display sm">{isAdmin ? "See every centre clearly." : "Know who needs you today."}</h1>
          <p>{isAdmin ? "Coverage, follow-up completion and worker activity across all Anganwadi centres, in one view." : "Your priorities, each child's growth journey and follow-ups, ready when you start the day."}</p></div>
        <small>Track → Understand → Act → Follow up</small>
      </aside>
      <main className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit} noValidate>
          <Link to="/" className="back-link"><ArrowLeft size={16} />Back</Link>
          <h2 className="auth-title">{isAdmin ? "Admin sign in" : "Worker sign in"}</h2>
          <div className="demo-box" role="note"><FlaskConical size={16} aria-hidden="true" />
            <div><b>Demo mode.</b> No real authentication or personal data.
              <code>{isAdmin ? `${ADMIN.email} / ${ADMIN.password} / ${ADMIN.key}` : `${DEMO_WORKER.email} / ${DEMO_WORKER.password}`}</code></div></div>
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="field"><label htmlFor="email">Email</label><input id="email" className="input" type="email" autoComplete="username" value={f.email} onChange={set("email")} required aria-invalid={!!error} /></div>
          <div className="field"><label htmlFor="pw">Password</label>
            <div className="pw-wrap"><input id="pw" className="input" type={show ? "text" : "password"} autoComplete="current-password" value={f.password} onChange={set("password")} required aria-invalid={!!error} />
              <button type="button" className="icon-btn sm" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
          {isAdmin && <div className="field"><label htmlFor="key">Access key</label><input id="key" className="input" value={f.key} onChange={set("key")} required /></div>}
          <label className="check"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />Remember me on this device</label>
          <button className="btn btn-primary" type="submit"><LogIn size={16} />Sign in</button>
          <button className="btn btn-secondary" type="button" onClick={demo}>Continue with demo account</button>
          {!isAdmin && <p className="caption">New worker? <Link to="/worker-register">Request access</Link></p>}
        </form>
      </main>
    </div>
  );
}
