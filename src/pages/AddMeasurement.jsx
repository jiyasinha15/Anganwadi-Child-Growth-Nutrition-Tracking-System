import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Calculator
} from "lucide-react";

import {
  children,
  calculateBMI
} from "../data";

export default function AddMeasurement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const child = children.find(
    (item) => item.id === id
  );

  const [form, setForm] = useState({
    date: new Date()
      .toISOString()
      .split("T")[0],
    height: "",
    weight: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const bmi = calculateBMI(
    form.weight,
    form.height
  );

  if (!child) {
    return (
      <div className="dashboard-card empty-state">

        <h2>
          Child not found
        </h2>

        <p>
          The selected child record does not exist.
        </p>

        <button
          className="primary"
          onClick={() =>
            navigate("/children")
          }
        >
          Back to Children
        </button>

      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMeasurement = {
      date: form.date,
      height: Number(form.height),
      weight: Number(form.weight),
      bmi
    };

    console.log(
      "New growth measurement:",
      {
        childId: child.id,
        childName: child.name,
        measurement: newMeasurement
      }
    );

    alert(
      `Growth record saved for ${child.name}`
    );

    navigate(
      `/children/${child.id}`
    );
  };

  return (
    <div className="add-measurement-page">

      {/* HEADER */}
      <div className="page-header">

        <div>

          <button
            type="button"
            className="back-button"
            onClick={() =>
              navigate(
                `/children/${child.id}`
              )
            }
          >
            <ArrowLeft size={18} />
            Back to Profile
          </button>

          <h1>
            Add Growth Measurement
          </h1>

          <p>
            Add a new height and weight record for{" "}
            <strong>
              {child.name}
            </strong>
          </p>

        </div>

      </div>


      {/* FORM */}
      <form
        className="registration-form"
        onSubmit={handleSubmit}
      >

        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h3>
                Growth Record
              </h3>

              <p>
                Enter the latest measurement details
              </p>
            </div>

            <div className="action-icon">
              <Calculator size={21} />
            </div>

          </div>


          <div className="form-grid">

            {/* DATE */}
            <div className="form-group">

              <label htmlFor="date">
                Measurement Date
              </label>

              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />

            </div>


            {/* HEIGHT */}
            <div className="form-group">

              <label htmlFor="height">
                Height (cm)
              </label>

              <input
                id="height"
                name="height"
                type="number"
                min="1"
                step="0.1"
                placeholder="e.g. 100"
                value={form.height}
                onChange={handleChange}
                required
              />

            </div>


            {/* WEIGHT */}
            <div className="form-group">

              <label htmlFor="weight">
                Weight (kg)
              </label>

              <input
                id="weight"
                name="weight"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="e.g. 15.5"
                value={form.weight}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* BMI */}
          <div className="calculated-bmi">

            <span>
              Calculated BMI
            </span>

            <strong>
              {bmi ?? "--"}
            </strong>

            <small>
              BMI is automatically calculated from
              the entered height and weight.
            </small>

          </div>


          <p className="info-note">

            For children, BMI should be interpreted
            using age- and sex-specific BMI-for-age
            information. This system is for record
            keeping and monitoring, not clinical diagnosis.

          </p>

        </div>


        {/* ACTIONS */}
        <div className="form-actions">

          <button
            type="button"
            className="secondary"
            onClick={() =>
              navigate(
                `/children/${child.id}`
              )
            }
          >
            Cancel
          </button>


          <button
            type="submit"
            className="primary"
          >
            <Save size={18} />
            Save Measurement
          </button>

        </div>

      </form>

    </div>
  );
}