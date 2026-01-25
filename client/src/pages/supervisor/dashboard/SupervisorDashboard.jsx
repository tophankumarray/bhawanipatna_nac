import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";

import DashboardAlert from "./components/DashboardAlert";
import DashboardHeader from "./components/DashboardHeader";
import KpiGrid from "./components/KpiGrid";
import WeeklyTrendChart from "./components/WeeklyTrendChart";
import VehicleStatusList from "./components/VehicleStatusList";
import WardPerformance from "./components/WardPerformance";
import QuickActions from "./components/QuickActions";

import { fallbackTrend, getKpiConfig, QUICK_ACTIONS } from "./dashboardConfig";

// ✅ same as vehicles page
import { normalizeVehicles } from "../vehicles/utils/normalizeVehicles";
import { ALLOWED_VEHICLES } from "../vehicles/vehiclesConfig";

const SupervisorDashboard = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [wards, setWards] = useState([]);
  const [collectionTrend] = useState(fallbackTrend);

  // ✅ normalize complaint status (fix: in progress not showing)
  const normalizeStatus = (st) =>
    String(st || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-"); // "in progress" -> "in-progress"

  useEffect(() => {
    const loadData = async () => {
      try {
        const results = await Promise.allSettled([
          api.get("/tracking/trackings"),
          api.get("/complaints/allcomplaints"),
        ]);

        // ✅ VEHICLES
        if (results[0].status === "fulfilled") {
          const list = results[0]?.value?.data?.data?.list || [];

          const normalized = normalizeVehicles(list);

          // ✅ only show allowed 5 vehicles
          const allowedVehicles = normalized.filter((v) =>
            ALLOWED_VEHICLES.has(v.registrationNumber)
          );

          setVehicles(allowedVehicles);
        } else {
          console.log("Tracking API failed:", results[0].reason);
          setVehicles([]);
        }

        // ✅ COMPLAINTS
        if (results[1].status === "fulfilled") {
          const raw =
            results[1]?.value?.data?.data ||
            results[1]?.value?.data ||
            [];

          // ensure array
          const complaintArray = Array.isArray(raw) ? raw : [];

          // normalize status for safe filtering
          const normalizedComplaints = complaintArray.map((c) => ({
            ...c,
            status: normalizeStatus(c.status),
          }));

          setComplaints(normalizedComplaints);
        } else {
          console.log("Complaints API failed:", results[1].reason);
          setComplaints([]);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
        setVehicles([]);
        setComplaints([]);
      }
    };

    loadData();
  }, []);

  // ✅ Complaint counts (fixed)
  const activeComplaints = complaints.filter((c) => {
    const st = normalizeStatus(c.status);
    return st === "pending" || st === "in-progress";
  }).length;

  const inProgress = complaints.filter(
    (c) => normalizeStatus(c.status) === "in-progress"
  ).length;

  const resolved = complaints.filter(
    (c) => normalizeStatus(c.status) === "resolved"
  ).length;

  // ✅ Ward performance based on complaints
  useEffect(() => {
    if (!complaints.length) {
      setWards([]);
      return;
    }

    const wardMap = {};

    complaints.forEach((c) => {
      const ward = String(c.ward || c.assignedWard || "Unknown").trim();

      if (!wardMap[ward]) {
        wardMap[ward] = { total: 0, resolved: 0 };
      }

      wardMap[ward].total += 1;

      if (normalizeStatus(c.status) === "resolved") {
        wardMap[ward].resolved += 1;
      }
    });

    const wardStats = Object.keys(wardMap).map((ward) => ({
      name: ward,
      percent: Math.round((wardMap[ward].resolved / wardMap[ward].total) * 100),
    }));

    setWards(wardStats);
  }, [complaints]);

  // ✅ KPI values
  const kpis = getKpiConfig({
    vehiclesCount: vehicles.length,
    activeComplaints,
    inProgress,
    resolved,
  });

  return (
    <div className="space-y-8 bg-emerald-50 p-6 rounded-3xl">
      <DashboardAlert vehiclesCount={vehicles.length} />

      <DashboardHeader />

      <KpiGrid kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WeeklyTrendChart data={collectionTrend} />
        <VehicleStatusList vehicles={vehicles} />
      </div>

      <WardPerformance wards={wards} />

      <QuickActions actions={QUICK_ACTIONS} onNavigate={navigate} />
    </div>
  );
};

export default SupervisorDashboard;
