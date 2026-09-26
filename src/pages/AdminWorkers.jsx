import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Building2
} from "lucide-react";

export default function AdminWorkers() {

  const [workers, setWorkers] = useState([
    {
      id: 1,
      name: "Anganwadi Worker",
      email: "worker01@example.com",
      centre: "Anganwadi Centre - 01",
      status: "Active"
    },
    {
      id: 2,
      name: "Anganwadi Worker",
      email: "worker02@example.com",
      centre: "Anganwadi Centre - 02",
      status: "Active"
    }
  ]);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    centre: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setWorkers([
      ...workers,
      {
        id: Date.now(),
        name: form.name,
        email: form.email,
        centre: form.centre,
        status: "Active"
      }
    ]);

    setForm({
      name: "",
      email: "",
      centre: ""
    });

    setShowForm(false);
  };

  return (
    <div className="admin-workers-page">

      <div className="page-header">

        <div>
          <h1>Manage Workers</h1>

          <p>
            Add and manage Anganwadi worker accounts
          </p>
        </div>

        <button
          className="primary"
          onClick={() => setShowForm(!showForm)}
        >
          <UserPlus size={18} />
          Add Worker
        </button>

      </div>


      {/* SUMMARY */}
      <div className="stats-grid">

        <div className="admin-stat">

          <div className="stat-icon">
            <Users size={22} />
          </div>

          <div>
            <span>Total Workers</span>
            <strong>{workers.length}</strong>
          </div>

        </div>


        <div className="admin-stat">

          <div className="stat-icon">
            <Building2 size={22} />
          </div>

          <div>
            <span>Assigned Centres</span>
            <strong>
              {
                new Set(
                  workers.map(
                    (worker) => worker.centre
                  )
                ).size
              }
            </strong>
          </div>

        </div>

      </div>


      {/* ADD WORKER FORM */}
      {showForm && (
        <form
          className="dashboard-card"
          onSubmit={handleSubmit}
        >

          <div className="card-header">

            <div>
              <h3>Add Worker</h3>

              <p>
                Create a worker record
              </p>
            </div>

          </div>


          <div className="form-grid">

            <div className="form-group">

              <label>
                Worker Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter worker name"
                value={form.name}
                onChange={handleChange}
                required
              />

            </div>


            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter worker email"
                value={form.email}
                onChange={handleChange}
                required
              />

            </div>


            <div className="form-group">

              <label>
                Anganwadi Centre
              </label>

              <select
                name="centre"
                value={form.centre}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select centre
                </option>

                <option value="Anganwadi Centre - 01">
                  Anganwadi Centre - 01
                </option>

                <option value="Anganwadi Centre - 02">
                  Anganwadi Centre - 02
                </option>

                <option value="Anganwadi Centre - 03">
                  Anganwadi Centre - 03
                </option>

              </select>

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
              <UserPlus size={17} />
              Save Worker
            </button>

          </div>

        </form>
      )}


      {/* WORKERS TABLE */}
      <div className="dashboard-card">

        <div className="card-header">

          <div>
            <h3>Registered Workers</h3>

            <p>
              Worker accounts and centre assignments
            </p>
          </div>

        </div>


        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Worker</th>
                <th>Email</th>
                <th>Centre</th>
                <th>Status</th>
              </tr>
            </thead>


            <tbody>

              {workers.map((worker) => (
                <tr key={worker.id}>

                  <td>
                    <div className="table-child">

                      <div className="child-avatar">
                        {worker.name.charAt(0)}
                      </div>

                      <strong>
                        {worker.name}
                      </strong>

                    </div>
                  </td>

                  <td>
                    {worker.email}
                  </td>

                  <td>
                    {worker.centre}
                  </td>

                  <td>
                    <span className="status completed">
                      {worker.status}
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