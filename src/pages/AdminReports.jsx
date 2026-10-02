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

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>
          <h1>Admin Reports</h1>

          <p>
            System-level reports and monitoring overview
          </p>
        </div>

      </div>


      {/* SUMMARY */}

      <div className="stats-grid">

        {/* TOTAL CENTRES */}

        <div className="admin-stat">

          <div className="stat-icon">
            <Building2 size={22} />
          </div>

          <div className="stat-content">

            <span>Total Centres</span>

            <strong>3</strong>

          </div>

        </div>


        {/* TOTAL WORKERS */}

        <div className="admin-stat">

          <div className="stat-icon">
            <Users size={22} />
          </div>

          <div className="stat-content">

            <span>Total Workers</span>

            <strong>2</strong>

          </div>

        </div>


        {/* TOTAL CHILDREN */}

        <div className="admin-stat">

          <div className="stat-icon">
            <Baby size={22} />
          </div>

          <div className="stat-content">

            <span>Total Children</span>

            <strong>3</strong>

          </div>

        </div>


        {/* GROWTH RECORDS */}

        <div className="admin-stat">

          <div className="stat-icon">
            <Activity size={22} />
          </div>

          <div className="stat-content">

            <span>Growth Records</span>

            <strong>11</strong>

          </div>

        </div>

      </div>


      {/* SYSTEM OVERVIEW */}

      <div className="dashboard-card admin-overview-card">

        <div className="card-header">

          <div>

            <h3>System Overview</h3>

            <p>
              Current records across the Anganwadi system
            </p>

          </div>

          <div className="overview-icon">
            <BarChart3 size={22} />
          </div>

        </div>


        <div className="admin-report-grid">

          {/* CENTRE 01 */}

          <div className="report-centre">

            <div className="report-centre-name">
              Centre 01
            </div>

            <div className="report-centre-value">
              <strong>2</strong>

              <span>Children</span>
            </div>

          </div>


          {/* CENTRE 02 */}

          <div className="report-centre">

            <div className="report-centre-name">
              Centre 02
            </div>

            <div className="report-centre-value">
              <strong>1</strong>

              <span>Child</span>
            </div>

          </div>


          {/* CENTRE 03 */}

          <div className="report-centre">

            <div className="report-centre-name">
              Centre 03
            </div>

            <div className="report-centre-value">
              <strong>0</strong>

              <span>Children</span>
            </div>

          </div>

        </div>

      </div>


      {/* INFORMATION */}

      <div className="info-note">

        Reports provide an administrative overview of
        centres, workers, children and recorded growth data.

      </div>

    </div>
  );
}