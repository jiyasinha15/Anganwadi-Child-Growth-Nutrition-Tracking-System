import React from "react";
import {
  BarChart3,
  Users,
  Activity,
  TrendingUp
} from "lucide-react";

import {
  BarChart,
  Bar,
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

export default function Reports() {

  const chartData = children.map((child) => {
    const latest = getLatestMeasurement(child);

    return {
      name: child.name.split(" ")[0],
      height: latest?.height || 0,
      weight: latest?.weight || 0,
      bmi: getLatestBMI(child) || 0
    };
  });


  const totalChildren = children.length;


  const totalMeasurements = children.reduce(
    (total, child) =>
      total + child.measurements.length,
    0
  );


  const averageHeight =
    children.reduce((total, child) => {

      const latest =
        getLatestMeasurement(child);

      return total + (latest?.height || 0);

    }, 0) / totalChildren;


  const averageWeight =
    children.reduce((total, child) => {

      const latest =
        getLatestMeasurement(child);

      return total + (latest?.weight || 0);

    }, 0) / totalChildren;


  return (
    <div className="reports-page">

      {/* HEADER */}
      <div className="page-header">

        <div>
          <h1>
            Reports & Analytics
          </h1>

          <p>
            Growth and nutrition monitoring overview
          </p>
        </div>

      </div>


      {/* SUMMARY */}
      <div className="stats-grid">

        <div className="report-stat">

          <div className="stat-icon">
            <Users size={22} />
          </div>

          <div>
            <span>
              Total Children
            </span>

            <strong>
              {totalChildren}
            </strong>
          </div>

        </div>


        <div className="report-stat">

          <div className="stat-icon">
            <Activity size={22} />
          </div>

          <div>
            <span>
              Total Measurements
            </span>

            <strong>
              {totalMeasurements}
            </strong>
          </div>

        </div>


        <div className="report-stat">

          <div className="stat-icon">
            <TrendingUp size={22} />
          </div>

          <div>
            <span>
              Average Height
            </span>

            <strong>
              {averageHeight.toFixed(1)} cm
            </strong>
          </div>

        </div>


        <div className="report-stat">

          <div className="stat-icon">
            <BarChart3 size={22} />
          </div>

          <div>
            <span>
              Average Weight
            </span>

            <strong>
              {averageWeight.toFixed(1)} kg
            </strong>
          </div>

        </div>

      </div>


      {/* HEIGHT CHART */}
      <div className="dashboard-card chart-card">

        <div className="card-header">

          <div>
            <h3>
              Height Overview
            </h3>

            <p>
              Latest recorded height of each child
            </p>
          </div>

        </div>


        <div className="chart-container">

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart data={chartData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="height"
                name="Height (cm)"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* WEIGHT CHART */}
      <div className="dashboard-card chart-card">

        <div className="card-header">

          <div>
            <h3>
              Weight Overview
            </h3>

            <p>
              Latest recorded weight of each child
            </p>
          </div>

        </div>


        <div className="chart-container">

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart data={chartData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="weight"
                name="Weight (kg)"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* BMI CHART */}
      <div className="dashboard-card chart-card">

        <div className="card-header">

          <div>
            <h3>
              BMI Overview
            </h3>

            <p>
              Latest calculated BMI of each child
            </p>
          </div>

        </div>


        <div className="chart-container">

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart data={chartData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="bmi"
                name="BMI"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* BMI TABLE */}
      <div className="dashboard-card">

        <div className="card-header">

          <div>
            <h3>
              BMI Records
            </h3>

            <p>
              Latest calculated BMI for registered children
            </p>
          </div>

        </div>


        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>Child</th>
                <th>Height</th>
                <th>Weight</th>
                <th>BMI</th>
                <th>Last Measurement</th>
              </tr>

            </thead>


            <tbody>

              {children.map((child) => {

                const latest =
                  getLatestMeasurement(child);

                const bmi =
                  getLatestBMI(child);

                return (
                  <tr key={child.id}>

                    <td>
                      <strong>
                        {child.name}
                      </strong>
                    </td>

                    <td>
                      {latest?.height ?? "--"} cm
                    </td>

                    <td>
                      {latest?.weight ?? "--"} kg
                    </td>

                    <td>
                      <span className="bmi-badge">
                        {bmi ?? "--"}
                      </span>
                    </td>

                    <td>
                      {latest?.date ?? "--"}
                    </td>

                  </tr>
                );

              })}

            </tbody>

          </table>

        </div>

      </div>


      {/* INFORMATION */}
      <div className="info-note report-note">

        BMI for children should be interpreted using
        age- and sex-specific BMI-for-age information.
        This dashboard is for record keeping and
        monitoring, not clinical diagnosis.

      </div>

    </div>
  );
}