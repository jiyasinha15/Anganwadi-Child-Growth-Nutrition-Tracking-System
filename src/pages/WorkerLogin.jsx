import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff
} from "lucide-react";

export default function WorkerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const workers = JSON.parse(
      localStorage.getItem("workerUsers") || "[]"
    );

    const worker = workers.find(
      (user) =>
        user.email === email &&
        user.password === password
    );

    if (!worker) {
      setError("Invalid email or password.");
      return;
    }

    localStorage.setItem("workerLoggedIn", "true");
    localStorage.setItem(
      "loggedInWorker",
      JSON.stringify(worker)
    );

    navigate("/worker");
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

        <div className="role-login-icon worker-icon">
          <UserRound size={32} />
        </div>

        <h1>Anganwadi Worker Login</h1>

        <p>
          Login to manage child growth and nutrition records
        </p>

        <div className="form-group">
          <label>Worker Email</label>

          <div className="login-input">
            <Mail size={17} />

            <input
              type="email"
              placeholder="Enter worker email"
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
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
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
          Login as Worker
        </button>

        <div
          style={{
            marginTop: "14px",
            textAlign: "center"
          }}
        >
          <span style={{ fontSize: "13px" }}>
            New Anganwadi Worker?
          </span>

          <button
            type="button"
            onClick={() => navigate("/worker-register")}
            style={{
              border: "none",
              background: "none",
              color: "#15803d",
              fontWeight: "600",
              cursor: "pointer",
              marginLeft: "5px"
            }}
          >
            Register here
          </button>
        </div>

      </form>
    </div>
  );
}