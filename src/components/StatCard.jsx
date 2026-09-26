import React from "react";

export default function StatCard({ icon, label, value, sub }) {
  return (
    <div className="stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-content">

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

        {sub && (
          <small>
            {sub}
          </small>
        )}

      </div>

    </div>
  );
}