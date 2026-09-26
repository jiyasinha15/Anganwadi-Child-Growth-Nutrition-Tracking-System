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
import BMICard from "../components/BMICard";

export default function WorkerDashboard() {
  const navigate = useNavigate();

  const totalChildren = children.length;

  const totalMeasurements = children.reduce(
    (total, child) =>
      total + child.measurements.length,
    0
  );

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="page-header">

        <div>
          <h1>
            Worker Dashboard
          </h1>

          <p>
            Welcome to Anganwadi Worker Portal
          </p>
        </div>

        <button
          className="primary"
          onClick={() =>
            navigate("/children/new")
          }
        >
          <Plus size={18} />
          Register Child
        </button>

      </div>


      {/* STATS */}
      <div className="stats-grid">

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
      <div className="dashboard-card">

        <div className="card-header">

          <div>
            <h3>
              Quick Actions
            </h3>

            <p>
              Manage child records quickly
            </p>
          </div>

        </div>


        <div className="quick-actions">

          <button
            onClick={() =>
              navigate("/children/new")
            }
          >
            <Baby size={22} />
            <span>
              Register Child
            </span>
          </button>


          <button
            onClick={() =>
              navigate("/growth")
            }
          >
            <Activity size={22} />
            <span>
              Growth Monitoring
            </span>
          </button>


          <button
            onClick={() =>
              navigate("/nutrition")
            }
          >
            <Apple size={22} />
            <span>
              Nutrition
            </span>
          </button>


          <button
            onClick={() =>
              navigate("/followups")
            }
          >
            <ClipboardCheck size={22} />
            <span>
              Follow-ups
            </span>
          </button>


          <button
            onClick={() =>
              navigate("/reports")
            }
          >
            <BarChart3 size={22} />
            <span>
              Reports
            </span>
          </button>

        </div>

      </div>


      {/* CHILDREN */}
      <div className="dashboard-card">

        <div className="card-header">

          <div>
            <h3>
              Recent Children
            </h3>

            <p>
              Latest registered child records
            </p>
          </div>

          <button
            className="secondary"
            onClick={() =>
              navigate("/children")
            }
          >
            View All
          </button>

        </div>


        <div className="children-list">

          {children.map((child) => {

            const latest =
              getLatestMeasurement(child);

            const bmi =
              getLatestBMI(child);

            return (
              <div
                className="child-row"
                key={child.id}
              >

                <div className="child-avatar">
                  {child.name.charAt(0)}
                </div>

                <div className="child-info">

                  <strong>
                    {child.name}
                  </strong>

                  <span>
                    {child.gender} • {child.center}
                  </span>

                </div>

                <div className="child-measurement">

                  <span>
                    Height
                  </span>

                  <b>
                    {latest?.height ?? "--"} cm
                  </b>

                </div>

                <div className="child-measurement">

                  <span>
                    Weight
                  </span>

                  <b>
                    {latest?.weight ?? "--"} kg
                  </b>

                </div>

                <div className="child-measurement">

                  <span>
                    BMI
                  </span>

                  <b>
                    {bmi ?? "--"}
                  </b>

                </div>

              </div>
            );

          })}

        </div>

      </div>


      {/* INFORMATION */}
      <div className="info-note">

        This portal is for child record keeping,
        growth monitoring, nutrition tracking and
        follow-up management.

      </div>

    </div>
  );
}