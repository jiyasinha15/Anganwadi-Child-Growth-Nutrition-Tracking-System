import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  KeyRound
} from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Demo admin credentials
    const ADMIN_EMAIL = "admin@anganwadi.com";
    const ADMIN_PASSWORD = "Admin@123";
    const ADMIN_KEY = "ANGANWADI-ADMIN";

    if (
      email === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD &&
      accessKey === ADMIN_KEY
    ) {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/admin");
    } else {
      setError("Invalid admin credentials or access key.");
    }
  };

  return (
    <div className="role-login-page">

      <button
        className="back-button role-back"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <form className="role-login-card" onSubmit={handleLogin}>

        <div className="role-login-icon admin-icon">
          <ShieldCheck size={32} />
        </div>

        <h1>Admin Login</h1>

        <p>
          Authorized administrators only
        </p>

        <div className="form-group">
          <label>Admin Email</label>

          <div className="login-input">
            <Mail size={17} />

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Password</label>

          <div className="login-input">
            <LockKeyhole size={17} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Admin Access Key</label>

          <div className="login-input">
            <KeyRound size={17} />

            <input
              type="password"
              placeholder="Enter admin access key"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <p
            style={{
              color: "#dc2626",
              fontSize: "13px",
              marginTop: "4px"
            }}
          >
            {error}
          </p>
        )}

        <button type="submit" className="login-button">
          Login as Admin
        </button>

        <small>
          Admin account is created by the system administrator.
          <br />
          Public admin registration is not available.
        </small>

      </form>
    </div>
  );
}