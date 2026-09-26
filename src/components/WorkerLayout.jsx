import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Baby,
  UserPlus,
  TrendingUp,
  Apple,
  ClipboardCheck,
  BarChart3,
  LogOut
} from "lucide-react";

export default function WorkerLayout() {
  const navigate = useNavigate();

  const menuItems = [
    {
      path: "/worker",
      name: "Dashboard",
      icon: LayoutDashboard
    },
    {
      path: "/children",
      name: "Children",
      icon: Baby
    },
    {
      path: "/children/new",
      name: "Register Child",
      icon: UserPlus
    },
    {
      path: "/growth",
      name: "Growth Monitoring",
      icon: TrendingUp
    },
    {
      path: "/nutrition",
      name: "Nutrition",
      icon: Apple
    },
    {
      path: "/followups",
      name: "Follow-ups",
      icon: ClipboardCheck
    },
    {
      path: "/reports",
      name: "Reports",
      icon: BarChart3
    }
  ];

  return (
    <div className="app">

      <aside className="sidebar">

        {/* BRAND */}
        <div className="brand">

          <div className="brand-icon">
            🌿
          </div>

          <div>
            <strong>
              Anganwadi
            </strong>

            <span>
              Worker Portal
            </span>
          </div>

        </div>


        {/* NAVIGATION */}
        <nav>

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/worker"}
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
              Child Growth & Nutrition Tracking
            </h2>

            <p>
              Anganwadi Worker Portal
            </p>

          </div>


          <div className="worker">

            <span className="avatar">
              AW
            </span>

            <div>

              <b>
                Anganwadi Worker
              </b>

              <small>
                Centre - 01
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