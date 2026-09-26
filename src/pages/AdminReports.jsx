import React from "react";
import {
  Building2,
  Users,
  Baby,
  Activity,
  BarChart3
} from "lucide-react";

export default function AdminReports() {
  return (
    <div className="admin-reports-page">

      <div className="page-header">
        <div>
          <h1>Admin Reports</h1>
          <p>
            System-level reports and monitoring overview
          </p>
        </div>
      </div>


      <div className="stats-grid">

        <div className="admin-stat">
          <div className="stat-icon">
            <Building2 size={22} />
          </div>

          <div>
            <span>Total Centres</span>
            <strong>3</strong>
          </div>
        </div>


        <div className="admin-stat">
          <div className="stat-icon">
            <Users size={22} />
          </div>

          <div>
            <span>Total Workers</span>
            <strong>2</strong>
          </div>
        </div>


        <div className="admin-stat">
          <div className="stat-icon">
            <Baby size={22} />
          </div>

          <div>
            <span>Total Children</span>
            <strong>3</strong>
          </div>
        </div>


        <div className="admin-stat">
          <div className="stat-icon">
            <Activity size={22} />
          </div>

          <div>
            <span>Growth Records</span>
            <strong>11</strong>
          </div>
        </div>

      </div>


      <div className="dashboard-card">

        <div className="card-header">
          <div>
            <h3>System Overview</h3>
            <p>
              Current records across the Anganwadi system
            </p>
          </div>

          <BarChart3 size={22} />

        </div>


        <div className="admin-report-grid">

          <div>
            <span>Centre 01</span>
            <strong>2 Children</strong>
          </div>

          <div>
            <span>Centre 02</span>
            <strong>1 Child</strong>
          </div>

          <div>
            <span>Centre 03</span>
            <strong>0 Children</strong>
          </div>

        </div>

      </div>


      <div className="info-note">
        Reports provide an administrative overview of
        centres, workers, children and recorded growth data.
      </div>

    </div>
  );
}