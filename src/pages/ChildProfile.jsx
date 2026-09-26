import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  Plus
} from "lucide-react";

import {
  children,
  calculateBMI,
  getLatestMeasurement
} from "../data";

export default function ChildProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const child = children.find(
    (item) => item.id === id
  );

  if (!child) {
    return (
      <div className="dashboard-card empty-state">
        <h2>Child not found</h2>

        <button
          className="primary"
          onClick={() => navigate("/children")}
        >
          Back to Children
        </button>
      </div>
    );
  }

  const latest = getLatestMeasurement(child);

  const latestBMI = latest
    ? calculateBMI(
        latest.weight,
        latest.height
      )
    : null;

  return (
    <div className="child-profile-page">

      {/* HEADER */}
      <div className="page-header">

        <div>

          <button
            className="back-button"
            onClick={() =>
              navigate("/children")
            }
          >
            <ArrowLeft size={18} />
            Back to Children
          </button>

          <h1>
            {child.name}
          </h1>

          <p>
            Child profile and growth records
          </p>

        </div>


        <button
          className="primary"
          onClick={() =>
            navigate(
              `/children/${child.id}/measurement`
            )
          }
        >
          <Plus size={18} />
          Add Measurement
        </button>

      </div>


      {/* BASIC PROFILE */}
      <div className="profile-card">

        <div className="profile-avatar">
          {child.name.charAt(0)}
        </div>


        <div className="profile-main">

          <h2>
            {child.name}
          </h2>

          <span>
            {child.gender}
          </span>


          <div className="profile-details">

            <div>
              <Calendar size={17} />

              <span>
                DOB: {child.dob}
              </span>
            </div>


            <div>
              <Phone size={17} />

              <span>
                {child.phone}
              </span>
            </div>


            <div>
              <User size={17} />

              <span>
                Guardian: {child.guardian}
              </span>
            </div>


            <div>
              <MapPin size={17} />

              <span>
                {child.address}
              </span>
            </div>

          </div>

        </div>

      </div>


      {/* LATEST GROWTH */}
      <div className="dashboard-card">

        <div className="card-header">

          <div>
            <h3>
              Latest Growth Record
            </h3>

            <p>
              Most recent height and weight measurement
            </p>
          </div>

          {latest && (
            <span>
              {latest.date}
            </span>
          )}

        </div>


        <div className="growth-stats">

          <div className="growth-stat">

            <span>
              Height
            </span>

            <strong>
              {latest?.height ?? "--"} cm
            </strong>

          </div>


          <div className="growth-stat">

            <span>
              Weight
            </span>

            <strong>
              {latest?.weight ?? "--"} kg
            </strong>

          </div>


          <div className="growth-stat">

            <span>
              BMI
            </span>

            <strong>
              {latestBMI ?? "--"}
            </strong>

          </div>

        </div>


        <p className="info-note">
          BMI is calculated from the recorded height
          and weight. For children, BMI should be
          interpreted using age- and sex-specific
          BMI-for-age information.
        </p>

      </div>


      {/* MEASUREMENT HISTORY */}
      <div className="dashboard-card">

        <div className="card-header">

          <div>
            <h3>
              Measurement History
            </h3>

            <p>
              Complete height, weight and BMI history
            </p>
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
            Add Record
          </button>

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

      </div>


      {/* CHILD INFORMATION */}
      <div className="dashboard-card">

        <div className="card-header">

          <div>
            <h3>
              Child Information
            </h3>

            <p>
              Registered profile information
            </p>
          </div>

        </div>


        <div className="system-info">

          <div>
            <span>
              Child Name
            </span>

            <strong>
              {child.name}
            </strong>
          </div>


          <div>
            <span>
              Date of Birth
            </span>

            <strong>
              {child.dob}
            </strong>
          </div>


          <div>
            <span>
              Gender
            </span>

            <strong>
              {child.gender}
            </strong>
          </div>


          <div>
            <span>
              Guardian
            </span>

            <strong>
              {child.guardian}
            </strong>
          </div>


          <div>
            <span>
              Phone
            </span>

            <strong>
              {child.phone}
            </strong>
          </div>


          <div>
            <span>
              Anganwadi Centre
            </span>

            <strong>
              {child.center}
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}