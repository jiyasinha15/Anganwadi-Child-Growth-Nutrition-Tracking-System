import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();

  const menuItems = [
    {
      path: "/admin",
      name: "Dashboard",
      icon: LayoutDashboard
    },
    {
      path: "/admin/centres",
      name: "Anganwadi Centres",
      icon: Building2
    },
    {
      path: "/admin/workers",
      name: "Manage Workers",
      icon: Users
    },
    {
      path: "/admin/reports",
      name: "Reports",
      icon: BarChart3
    },
    {
      path: "/admin/settings",
      name: "Settings",
      icon: Settings
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/");
  };

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar admin-sidebar">

        {/* BRAND */}
        <div className="brand">
          <div className="brand-icon">
            🛡️
          </div>

          <div className="brand-text">
            <strong>Anganwadi</strong>
            <span>Admin Portal</span>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="admin-nav">

          <div className="nav-heading">
            ADMIN MENU
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

        </nav>

        {/* SIDEBAR BOTTOM */}
        <div className="sidebar-bottom">

          <div className="admin-user-mini">
            <div className="mini-avatar">
              AD
            </div>

            <div>
              <strong>Administrator</strong>
              <small>System Admin</small>
            </div>
          </div>

          <button
            className="logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="main">

        {/* TOPBAR */}
        <header className="topbar">

          <div className="topbar-title">
            <h2>Anganwadi Management System</h2>
            <p>Administrator Portal</p>
          </div>

          <div className="worker">

            <span className="avatar">
              AD
            </span>

            <div>
              <b>Administrator</b>
              <small>System Admin</small>
            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <section className="content">
          <Outlet />
        </section>

      </main>

    </div>
  );
}