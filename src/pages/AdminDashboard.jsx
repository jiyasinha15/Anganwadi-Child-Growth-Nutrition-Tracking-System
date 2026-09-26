import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  Database,
  BarChart3,
  Plus,
  ArrowRight
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">

      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Manage Anganwadi centres, workers and system records
          </p>
        </div>

        <button
          className="primary"
          onClick={() => navigate("/admin/centres")}
        >
          <Plus size={18} />
          Add Centre
        </button>
      </div>


      {/* SUMMARY */}
      <div className="stats-grid">

        <div className="admin-stat">
          <div className="stat-icon">
            <Building2 size={22} />
          </div>

          <div>
            <span>Anganwadi Centres</span>
            <strong>3</strong>
          </div>
        </div>


        <div className="admin-stat">
          <div className="stat-icon">
            <Users size={22} />
          </div>

          <div>
            <span>Registered Workers</span>
            <strong>2</strong>
          </div>
        </div>


        <div className="admin-stat">
          <div className="stat-icon">
            <Database size={22} />
          </div>

          <div>
            <span>System Records</span>
            <strong>Active</strong>
          </div>
        </div>


        <div className="admin-stat">
          <div className="stat-icon">
            <BarChart3 size={22} />
          </div>

          <div>
            <span>Reports</span>
            <strong>Available</strong>
          </div>
        </div>

      </div>


      {/* MANAGEMENT */}
      <div className="admin-management-grid">

        <div className="dashboard-card admin-management-card">

          <div className="action-icon">
            <Building2 size={24} />
          </div>

          <div>
            <h3>Anganwadi Centres</h3>

            <p>
              Add, view and manage registered
              Anganwadi centres.
            </p>
          </div>

          <button
            className="secondary"
            onClick={() => navigate("/admin/centres")}
          >
            Manage
            <ArrowRight size={16} />
          </button>

        </div>


        <div className="dashboard-card admin-management-card">

          <div className="action-icon">
            <Users size={24} />
          </div>

          <div>
            <h3>Manage Workers</h3>

            <p>
              Manage Anganwadi worker accounts
              and centre assignments.
            </p>
          </div>

          <button
            className="secondary"
            onClick={() => navigate("/admin/workers")}
          >
            Manage
            <ArrowRight size={16} />
          </button>

        </div>


        <div className="dashboard-card admin-management-card">

          <div className="action-icon">
            <BarChart3 size={24} />
          </div>

          <div>
            <h3>Reports & Analytics</h3>

            <p>
              View system-level growth and
              monitoring reports.
            </p>
          </div>

          <button
            className="secondary"
            onClick={() => navigate("/admin/reports")}
          >
            View
            <ArrowRight size={16} />
          </button>

        </div>


        <div className="dashboard-card admin-management-card">

          <div className="action-icon">
            <Database size={24} />
          </div>

          <div>
            <h3>System Records</h3>

            <p>
              Monitor the overall application
              record status.
            </p>
          </div>

          <button
            className="secondary"
            onClick={() => navigate("/admin/settings")}
          >
            Open
            <ArrowRight size={16} />
          </button>

        </div>

      </div>


      <div className="info-note">
        Admin access is intended for managing centres,
        workers, system records and administrative reports.
      </div>

    </div>
  );
}