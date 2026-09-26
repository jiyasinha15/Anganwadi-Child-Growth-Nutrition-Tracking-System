import React, { useState } from "react";
import {
  ClipboardCheck,
  Search,
  Calendar,
  CheckCircle,
  Clock
} from "lucide-react";

import { children } from "../data";

export default function FollowUps() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [followUps, setFollowUps] = useState(
    children.map((child, index) => ({
      id: child.id,
      name: child.name,
      guardian: child.guardian,
      center: child.center,
      followUpDate: `2026-09-${20 + index}`,
      reason:
        index === 1
          ? "Routine growth monitoring"
          : "Growth record follow-up",
      status:
        index === 1
          ? "Completed"
          : "Pending"
    }))
  );

  const filteredFollowUps = followUps.filter((item) => {
    const matchesSearch =
      item.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.guardian
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      status === "All" ||
      item.status === status;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = followUps.filter(
    (item) => item.status === "Pending"
  ).length;

  const completedCount = followUps.filter(
    (item) => item.status === "Completed"
  ).length;

  const markCompleted = (id) => {
    setFollowUps((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Completed"
            }
          : item
      )
    );
  };

  return (
    <div className="followups-page">

      {/* HEADER */}
      <div className="page-header">

        <div>
          <h1>
            Follow-ups
          </h1>

          <p>
            Monitor and manage child follow-up records
          </p>
        </div>

      </div>


      {/* SUMMARY */}
      <div className="stats-grid">

        <div className="followup-summary">

          <ClipboardCheck size={22} />

          <div>
            <span>
              Total Follow-ups
            </span>

            <strong>
              {followUps.length}
            </strong>
          </div>

        </div>


        <div className="followup-summary">

          <Clock size={22} />

          <div>
            <span>
              Pending
            </span>

            <strong>
              {pendingCount}
            </strong>
          </div>

        </div>


        <div className="followup-summary">

          <CheckCircle size={22} />

          <div>
            <span>
              Completed
            </span>

            <strong>
              {completedCount}
            </strong>
          </div>

        </div>

      </div>


      {/* SEARCH + FILTER */}
      <div className="filter-bar">

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


        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="All">
            All Status
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Completed">
            Completed
          </option>
        </select>

      </div>


      {/* TABLE */}
      <div className="dashboard-card">

        <div className="card-header">

          <div>
            <h3>
              Follow-up Records
            </h3>

            <p>
              Track scheduled and completed follow-ups
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
                  Guardian
                </th>

                <th>
                  Follow-up Date
                </th>

                <th>
                  Reason
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>
              </tr>

            </thead>


            <tbody>

              {filteredFollowUps.map((item) => (

                <tr key={item.id}>

                  <td>

                    <div className="table-child">

                      <div className="child-avatar">
                        {item.name.charAt(0)}
                      </div>

                      <div>
                        <strong>
                          {item.name}
                        </strong>

                        <small>
                          {item.center}
                        </small>
                      </div>

                    </div>

                  </td>


                  <td>
                    {item.guardian}
                  </td>


                  <td>
                    {item.followUpDate}
                  </td>


                  <td>
                    {item.reason}
                  </td>


                  <td>

                    <span
                      className={
                        item.status === "Completed"
                          ? "status completed"
                          : "status pending"
                      }
                    >
                      {item.status}
                    </span>

                  </td>


                  <td>

                    {item.status === "Pending" ? (

                      <button
                        className="secondary"
                        onClick={() =>
                          markCompleted(item.id)
                        }
                      >
                        <CheckCircle size={15} />
                        Complete
                      </button>

                    ) : (

                      <span className="status completed">
                        Done
                      </span>

                    )}

                  </td>

                </tr>

              ))}


              {filteredFollowUps.length === 0 && (

                <tr>

                  <td
                    colSpan="6"
                    className="empty-state"
                  >
                    No follow-up records found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* INFORMATION */}
      <div className="info-note">

        Follow-up records help Anganwadi workers keep
        track of scheduled monitoring activities and
        completed follow-ups.

      </div>

    </div>
  );
}