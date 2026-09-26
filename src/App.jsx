import React from "react";
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import WorkerLayout from "./components/WorkerLayout";
import AdminLayout from "./components/AdminLayout";

import RoleSelection from "./pages/RoleSelection";
import AdminLogin from "./pages/AdminLogin";
import WorkerLogin from "./pages/WorkerLogin";

import WorkerDashboard from "./pages/WorkerDashboard";

import Children from "./pages/Children";
import ChildProfile from "./pages/ChildProfile";
import RegisterChild from "./pages/RegisterChild";
import AddMeasurement from "./pages/AddMeasurement";
import Growth from "./pages/Growth";
import Nutrition from "./pages/Nutrition";
import FollowUps from "./pages/FollowUps";
import Reports from "./pages/Reports";

import AdminDashboard from "./pages/AdminDashboard";
import AdminCentres from "./pages/AdminCentres";
import AdminWorkers from "./pages/AdminWorkers";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";


export default function App() {

  return (
    <Routes>

      {/* =========================
          ROLE SELECTION
      ========================== */}

      <Route
        path="/"
        element={<RoleSelection />}
      />


      {/* =========================
          LOGIN
      ========================== */}

      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />

      <Route
        path="/worker-login"
        element={<WorkerLogin />}
      />


      {/* =========================
          WORKER PORTAL
      ========================== */}

      <Route element={<WorkerLayout />}>

        <Route
          path="/worker"
          element={<WorkerDashboard />}
        />

        <Route
          path="/children"
          element={<Children />}
        />

        <Route
          path="/children/new"
          element={<RegisterChild />}
        />

        <Route
          path="/children/:id"
          element={<ChildProfile />}
        />

        <Route
          path="/children/:id/measurement"
          element={<AddMeasurement />}
        />

        <Route
          path="/growth"
          element={<Growth />}
        />

        <Route
          path="/nutrition"
          element={<Nutrition />}
        />

        <Route
          path="/followups"
          element={<FollowUps />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

      </Route>


      {/* =========================
          ADMIN PORTAL
      ========================== */}

      <Route element={<AdminLayout />}>

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/centres"
          element={<AdminCentres />}
        />

        <Route
          path="/admin/workers"
          element={<AdminWorkers />}
        />

        <Route
          path="/admin/reports"
          element={<AdminReports />}
        />

        <Route
          path="/admin/settings"
          element={<AdminSettings />}
        />

      </Route>


      {/* =========================
          INVALID URL
      ========================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}