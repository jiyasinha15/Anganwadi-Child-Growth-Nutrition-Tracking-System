import React, { useState } from "react";
import {
  Settings,
  Bell,
  Database,
  ShieldCheck
} from "lucide-react";

export default function AdminSettings() {

  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  return (
    <div className="admin-settings-page">

      <div className="page-header">
        <div>
          <h1>System Settings</h1>
          <p>
            Manage application settings and preferences
          </p>
        </div>
      </div>


      {/* GENERAL */}
      <div className="dashboard-card">

        <div className="card-header">

          <div className="settings-heading">
            <Settings size={21} />

            <div>
              <h3>General Settings</h3>
              <p>
                Basic application configuration
              </p>
            </div>
          </div>

        </div>


        <div className="settings-list">

          <div className="setting-row">

            <div>
              <strong>Application Name</strong>
              <span>
                Anganwadi Child Growth & Nutrition Tracking
              </span>
            </div>

          </div>


          <div className="setting-row">

            <div>
              <strong>Frontend</strong>
              <span>React.js</span>
            </div>

          </div>


          <div className="setting-row">

            <div>
              <strong>Backend</strong>
              <span>Node.js / Express.js</span>
            </div>

          </div>


          <div className="setting-row">

            <div>
              <strong>Database</strong>
              <span>MongoDB</span>
            </div>

          </div>

        </div>

      </div>


      {/* NOTIFICATIONS */}
      <div className="dashboard-card">

        <div className="settings-option">

          <div className="settings-option-icon">
            <Bell size={21} />
          </div>

          <div>
            <h3>Notifications</h3>

            <p>
              Enable system notifications for
              follow-up and monitoring activities.
            </p>
          </div>

          <label className="switch">

            <input
              type="checkbox"
              checked={notifications}
              onChange={() =>
                setNotifications(!notifications)
              }
            />

            <span className="slider"></span>

          </label>

        </div>

      </div>


      {/* BACKUP */}
      <div className="dashboard-card">

        <div className="settings-option">

          <div className="settings-option-icon">
            <Database size={21} />
          </div>

          <div>
            <h3>Automatic Backup</h3>

            <p>
              Enable automatic backup of application
              records.
            </p>
          </div>

          <label className="switch">

            <input
              type="checkbox"
              checked={autoBackup}
              onChange={() =>
                setAutoBackup(!autoBackup)
              }
            />

            <span className="slider"></span>

          </label>

        </div>

      </div>


      {/* SECURITY */}
      <div className="dashboard-card">

        <div className="settings-option">

          <div className="settings-option-icon">
            <ShieldCheck size={21} />
          </div>

          <div>
            <h3>Security</h3>

            <p>
              Admin authentication and access control
              will be connected with the backend later.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}