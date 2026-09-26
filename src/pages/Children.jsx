import React, { useState } from "react";
import {
  Search,
  Eye,
  Plus,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  children,
  getLatestMeasurement,
  getLatestBMI
} from "../data";

export default function Children() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const filteredChildren = children.filter((child) => {
    const text = `
      ${child.name}
      ${child.guardian}
      ${child.center}
      ${child.gender}
    `.toLowerCase();

    return text.includes(
      search.toLowerCase()
    );
  });

  return (
    <div className="children-page">

      {/* HEADER */}
      <div className="page-header">

        <div>
          <h1>
            Children
          </h1>

          <p>
            Manage registered children and their growth records
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


      {/* SUMMARY */}
      <div className="stats-grid">

        <div className="report-stat">

          <div className="stat-icon">
            <Users size={22} />
          </div>

          <div>
            <span>
              Registered Children
            </span>

            <strong>
              {children.length}
            </strong>
          </div>

        </div>

      </div>


      {/* SEARCH */}
      <div className="search-box">

        <Search size={19} />

        <input
          type="text"
          placeholder="Search by child name, guardian or centre..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* CHILDREN TABLE */}
      <div className="dashboard-card">

        <div className="card-header">

          <div>
            <h3>
              Registered Children
            </h3>

            <p>
              {filteredChildren.length} children found
            </p>
          </div>

        </div>


        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>
                  Child
                </th>

                <th>
                  Gender
                </th>

                <th>
                  Guardian
                </th>

                <th>
                  Centre
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

                <th>
                  Action
                </th>
              </tr>

            </thead>


            <tbody>

              {filteredChildren.map((child) => {

                const latest =
                  getLatestMeasurement(child);

                const bmi =
                  getLatestBMI(child);

                return (
                  <tr key={child.id}>

                    {/* CHILD */}
                    <td>

                      <div className="table-child">

                        <div className="child-avatar">
                          {child.name.charAt(0)}
                        </div>

                        <div>

                          <strong>
                            {child.name}
                          </strong>

                          <small>
                            DOB: {child.dob}
                          </small>

                        </div>

                      </div>

                    </td>


                    {/* GENDER */}
                    <td>
                      {child.gender}
                    </td>


                    {/* GUARDIAN */}
                    <td>
                      {child.guardian}
                    </td>


                    {/* CENTRE */}
                    <td>
                      {child.center}
                    </td>


                    {/* HEIGHT */}
                    <td>
                      {latest?.height ?? "--"} cm
                    </td>


                    {/* WEIGHT */}
                    <td>
                      {latest?.weight ?? "--"} kg
                    </td>


                    {/* BMI */}
                    <td>

                      <span className="bmi-badge">
                        {bmi ?? "--"}
                      </span>

                    </td>


                    {/* ACTION */}
                    <td>

                      <button
                        className="icon-button"
                        title="View Child"
                        onClick={() =>
                          navigate(
                            `/children/${child.id}`
                          )
                        }
                      >
                        <Eye size={18} />
                      </button>

                    </td>

                  </tr>
                );

              })}


              {/* NO RESULTS */}
              {filteredChildren.length === 0 && (

                <tr>

                  <td
                    colSpan="8"
                    className="empty-state"
                  >

                    <h3>
                      No children found
                    </h3>

                    <p>
                      Try searching with another name,
                      guardian or centre.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* INFORMATION */}
      <div className="info-note">

        Select the eye icon to open a child's complete
        profile, growth history and BMI records.

      </div>

    </div>
  );
}