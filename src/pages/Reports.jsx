import React from "react";

import {
  BarChart3,
  Users,
  Activity,
  TrendingUp
} from "lucide-react";

import {
  children,
  getLatestMeasurement,
  getLatestBMI
} from "../data";

export default function Reports() {
  const totalChildren = children.length;

  const totalMeasurements = children.reduce(
    (total, child) => total + child.measurements.length,
    0
  );

  const averageHeight =
    totalChildren > 0
      ? children.reduce((total, child) => {
          const latest = getLatestMeasurement(child);
          return total + (latest?.height || 0);
        }, 0) / totalChildren
      : 0;

  const averageWeight =
    totalChildren > 0
      ? children.reduce((total, child) => {
          const latest = getLatestMeasurement(child);
          return total + (latest?.weight || 0);
        }, 0) / totalChildren
      : 0;

  const chartData = children.map((child) => {
    const latest = getLatestMeasurement(child);

    return {
      name: child.name.split(" ")[0],
      fullName: child.name,
      height: latest?.height || 0,
      weight: latest?.weight || 0,
      bmi: getLatestBMI(child) || 0
    };
  });

  const maxHeight = Math.max(...chartData.map((item) => item.height), 1);
  const maxWeight = Math.max(...chartData.map((item) => item.weight), 1);
  const maxBMI = Math.max(...chartData.map((item) => item.bmi), 1);

  const getBarHeight = (value, max) => {
    return `${Math.max((value / max) * 100, 4)}%`;
  };

  return (
    <div className="reports-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Reports & Analytics</h1>
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
            <span>Total Children</span>
            <strong>{totalChildren}</strong>
          </div>
        </div>

        <div className="report-stat">
          <div className="stat-icon">
            <Activity size={22} />
          </div>

          <div>
            <span>Total Measurements</span>
            <strong>{totalMeasurements}</strong>
          </div>
        </div>

        <div className="report-stat">
          <div className="stat-icon">
            <TrendingUp size={22} />
          </div>

          <div>
            <span>Average Height</span>
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
            <span>Average Weight</span>
            <strong>
              {averageWeight.toFixed(1)} kg
            </strong>
          </div>
        </div>

      </div>

      {/* HEIGHT CHART */}
      <div className="dashboard-card report-chart-card">

        <div className="card-header">
          <div>
            <h3>Height Overview</h3>
            <p>
              Latest recorded height of each child
            </p>
          </div>
        </div>

        <div className="simple-chart">

          <div className="y-labels">
            <span>{Math.ceil(maxHeight)} cm</span>
            <span>{Math.ceil(maxHeight * 0.75)} cm</span>
            <span>{Math.ceil(maxHeight * 0.5)} cm</span>
            <span>{Math.ceil(maxHeight * 0.25)} cm</span>
            <span>0</span>
          </div>

          <div className="bar-area">

            <div className="grid-line line-1"></div>
            <div className="grid-line line-2"></div>
            <div className="grid-line line-3"></div>
            <div className="grid-line line-4"></div>

            <div className="bars">

              {chartData.map((item) => (
                <div
                  className="bar-column"
                  key={item.fullName}
                >
                  <span className="bar-value">
                    {item.height} cm
                  </span>

                  <div
                    className="bar height-bar"
                    style={{
                      height: getBarHeight(
                        item.height,
                        maxHeight
                      )
                    }}
                  ></div>

                  <span className="bar-name">
                    {item.name}
                  </span>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>

      {/* WEIGHT CHART */}
      <div className="dashboard-card report-chart-card">

        <div className="card-header">
          <div>
            <h3>Weight Overview</h3>
            <p>
              Latest recorded weight of each child
            </p>
          </div>
        </div>

        <div className="simple-chart">

          <div className="y-labels">
            <span>{maxWeight.toFixed(1)} kg</span>
            <span>{(maxWeight * 0.75).toFixed(1)}</span>
            <span>{(maxWeight * 0.5).toFixed(1)}</span>
            <span>{(maxWeight * 0.25).toFixed(1)}</span>
            <span>0</span>
          </div>

          <div className="bar-area">

            <div className="grid-line line-1"></div>
            <div className="grid-line line-2"></div>
            <div className="grid-line line-3"></div>
            <div className="grid-line line-4"></div>

            <div className="bars">

              {chartData.map((item) => (
                <div
                  className="bar-column"
                  key={item.fullName}
                >
                  <span className="bar-value">
                    {item.weight} kg
                  </span>

                  <div
                    className="bar weight-bar"
                    style={{
                      height: getBarHeight(
                        item.weight,
                        maxWeight
                      )
                    }}
                  ></div>

                  <span className="bar-name">
                    {item.name}
                  </span>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>

      {/* BMI CHART */}
      <div className="dashboard-card report-chart-card">

        <div className="card-header">
          <div>
            <h3>BMI Overview</h3>
            <p>
              Latest calculated BMI of each child
            </p>
          </div>
        </div>

        <div className="simple-chart">

          <div className="y-labels">
            <span>{maxBMI.toFixed(1)}</span>
            <span>{(maxBMI * 0.75).toFixed(1)}</span>
            <span>{(maxBMI * 0.5).toFixed(1)}</span>
            <span>{(maxBMI * 0.25).toFixed(1)}</span>
            <span>0</span>
          </div>

          <div className="bar-area">

            <div className="grid-line line-1"></div>
            <div className="grid-line line-2"></div>
            <div className="grid-line line-3"></div>
            <div className="grid-line line-4"></div>

            <div className="bars">

              {chartData.map((item) => (
                <div
                  className="bar-column"
                  key={item.fullName}
                >
                  <span className="bar-value">
                    {item.bmi}
                  </span>

                  <div
                    className="bar bmi-bar"
                    style={{
                      height: getBarHeight(
                        item.bmi,
                        maxBMI
                      )
                    }}
                  ></div>

                  <span className="bar-name">
                    {item.name}
                  </span>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>

      {/* BMI TABLE */}
      <div className="dashboard-card">

        <div className="card-header">
          <div>
            <h3>BMI Records</h3>
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