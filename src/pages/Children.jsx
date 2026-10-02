import React, { useState } from "react";
import { Search, Eye, Plus, Users } from "lucide-react";
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

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="worker-children-page">

      <div className="worker-page-header">
        <div>
          <h1>Children</h1>
          <p>
            Manage registered children and their growth records
          </p>
        </div>

        <button
          className="worker-primary-btn"
          onClick={() => navigate("/children/new")}
        >
          <Plus size={18} />
          Register Child
        </button>
      </div>

      <div className="worker-children-summary">
        <div className="worker-summary-card">
          <div className="worker-summary-icon">
            <Users size={22} />
          </div>

          <div>
            <span>Registered Children</span>
            <strong>{children.length}</strong>
            <small>Active child records</small>
          </div>
        </div>
      </div>

      <div className="worker-search">
        <Search size={19} />

        <input
          type="text"
          placeholder="Search by child name, guardian or centre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="worker-content-card">

        <div className="worker-card-heading">
          <div>
            <h3>Registered Children</h3>
            <p>{filteredChildren.length} children found</p>
          </div>
        </div>

        <div className="worker-table-wrapper">
          <table className="worker-table">

            <thead>
              <tr>
                <th>Child</th>
                <th>Gender</th>
                <th>Guardian</th>
                <th>Centre</th>
                <th>Height</th>
                <th>Weight</th>
                <th>BMI</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredChildren.map((child) => {
                const latest = getLatestMeasurement(child);
                const bmi = getLatestBMI(child);

                return (
                  <tr key={child.id}>

                    <td>
                      <div className="worker-table-child">

                        <div className="worker-table-avatar">
                          {child.name.charAt(0)}
                        </div>

                        <div>
                          <strong>{child.name}</strong>
                          <small>DOB: {child.dob}</small>
                        </div>

                      </div>
                    </td>

                    <td>{child.gender}</td>

                    <td>{child.guardian}</td>

                    <td>{child.center}</td>

                    <td>
                      {latest?.height ?? "--"} cm
                    </td>

                    <td>
                      {latest?.weight ?? "--"} kg
                    </td>

                    <td>
                      <span className="worker-bmi-badge">
                        {bmi ?? "--"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="worker-view-btn"
                        title="View Child"
                        onClick={() =>
                          navigate(`/children/${child.id}`)
                        }
                      >
                        <Eye size={17} />
                      </button>
                    </td>

                  </tr>
                );
              })}

              {filteredChildren.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="worker-empty-state"
                  >
                    <h3>No children found</h3>
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

      <div className="worker-info-note">
        Select the eye icon to open a child's complete
        profile, growth history and BMI records.
      </div>

    </div>
  );
}