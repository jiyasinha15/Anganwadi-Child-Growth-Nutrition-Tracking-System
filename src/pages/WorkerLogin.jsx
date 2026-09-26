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

  const handleLogin = (e) => {
    e.preventDefault();

    // Demo worker login
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

      <form
        className="role-login-card"
        onSubmit={handleLogin}
      >

        <div className="role-login-icon worker-icon">
          <UserRound size={32} />
        </div>

        <h1>
          Anganwadi Worker Login
        </h1>

        <p>
          Login to manage child growth and nutrition records
        </p>


        <div className="form-group">

          <label>
            Worker Email
          </label>

          <div className="login-input">

            <Mail size={17} />

            <input
              type="email"
              placeholder="Enter worker email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

        </div>


        <div className="form-group">

          <label>
            Password
          </label>

          <div className="login-input">

            <LockKeyhole size={17} />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
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


        <button
          type="submit"
          className="login-button"
        >
          Login as Worker
        </button>


        <small>
          Demo login — backend authentication
          will be connected later.
        </small>

      </form>

    </div>
  );
}