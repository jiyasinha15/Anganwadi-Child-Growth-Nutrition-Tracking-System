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
      <div className="worker-content-card worker-empty-profile">
        <h2>Child not found</h2>

        <button
          className="worker-primary-btn"
          onClick={() => navigate("/children")}
        >
          Back to Children
        </button>
      </div>
    );
  }

  const latest = getLatestMeasurement(child);

  const latestBMI = latest
    ? calculateBMI(latest.weight, latest.height)
    : null;

  return (
    <div className="worker-profile-page">

      {/* HEADER */}

      <div className="worker-page-header">

        <div>

          <button
            className="worker-back-btn"
            onClick={() => navigate("/children")}
          >
            <ArrowLeft size={18} />
            Back to Children
          </button>

          <h1>{child.name}</h1>

          <p>
            Child profile and growth records
          </p>

        </div>

        <button
          className="worker-primary-btn"
          onClick={() =>
            navigate(`/children/${child.id}/measurement`)
          }
        >
          <Plus size={18} />
          Add Measurement
        </button>

      </div>


      {/* PROFILE */}

      <div className="worker-profile-card">

        <div className="worker-profile-avatar">
          {child.name.charAt(0)}
        </div>

        <div className="worker-profile-main">

          <div className="worker-profile-title">
            <div>
              <h2>{child.name}</h2>
              <span>{child.gender}</span>
            </div>
          </div>

          <div className="worker-profile-details">

            <div>
              <Calendar size={17} />
              <span>DOB: {child.dob}</span>
            </div>

            <div>
              <Phone size={17} />
              <span>{child.phone}</span>
            </div>

            <div>
              <User size={17} />
              <span>
                Guardian: {child.guardian}
              </span>
            </div>

            <div>
              <MapPin size={17} />
              <span>{child.address}</span>
            </div>

          </div>

        </div>

      </div>


      {/* LATEST GROWTH */}

      <div className="worker-content-card">

        <div className="worker-card-heading">

          <div>
            <h3>Latest Growth Record</h3>
            <p>
              Most recent height and weight measurement
            </p>
          </div>

          {latest && (
            <span className="worker-date-badge">
              {latest.date}
            </span>
          )}

        </div>

        <div className="worker-growth-stats">

          <div>
            <span>Height</span>
            <strong>
              {latest?.height ?? "--"} cm
            </strong>
          </div>

          <div>
            <span>Weight</span>
            <strong>
              {latest?.weight ?? "--"} kg
            </strong>
          </div>

          <div>
            <span>BMI</span>
            <strong>
              {latestBMI ?? "--"}
            </strong>
          </div>

        </div>

        <div className="worker-info-note">
          BMI is calculated from the recorded height and
          weight. For children, BMI should be interpreted
          using age- and sex-specific BMI-for-age information.
        </div>

      </div>


      {/* HISTORY */}

      <div className="worker-content-card">

        <div className="worker-card-heading">

          <div>
            <h3>Measurement History</h3>
            <p>
              Complete height, weight and BMI history
            </p>
          </div>

          <button
            className="worker-primary-btn small"
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

        <div className="worker-table-wrapper">

          <table className="worker-table">

            <thead>
              <tr>
                <th>Date</th>
                <th>Height</th>
                <th>Weight</th>
                <th>BMI</th>
              </tr>
            </thead>

            <tbody>

              {child.measurements
                .slice()
                .reverse()
                .map((measurement, index) => {

                  const bmi = calculateBMI(
                    measurement.weight,
                    measurement.height
                  );

                  return (
                    <tr
                      key={`${measurement.date}-${index}`}
                    >
                      <td>{measurement.date}</td>

                      <td>
                        {measurement.height} cm
                      </td>

                      <td>
                        {measurement.weight} kg
                      </td>

                      <td>
                        <span className="worker-bmi-badge">
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

      <div className="worker-content-card">

        <div className="worker-card-heading">

          <div>
            <h3>Child Information</h3>
            <p>
              Registered profile information
            </p>
          </div>

        </div>

        <div className="worker-system-info">

          <div>
            <span>Child Name</span>
            <strong>{child.name}</strong>
          </div>

          <div>
            <span>Date of Birth</span>
            <strong>{child.dob}</strong>
          </div>

          <div>
            <span>Gender</span>
            <strong>{child.gender}</strong>
          </div>

          <div>
            <span>Guardian</span>
            <strong>{child.guardian}</strong>
          </div>

          <div>
            <span>Phone</span>
            <strong>{child.phone}</strong>
          </div>

          <div>
            <span>Anganwadi Centre</span>
            <strong>{child.center}</strong>
          </div>

        </div>

      </div>

    </div>
  );
}