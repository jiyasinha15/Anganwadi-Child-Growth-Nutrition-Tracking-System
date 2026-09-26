import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import { calculateBMI } from "../data";

export default function RegisterChild() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    guardian: "",
    phone: "",
    center: "",
    address: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const childData = {
      name: form.name,
      dob: form.dob,
      gender: form.gender,
      guardian: form.guardian,
      phone: form.phone,
      center: form.center,
      address: form.address,

      measurements: [
        {
          date: form.date,
          height: Number(form.height),
          weight: Number(form.weight),
          bmi
        }
      ]
    };

    console.log(
      "New child registration:",
      childData
    );

    alert(
      `${form.name} registered successfully!`
    );

    navigate("/children");
  };

  return (
    <div className="register-page">

      {/* HEADER */}
      <div className="page-header">

        <div>

          <button
            type="button"
            className="back-button"
            onClick={() =>
              navigate("/children")
            }
          >
            <ArrowLeft size={18} />
            Back to Children
          </button>

          <h1>
            Register Child
          </h1>

          <p>
            Add a new child and initial growth record
          </p>

        </div>

      </div>


      <form
        className="registration-form"
        onSubmit={handleSubmit}
      >

        {/* CHILD DETAILS */}
        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h3>
                Child Details
              </h3>

              <p>
                Enter the child's basic information
              </p>
            </div>

          </div>


          <div className="form-grid">

            <div className="form-group">

              <label htmlFor="name">
                Child Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter child name"
                value={form.name}
                onChange={handleChange}
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="dob">
                Date of Birth
              </label>

              <input
                id="dob"
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="gender">
                Gender
              </label>

              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            <div className="form-group">

              <label htmlFor="guardian">
                Guardian Name
              </label>

              <input
                id="guardian"
                name="guardian"
                type="text"
                placeholder="Enter guardian name"
                value={form.guardian}
                onChange={handleChange}
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="center">
                Anganwadi Centre
              </label>

              <select
                id="center"
                name="center"
                value={form.center}
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


            <div className="form-group full-width">

              <label htmlFor="address">
                Address
              </label>

              <textarea
                id="address"
                name="address"
                placeholder="Enter address"
                rows="3"
                value={form.address}
                onChange={handleChange}
                required
              />

            </div>

          </div>

        </div>


        {/* INITIAL GROWTH */}
        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h3>
                Initial Growth Record
              </h3>

              <p>
                Enter the latest height and weight
              </p>
            </div>

          </div>


          <div className="form-grid">

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
              BMI is calculated automatically from
              the entered height and weight.
            </small>

          </div>


          <p className="info-note">

            For children, BMI should be interpreted
            using age- and sex-specific BMI-for-age
            information.

          </p>

        </div>


        {/* ACTIONS */}
        <div className="form-actions">

          <button
            type="button"
            className="secondary"
            onClick={() =>
              navigate("/children")
            }
          >
            Cancel
          </button>


          <button
            type="submit"
            className="primary"
          >
            <Save size={18} />
            Save Child
          </button>

        </div>

      </form>

    </div>
  );
}