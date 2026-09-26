import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();

  const menuItems = [
    {
      path: "/admin",
      name: "Admin Dashboard",
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

  return (
    <div className="app">

      <aside className="sidebar admin-sidebar">

        {/* BRAND */}
        <div className="brand">

          <div className="brand-icon">
            🛡️
          </div>

          <div>
            <strong>
              Anganwadi
            </strong>

            <span>
              Admin Portal
            </span>
          </div>

        </div>


        {/* ADMIN NAVIGATION */}
        <nav>

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

                <span>
                  {item.name}
                </span>

              </NavLink>
            );

          })}

        </nav>


        {/* LOGOUT */}
        <button
          className="logout"
          onClick={() =>
            navigate("/")
          }
        >

          <LogOut size={18} />

          <span>
            Logout
          </span>

        </button>

      </aside>


      {/* MAIN */}
      <main className="main">

        <header className="topbar">

          <div>

            <h2>
              Anganwadi Management System
            </h2>

            <p>
              Administrator Portal
            </p>

          </div>


          <div className="worker">

            <span className="avatar">
              AD
            </span>

            <div>

              <b>
                Administrator
              </b>

              <small>
                System Admin
              </small>

            </div>

          </div>

        </header>


        <section className="content">
          <Outlet />
        </section>

      </main>

    </div>
  );
}