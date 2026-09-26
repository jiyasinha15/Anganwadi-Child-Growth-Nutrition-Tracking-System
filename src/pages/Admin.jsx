import React, { useState } from "react";
import {
  ShieldCheck,
  Users,
  Building2,
  Database,
  Settings,
  UserPlus,
  Plus
} from "lucide-react";

export default function Admin() {
  const [centres, setCentres] = useState([
    {
      id: 1,
      name: "Anganwadi Centre - 01",
      location: "Main Village",
      children: 2,
      worker: "Anganwadi Worker",
      status: "Active"
    },
    {
      id: 2,
      name: "Anganwadi Centre - 02",
      location: "Station Road",
      children: 1,
      worker: "Anganwadi Worker",
      status: "Active"
    },
    {
      id: 3,
      name: "Anganwadi Centre - 03",
      location: "Village Road",
      children: 0,
      worker: "Not Assigned",
      status: "Active"
    }
  ]);

  const [showForm, setShowForm] = useState(false);

  const [newCentre, setNewCentre] = useState({
    name: "",
    location: "",
    worker: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewCentre((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCentre = (e) => {
    e.preventDefault();

    const centre = {
      id: Date.now(),
      name: newCentre.name,
      location: newCentre.location,
      children: 0,
      worker: newCentre.worker || "Not Assigned",
      status: "Active"
    };

    setCentres((prev) => [
      ...prev,
      centre
    ]);

    setNewCentre({
      name: "",
      location: "",
      worker: ""
    });

    setShowForm(false);

    alert("Anganwadi centre added successfully!");
  };

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="page-header">

        <div>
          <h1>
            Admin Panel
          </h1>

          <p>
            Manage centres, workers and system information
          </p>
        </div>

        <div className="admin-badge">
          <ShieldCheck size={18} />
          Administrator
        </div>

      </div>


      {/* SUMMARY */}
      <div className="stats-grid">

        <div className="admin-stat">

          <div className="stat-icon">
            <Building2 size={22} />
          </div>

          <div>
            <span>
              Anganwadi Centres
            </span>

            <strong>
              {centres.length}
            </strong>
          </div>

        </div>


        <div className="admin-stat">

          <div className="stat-icon">
            <Users size={22} />
          </div>

          <div>
            <span>
              Registered Workers
            </span>

            <strong>
              2
            </strong>
          </div>

        </div>


        <div className="admin-stat">

          <div className="stat-icon">
            <Database size={22} />
          </div>

          <div>
            <span>
              System Records
            </span>

            <strong>
              Active
            </strong>
          </div>

        </div>

      </div>


      {/* CENTRES */}
      <div className="dashboard-card">

        <div className="card-header">

          <div>
            <h3>
              Anganwadi Centres
            </h3>

            <p>
              Centre and worker information
            </p>
          </div>


          <button
            className="primary"
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            <Plus size={17} />
            Add Centre
          </button>

        </div>


        {/* ADD CENTRE FORM */}
        {showForm && (

          <form
            className="dashboard-card"
            onSubmit={handleAddCentre}
          >

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Centre Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter centre name"
                  value={newCentre.name}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="Enter location"
                  value={newCentre.location}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Assigned Worker
                </label>

                <input
                  type="text"
                  name="worker"
                  placeholder="Enter worker name"
                  value={newCentre.worker}
                  onChange={handleChange}
                />

              </div>

            </div>


            <div className="form-actions">

              <button
                type="button"
                className="secondary"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary"
              >
                <Plus size={17} />
                Save Centre
              </button>

            </div>

          </form>

        )}


        {/* TABLE */}
        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>
                  Centre
                </th>

                <th>
                  Location
                </th>

                <th>
                  Children
                </th>

                <th>
                  Assigned Worker
                </th>

                <th>
                  Status
                </th>
              </tr>

            </thead>


            <tbody>

              {centres.map((centre) => (

                <tr key={centre.id}>

                  <td>
                    <strong>
                      {centre.name}
                    </strong>
                  </td>

                  <td>
                    {centre.location}
                  </td>

                  <td>
                    {centre.children}
                  </td>

                  <td>
                    {centre.worker}
                  </td>

                  <td>

                    <span className="status completed">
                      {centre.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* ADMIN ACTIONS */}
      <div className="admin-actions">

        <div className="dashboard-card admin-action-card">

          <div className="action-icon">
            <UserPlus size={22} />
          </div>

          <div>
            <h3>
              Manage Workers
            </h3>

            <p>
              Add and manage Anganwadi worker accounts.
            </p>
          </div>

          <button className="secondary">
            Manage
          </button>

        </div>


        <div className="dashboard-card admin-action-card">

          <div className="action-icon">
            <Settings size={22} />
          </div>

          <div>
            <h3>
              System Settings
            </h3>

            <p>
              Manage application settings and preferences.
            </p>
          </div>

          <button className="secondary">
            Settings
          </button>

        </div>

      </div>


      {/* SYSTEM INFORMATION */}
      <div className="dashboard-card">

        <div className="card-header">

          <div>
            <h3>
              System Information
            </h3>

            <p>
              Current application configuration
            </p>
          </div>

        </div>


        <div className="system-info">

          <div>
            <span>
              Application
            </span>

            <strong>
              Anganwadi Child Growth & Nutrition Tracking
            </strong>
          </div>


          <div>
            <span>
              Frontend
            </span>

            <strong>
              React.js
            </strong>
          </div>


          <div>
            <span>
              Backend
            </span>

            <strong>
              Node.js / Express.js
            </strong>
          </div>


          <div>
            <span>
              Database
            </span>

            <strong>
              MongoDB
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}