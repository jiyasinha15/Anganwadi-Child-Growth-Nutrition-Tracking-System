import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  Baby,
  Activity,
  Apple,
  BarChart3
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // Demo login
    navigate("/");
  };

  return (
    <div className="login-page">

      {/* LEFT SECTION */}
      <div className="login-left">

        <div className="login-logo">
          🌿
        </div>

        <h1>
          Anganwadi
        </h1>

        <h2>
          Child Growth & Nutrition
          <br />
          Tracking System
        </h2>

        <p>
          Digital child records, growth monitoring,
          nutrition tracking and follow-up management.
        </p>


        <div className="login-features">

          <div>
            <Baby size={17} />
            Child Profiles
          </div>

          <div>
            <Activity size={17} />
            Growth Monitoring
          </div>

          <div>
            <Apple size={17} />
            Nutrition Tracking
          </div>

          <div>
            <BarChart3 size={17} />
            Growth Analytics
          </div>

        </div>

      </div>


      {/* RIGHT SECTION */}
      <div className="login-right">

        <form
          className="login-card"
          onSubmit={handleLogin}
        >

          <h2>
            Welcome Back
          </h2>

          <p>
            Login to your Anganwadi dashboard
          </p>


          {/* EMAIL */}
          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <div className="login-input">

              <Mail size={17} />

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

          </div>


          {/* PASSWORD */}
          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="login-input">

              <LockKeyhole size={17} />

              <input
                id="password"
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
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
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


          {/* LOGIN */}
          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>


          <small>
            Demo login — backend authentication
            will be connected later.
          </small>

        </form>

      </div>

    </div>
  );
}