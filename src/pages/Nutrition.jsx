import React, { useState } from "react";
import { Apple, Search, Save } from "lucide-react";

import { children } from "../data";

export default function Nutrition() {
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState({});

  const handleChange = (id, field, value) => {
    setRecords((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleSave = (child) => {
    const record = records[child.id] || {};

    console.log("Nutrition record:", {
      childId: child.id,
      childName: child.name,
      meal: record.meal || "",
      supplement: record.supplement || "",
      observation: record.observation || ""
    });

    alert(
      `Nutrition record saved for ${child.name}`
    );
  };

  const filteredChildren = children.filter((child) => {
    const text = `
      ${child.name}
      ${child.guardian}
      ${child.center}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="nutrition-page">

      {/* HEADER */}
      <div className="page-header">

        <div>
          <h1>
            Nutrition Tracking
          </h1>

          <p>
            Record meals, supplements and nutrition observations
          </p>
        </div>

      </div>


      {/* SUMMARY */}
      <div className="stats-grid">

        <div className="report-stat">

          <div className="stat-icon">
            <Apple size={22} />
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


        <div className="report-stat">

          <div className="stat-icon">
            <Apple size={22} />
          </div>

          <div>
            <span>
              Nutrition Records
            </span>

            <strong>
              {Object.keys(records).length}
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


      {/* NUTRITION TABLE */}
      <div className="dashboard-card">

        <div className="card-header">

          <div>
            <h3>
              Nutrition Records
            </h3>

            <p>
              Enter the latest nutrition information for each child
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
                  Meal / Food
                </th>

                <th>
                  Supplement
                </th>

                <th>
                  Observation
                </th>

                <th>
                  Action
                </th>
              </tr>

            </thead>


            <tbody>

              {filteredChildren.map((child) => {

                const record =
                  records[child.id] || {};

                return (
                  <tr key={child.id}>

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
                            {child.center}
                          </small>
                        </div>

                      </div>

                    </td>


                    <td>

                      <input
                        type="text"
                        placeholder="e.g. Khichdi"
                        value={record.meal || ""}
                        onChange={(e) =>
                          handleChange(
                            child.id,
                            "meal",
                            e.target.value
                          )
                        }
                      />

                    </td>


                    <td>

                      <input
                        type="text"
                        placeholder="e.g. Iron"
                        value={record.supplement || ""}
                        onChange={(e) =>
                          handleChange(
                            child.id,
                            "supplement",
                            e.target.value
                          )
                        }
                      />

                    </td>


                    <td>

                      <input
                        type="text"
                        placeholder="Enter observation"
                        value={
                          record.observation || ""
                        }
                        onChange={(e) =>
                          handleChange(
                            child.id,
                            "observation",
                            e.target.value
                          )
                        }
                      />

                    </td>


                    <td>

                      <button
                        className="icon-button"
                        title="Save nutrition record"
                        onClick={() =>
                          handleSave(child)
                        }
                      >
                        <Save size={17} />
                      </button>

                    </td>

                  </tr>
                );

              })}


              {filteredChildren.length === 0 && (

                <tr>

                  <td
                    colSpan="5"
                    className="empty-state"
                  >
                    No children found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* INFORMATION */}
      <div className="info-note">

        Nutrition records are maintained for monitoring
        and follow-up purposes. This system does not
        provide clinical diagnosis.

      </div>

    </div>
  );
}