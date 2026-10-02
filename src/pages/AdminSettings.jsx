import React, { useState } from "react";

import {
  Settings,
  Bell,
  Database,
  ShieldCheck,
  Building2,
  Save,
  Clock
} from "lucide-react";

export default function AdminSettings() {
  const [notifications, setNotifications] = useState(true);
  const [followUpAlerts, setFollowUpAlerts] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  const [centreName, setCentreName] = useState(
    "Anganwadi Centre - 01"
  );

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="admin-settings-page">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>
          <h1>System Settings</h1>

          <p>
            Manage application preferences and administrative settings
          </p>
        </div>

      </div>


      {/* GENERAL SETTINGS */}

      <div className="dashboard-card">

        <div className="card-header">

          <div className="settings-heading">

            <Settings size={21} />

            <div>
              <h3>General Settings</h3>

              <p>
                Configure basic system preferences
              </p>
            </div>

          </div>

        </div>


        <div className="settings-list">

          {/* APPLICATION NAME */}

          <div className="setting-row">

            <div>
              <strong>Application Name</strong>

              <span>
                Anganwadi Child Growth & Nutrition Tracking System
              </span>
            </div>

          </div>


          {/* DEFAULT CENTRE */}

          <div className="setting-row setting-input-row">

            <div>
              <strong>Default Anganwadi Centre</strong>

              <span>
                Select the centre used for administrative records
              </span>
            </div>

            <select
              value={centreName}
              onChange={(e) => setCentreName(e.target.value)}
            >
              <option>
                Anganwadi Centre - 01
              </option>

              <option>
                Anganwadi Centre - 02
              </option>

              <option>
                Anganwadi Centre - 03
              </option>
            </select>

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

            <h3>System Notifications</h3>

            <p>
              Enable notifications for important system
              activities and updates.
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


      {/* FOLLOW-UP ALERTS */}

      <div className="dashboard-card">

        <div className="settings-option">

          <div className="settings-option-icon">

            <Clock size={21} />

          </div>


          <div>

            <h3>Follow-up Reminders</h3>

            <p>
              Receive reminders for children requiring
              follow-up or monitoring.
            </p>

          </div>


          <label className="switch">

            <input
              type="checkbox"
              checked={followUpAlerts}
              onChange={() =>
                setFollowUpAlerts(!followUpAlerts)
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
              Automatically backup child growth,
              nutrition and follow-up records.
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

          <div className="settings-option-icon security-icon">

            <ShieldCheck size={21} />

          </div>


          <div>

            <h3>Security & Access Control</h3>

            <p>
              Admin access is restricted to authorized
              administrators. Worker accounts require
              administrator approval.
            </p>

          </div>

        </div>

      </div>


      {/* SAVE */}

      <div className="settings-save-area">

        {saved && (
          <span className="save-message">
            Settings saved successfully
          </span>
        )}

        <button
          className="primary settings-save-button"
          onClick={handleSave}
        >
          <Save size={17} />

          Save Settings
        </button>

      </div>

    </div>
  );
}