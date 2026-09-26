import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  UserRound,
  ArrowRight
} from "lucide-react";

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="role-page">

      <div className="role-container">

        {/* LOGO */}
        <div className="role-logo">
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

        <p className="role-subtitle">
          Select your login type to continue
        </p>


        {/* LOGIN OPTIONS */}
        <div className="role-cards">

          {/* ADMIN */}
          <button
            className="role-card admin-role"
            onClick={() =>
              navigate("/admin-login")
            }
          >

            <div className="role-icon">
              <ShieldCheck size={30} />
            </div>

            <div className="role-content">
              <h3>
                Admin Login
              </h3>

              <p>
                Manage Anganwadi centres,
                workers and system records.
              </p>
            </div>

            <ArrowRight size={20} />

          </button>


          {/* WORKER */}
          <button
            className="role-card worker-role"
            onClick={() =>
              navigate("/worker-login")
            }
          >

            <div className="role-icon">
              <UserRound size={30} />
            </div>

            <div className="role-content">
              <h3>
                Anganwadi Worker Login
              </h3>

              <p>
                Manage children, growth,
                nutrition and follow-ups.
              </p>
            </div>

            <ArrowRight size={20} />

          </button>

        </div>


        <small className="role-footer">
          Child Growth & Nutrition Tracking System
        </small>

      </div>

    </div>
  );
}