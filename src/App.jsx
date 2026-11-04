import { lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import WorkerLayout from "./components/WorkerLayout";
import AdminLayout from "./components/AdminLayout";
import RoleSelection from "./pages/RoleSelection";
import AdminLogin from "./pages/AdminLogin";
import WorkerLogin from "./pages/WorkerLogin";
import { useSession } from "./lib/session";

const WorkerDashboard = lazy(() => import("./pages/WorkerDashboard"));
const Children = lazy(() => import("./pages/Children"));
const ChildProfile = lazy(() => import("./pages/ChildProfile"));
const RegisterChild = lazy(() => import("./pages/RegisterChild"));
const AddMeasurement = lazy(() => import("./pages/AddMeasurement"));
const Growth = lazy(() => import("./pages/Growth"));
const Nutrition = lazy(() => import("./pages/Nutrition"));
const FollowUps = lazy(() => import("./pages/FollowUps"));
const Insights = lazy(() => import("./pages/Insights"));
const Reports = lazy(() => import("./pages/Reports"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminCentres = lazy(() => import("./pages/AdminCentres"));
const AdminWorkers = lazy(() => import("./pages/AdminWorkers"));
const AdminReports = lazy(() => import("./pages/AdminReports"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const WorkerRegister = lazy(() => import("./pages/WorkerRegister"));
const AdminCentreDetail = lazy(() => import("./pages/AdminCentreDetail"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Profile = lazy(() => import("./pages/Profile"));

// Demo-only route guard: sends signed-out visitors to the matching sign-in page.
function RequireRole({ role }) {
  const session = useSession();
  if (!session) return <Navigate to={role === "admin" ? "/admin-login" : "/worker-login"} replace />;
  if (session.role !== role) return <Navigate to={session.role === "admin" ? "/admin" : "/worker"} replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/worker-login" element={<WorkerLogin />} />
      <Route path="/worker-register" element={<WorkerRegister />} />

      <Route element={<RequireRole role="worker" />}>
        <Route element={<WorkerLayout />}>
          <Route path="/worker" element={<WorkerDashboard />} />
          <Route path="/children" element={<Children />} />
          <Route path="/children/new" element={<RegisterChild />} />
          <Route path="/children/:id" element={<ChildProfile />} />
          <Route path="/children/:id/measurement" element={<AddMeasurement />} />
          <Route path="/growth" element={<Growth />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/followups" element={<FollowUps />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<RequireRole role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/centres" element={<AdminCentres />} />
          <Route path="/admin/centres/:id" element={<AdminCentreDetail />} />
          <Route path="/admin/workers" element={<AdminWorkers />} />
          <Route path="/admin/notifications" element={<Notifications />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
