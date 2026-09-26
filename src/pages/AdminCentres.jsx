import React, { useState } from "react";
import {
  Building2,
  Plus,
  MapPin,
  Users
} from "lucide-react";

export default function AdminCentres() {

  const [showForm, setShowForm] = useState(false);

  const [centres, setCentres] = useState([
    {
      id: 1,
      name: "Anganwadi Centre - 01",
      location: "Main Village",
      worker: "Anganwadi Worker",
      children: 2,
      status: "Active"
    },
    {
      id: 2,
      name: "Anganwadi Centre - 02",
      location: "Station Road",
      worker: "Anganwadi Worker",
      children: 1,
      status: "Active"
    },
    {
      id: 3,
      name: "Anganwadi Centre - 03",
      location: "Village Road",
      worker: "Not Assigned",
      children: 0,
      status: "Active"
    }
  ]);

  const [form, setForm] = useState({
    name: "",
    location: "",
    worker: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setCentres([
      ...centres,
      {
        id: Date.now(),
        name: form.name,
        location: form.location,
        worker: form.worker || "Not Assigned",
        children: 0,
        status: "Active"
      }
    ]);

    setForm({
      name: "",
      location: "",
      worker: ""
    });

    setShowForm(false);
  };

  return (
    <div className="admin-centres-page">

      <div className="page-header">

        <div>
          <h1>Anganwadi Centres</h1>

          <p>
            Manage registered Anganwadi centres
          </p>
        </div>

        <button
          className="primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={18} />
          Add Centre
        </button>

      </div>


      {/* SUMMARY */}
      <div className="stats-grid">

        <div className="admin-stat">

          <div className="stat-icon">
            <Building2 size={22} />
          </div>

          <div>
            <span>Total Centres</span>
            <strong>{centres.length}</strong>
          </div>

        </div>


        <div className="admin-stat">

          <div className="stat-icon">
            <Users size={22} />
          </div>

          <div>
            <span>Active Centres</span>
            <strong>
              {centres.filter(
                (centre) => centre.status === "Active"
              ).length}
            </strong>
          </div>

        </div>

      </div>


      {/* ADD FORM */}
      {showForm && (
        <form
          className="dashboard-card"
          onSubmit={handleSubmit}
        >

          <div className="card-header">

            <div>
              <h3>Add New Centre</h3>

              <p>
                Enter the centre details below
              </p>
            </div>

          </div>


          <div className="form-grid">

            <div className="form-group">
              <label>Centre Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter centre name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>


            <div className="form-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                placeholder="Enter location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>


            <div className="form-group">
              <label>Assigned Worker</label>

              <input
                type="text"
                name="worker"
                placeholder="Enter worker name"
                value={form.worker}
                onChange={handleChange}
              />
            </div>

          </div>


          <div className="form-actions">

            <button
              type="button"
              className="secondary"
              onClick={() => setShowForm(false)}
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


      {/* CENTRES TABLE */}
      <div className="dashboard-card">

        <div className="card-header">

          <div>
            <h3>Registered Centres</h3>

            <p>
              Centre and worker information
            </p>
          </div>

        </div>


        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Centre</th>
                <th>Location</th>
                <th>Children</th>
                <th>Worker</th>
                <th>Status</th>
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
                    <span className="table-icon-text">
                      <MapPin size={15} />
                      {centre.location}
                    </span>
                  </td>

                  <td>
                    <span className="table-icon-text">
                      <Users size={15} />
                      {centre.children}
                    </span>
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

    </div>
  );
}