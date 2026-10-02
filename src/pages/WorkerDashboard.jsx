import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  Activity,
  Apple,
  ClipboardCheck,
  Plus,
  BarChart3,
  Baby
} from "lucide-react";

import {
  children,
  getLatestMeasurement,
  getLatestBMI
} from "../data";

import StatCard from "../components/StatCard";

export default function WorkerDashboard() {
  const navigate = useNavigate();

  const totalChildren = children.length;

  const totalMeasurements = children.reduce(
    (total, child) =>
      total + child.measurements.length,
    0
  );

  return (
    <div className="worker-dashboard">

      {/* PAGE HEADER */}
      <div className="dashboard-header">

        <div>
          <h1>Worker Dashboard</h1>

          <p>
            Welcome to Anganwadi Worker Portal
          </p>
        </div>

        <button
          className="dashboard-primary"
          onClick={() => navigate("/children/new")}
        >
          <Plus size={18} />
          Register Child
        </button>

      </div>


      {/* STAT CARDS */}
      <div className="dashboard-stats">

        <StatCard
          icon={<Users size={22} />}
          label="Total Children"
          value={totalChildren}
          sub="Registered children"
        />

        <StatCard
          icon={<Activity size={22} />}
          label="Measurements"
          value={totalMeasurements}
          sub="Growth records"
        />

        <StatCard
          icon={<Apple size={22} />}
          label="Nutrition"
          value={totalChildren}
          sub="Children records"
        />

        <StatCard
          icon={<ClipboardCheck size={22} />}
          label="Follow-ups"
          value={totalChildren}
          sub="Monitoring records"
        />

      </div>


      {/* QUICK ACTIONS */}
      <div className="worker-card">

        <div className="worker-card-header">

          <div>
            <h3>Quick Actions</h3>

            <p>
              Manage child records quickly
            </p>
          </div>

        </div>


        <div className="worker-quick-actions">

          <button
            onClick={() => navigate("/children/new")}
          >
            <Baby size={21} />
            <span>Register Child</span>
          </button>


          <button
            onClick={() => navigate("/growth")}
          >
            <Activity size={21} />
            <span>Growth Monitoring</span>
          </button>


          <button
            onClick={() => navigate("/nutrition")}
          >
            <Apple size={21} />
            <span>Nutrition</span>
          </button>


          <button
            onClick={() => navigate("/followups")}
          >
            <ClipboardCheck size={21} />
            <span>Follow-ups</span>
          </button>


          <button
            onClick={() => navigate("/reports")}
          >
            <BarChart3 size={21} />
            <span>Reports</span>
          </button>

        </div>

      </div>


      {/* RECENT CHILDREN */}
      <div className="worker-card">

        <div className="worker-card-header">

          <div>
            <h3>Recent Children</h3>

            <p>
              Latest registered child records
            </p>
          </div>

          <button
            className="view-all-btn"
            onClick={() => navigate("/children")}
          >
            View All
          </button>

        </div>


        <div className="worker-children-list">

          {children.map((child) => {

            const latest =
              getLatestMeasurement(child);

            const bmi =
              getLatestBMI(child);

            return (
              <div
                className="worker-child-row"
                key={child.id}
              >

                <div className="worker-child-avatar">
                  {child.name.charAt(0)}
                </div>


                <div className="worker-child-info">

                  <strong>
                    {child.name}
                  </strong>

                  <span>
                    {child.gender}
                    {" • "}
                    {child.center}
                  </span>

                </div>


                <div className="worker-measurement">

                  <span>Height</span>

                  <b>
                    {latest?.height ?? "--"} cm
                  </b>

                </div>


                <div className="worker-measurement">

                  <span>Weight</span>

                  <b>
                    {latest?.weight ?? "--"} kg
                  </b>

                </div>


                <div className="worker-measurement">

                  <span>BMI</span>

                  <b>
                    {bmi ?? "--"}
                  </b>

                </div>

              </div>
            );
          })}

        </div>

      </div>


      {/* INFO */}
      <div className="worker-info-note">

        <span>
          This portal is for child record keeping,
          growth monitoring, nutrition tracking and
          follow-up management.
        </span>

      </div>

    </div>
  );
}