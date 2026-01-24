// src/routes/AppRoutes.jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";

// import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";

/* ================= ADMIN ================= */
import AdminLayout from "../layout/AdminLayout";
import AdminAttendance from "../pages/admin/Attendance";
import Complaint from "../pages/admin/complaints";
import AdminDashboard from "../pages/admin/dashboard";
import FuelManagement from "../pages/admin/fuel-management";
import SupervisorManagement from "../pages/admin/Supervisors";
import TrackVehicle from "../pages/admin/track-vehicles";
import Vehicle from "../pages/admin/vehicles";
import Ward from "../pages/admin/wards";
import WasteCollection from "../pages/admin/WasteCollection";

/* ================= CITIZEN ================= */
import CitizenLayout from "../layout/CitizenLayout";
import CitizenCheckpoint from "../pages/citizen/CitizenCheckpoint";
import CitizenDashboard from "../pages/citizen/CitizenDashboard";
import CitizenPostComplaint from "../pages/citizen/CitizenPostComplaint";
import CitizenTrackInfo from "../pages/citizen/CitizenTrackVehicle";

import OnlineService from "../pages/citizen/OnlineService";

/* ================= SUPERVISOR ================= */

import SupervisorLayout from "../layout/supervisor/SupervisorLayout";
import Login from "../pages/auth/login/Login";
import Analytics from "../pages/supervisor/analytics/Analytics";
import Attendance from "../pages/supervisor/attendance/Attendance";
import Complaints from "../pages/supervisor/complaints/Complaints";
import SupervisorDashboard from "../pages/supervisor/dashboard/SupervisorDashboard";
import MachineryDefect from "../pages/supervisor/machineryDefect/MachineryDefect";
import MoKhataDashboard from "../pages/supervisor/mokhata/MoKhataDashboard";
import Vehicles from "../pages/supervisor/vehicles/Vehicles";
import WealthCenter from "../pages/supervisor/wealthcenter/WealthCenter";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= LOGIN ================= */}
        <Route path="/" element={<Login />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<Complaint />} />
          <Route path="vehicles" element={<Vehicle />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="wards" element={<Ward />} />
          <Route path="supervisors" element={<SupervisorManagement />} />
          <Route path="track-vehicles" element={<TrackVehicle />} />
          <Route path="waste-collection" element={<WasteCollection />} />
          <Route path="fuel-management" element={<FuelManagement />} />
        </Route>

        {/* ================= CITIZEN ROUTES ================= */}
        <Route
          path="/citizen"
          element={
            <ProtectedRoute allowedRoles={["citizen"]}>
              <CitizenLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CitizenDashboard />} />
          <Route path="complaint" element={<CitizenPostComplaint />} />
          <Route path="track" element={<CitizenTrackInfo/>} />
          <Route path="payments" element={<OnlineService/>} />
          <Route path="checkpoint" element={<CitizenCheckpoint/>} />
        </Route>

        {/* ================= SUPERVISOR ROUTES ================= */}
        <Route
          path="/supervisor"
          element={
            <ProtectedRoute allowedRoles={["supervisor"]}>
              {/* <SupervisorLayout /> */}
              <SupervisorLayout/>
            </ProtectedRoute>
          }
        >
          <Route index element={<SupervisorDashboard />} />
          <Route path="dashboard" element={<SupervisorDashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="live-tracking" element={<TrackVehicle />} />
          <Route path="/supervisor/wealthcenter" element={<WealthCenter/>}/>
          <Route path="/supervisor/machinery-defect" element={<MachineryDefect />} />
          <Route path="/supervisor/mokhata" element={<MoKhataDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
