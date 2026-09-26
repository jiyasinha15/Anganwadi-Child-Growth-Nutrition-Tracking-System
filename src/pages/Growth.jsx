import React, { useState } from "react";
import { Search, TrendingUp, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  children,
  calculateBMI,
  getLatestMeasurement
} from "../data";

export default function Growth() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const filteredChildren = children.filter((child) => {
    const text = `
      ${child.name}
      ${child.guardian}
      ${child.center}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const totalMeasurements = children.reduce(
    (total, child) =>
      total + child.measurements.length,
    0
  );

  return (
    <div className="growth-page">

      {/* HEADER */}
      <div className="page-header">

        <div>
          <h1>
            Growth Monitoring
          </h1>

          <p>
            Track height, weight and BMI history of children
          </p>
        </div>

      </div>


      {/* SUMMARY */}
      <div className="stats-grid">

        <div className="report-stat">

          <div className="stat-icon">
            <TrendingUp size={22} />
          </div>

          <div>
            <span>
              Children Monitored
            </span>

            <strong>
              {children.length}
            </strong>
          </div>

        </div>


        <div className="report-stat">

          <div className="stat-icon">
            <TrendingUp size={22} />
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

      </div>


      {/* SEARCH */}
      <div className="search-box">

        <Search size={19} />

        <input
          type="text"
          placeholder="Search child or guardian..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* CHILD RECORDS */}
      {filteredChildren.map((child) => {

        const latest =
          getLatestMeasurement(child);

        return (
          <div
            className="dashboard-card"
            key={child.id}
          >

            {/* CHILD HEADER */}
            <div className="card-header">

              <div className="table-child">

                <div className="child-avatar">
                  {child.name.charAt(0)}
                </div>

                <div>
                  <h3>
                    {child.name}
                  </h3>

                  <p>
                    {child.gender} • {child.center}
                  </p>
                </div>

              </div>


              <button
                className="primary"
                onClick={() =>
                  navigate(
                    `/children/${child.id}/measurement`
                  )
                }
              >
                <Plus size={17} />
                Add Measurement
              </button>

            </div>


            {/* LATEST RECORD */}
            <div className="growth-stats">

              <div className="growth-stat">

                <span>
                  Latest Height
                </span>

                <strong>
                  {latest?.height ?? "--"} cm
                </strong>

              </div>


              <div className="growth-stat">

                <span>
                  Latest Weight
                </span>

                <strong>
                  {latest?.weight ?? "--"} kg
                </strong>

              </div>


              <div className="growth-stat">

                <span>
                  Latest BMI
                </span>

                <strong>
                  {latest
                    ? calculateBMI(
                        latest.weight,
                        latest.height
                      )
                    : "--"}
                </strong>

              </div>

            </div>


            {/* HISTORY */}
            <div className="card-header growth-history-header">

              <div>
                <h3>
                  Measurement History
                </h3>

                <p>
                  Height, weight and calculated BMI
                </p>
              </div>

            </div>


            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>
                      Date
                    </th>

                    <th>
                      Height
                    </th>

                    <th>
                      Weight
                    </th>

                    <th>
                      BMI
                    </th>
                  </tr>
                </thead>


                <tbody>

                  {child.measurements
                    .slice()
                    .reverse()
                    .map((measurement, index) => {

                      const bmi =
                        calculateBMI(
                          measurement.weight,
                          measurement.height
                        );

                      return (
                        <tr
                          key={`${measurement.date}-${index}`}
                        >

                          <td>
                            {measurement.date}
                          </td>

                          <td>
                            {measurement.height} cm
                          </td>

                          <td>
                            {measurement.weight} kg
                          </td>

                          <td>
                            <span className="bmi-badge">
                              {bmi}
                            </span>
                          </td>

                        </tr>
                      );

                    })}

                </tbody>

              </table>

            </div>


            <div className="info-note">

              BMI is calculated automatically from the
              recorded height and weight. For children,
              BMI should be interpreted using age- and
              sex-specific BMI-for-age information.

            </div>

          </div>
        );

      })}


      {/* NO RESULT */}
      {filteredChildren.length === 0 && (

        <div className="dashboard-card empty-state">

          <h3>
            No children found
          </h3>

          <p>
            Try searching with another child name
            or guardian name.
          </p>

        </div>

      )}

    </div>
  );
}