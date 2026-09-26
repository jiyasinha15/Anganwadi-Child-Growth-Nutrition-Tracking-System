import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  Activity,
  ClipboardCheck,
  TrendingUp,
  Plus,
  ArrowRight,
  Baby,
  Apple,
  BarChart3
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import {
  children,
  getLatestMeasurement,
  getLatestBMI
} from "../data";

import StatCard from "../components/StatCard";
import BMICard from "../components/BMICard";

export default function Dashboard() {
  const navigate = useNavigate();

  const totalChildren = children.length;

  const totalMeasurements = children.reduce(
    (total, child) =>
      total + child.measurements.length,
    0
  );

  const followUps = children.length;

  const growthData =
    children[0]?.measurements.map((item) => ({
      date: item.date,
      height: item.height,
      weight: item.weight
    })) || [];

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="page-header">

        <div>
          <h1>
            Dashboard
          </h1>

          <p>
            Overview of child growth and nutrition records
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


      {/* STAT CARDS */}
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
          icon={<ClipboardCheck size={22} />}
          label="Follow-ups"
          value={followUps}
          sub="Records to monitor"
        />

        <StatCard
          icon={<TrendingUp size={22} />}
          label="Growth Tracking"
          value="Active"
          sub="Monitoring enabled"
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
              Frequently used actions
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
            <TrendingUp size={22} />

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
              Nutrition Record
            </span>
          </button>


          <button
            onClick={() =>
              navigate("/reports")
            }
          >
            <BarChart3 size={22} />

            <span>
              View Reports
            </span>
          </button>

        </div>

      </div>


      {/* MAIN GRID */}
      <div className="dashboard-grid">

        {/* RECENT CHILDREN */}
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
              <ArrowRight size={16} />
            </button>

          </div>


          <div className="children-list">

            {children.map((child) => {

              const latest =
                getLatestMeasurement(child);

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

                </div>
              );

            })}

          </div>

        </div>


        {/* BMI OVERVIEW */}
        <div>

          <h3 className="section-title">
            BMI Overview
          </h3>

          {children
            .slice(0, 2)
            .map((child) => {

              const latest =
                getLatestMeasurement(child);

              const bmi =
                getLatestBMI(child);

              return (
                <BMICard
                  key={child.id}
                  bmi={bmi}
                  height={latest?.height}
                  weight={latest?.weight}
                />
              );

            })}

        </div>

      </div>


      {/* GROWTH TREND */}
      <div className="dashboard-card chart-card">

        <div className="card-header">

          <div>
            <h3>
              Growth Trend
            </h3>

            <p>
              Height and weight history
              of the first registered child
            </p>
          </div>

        </div>


        <div className="chart-container">

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <LineChart
              data={growthData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="date"
              />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="height"
                name="Height (cm)"
              />

              <Line
                type="monotone"
                dataKey="weight"
                name="Weight (kg)"
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* MONITORING SUMMARY */}
      <div className="dashboard-card">

        <div className="card-header">

          <div>
            <h3>
              Growth Monitoring
            </h3>

            <p>
              Current system monitoring summary
            </p>
          </div>

        </div>


        <div className="monitoring-info">

          <div>
            <strong>
              {totalChildren}
            </strong>

            <span>
              Children monitored
            </span>
          </div>


          <div>
            <strong>
              {totalMeasurements}
            </strong>

            <span>
              Total measurements
            </span>
          </div>


          <div>
            <strong>
              Monthly
            </strong>

            <span>
              Recommended monitoring
            </span>
          </div>

        </div>

      </div>


      {/* INFORMATION */}
      <div className="info-note">
        The dashboard is intended for digital record
        keeping, growth monitoring, nutrition tracking
        and follow-up management.
      </div>

    </div>
  );
}