import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/mockAPI";

import DashboardAlert from "./components/DashboardAlert";
import DashboardHeader from "./components/DashboardHeader";
import KpiGrid from "./components/KpiGrid";
import WeeklyTrendChart from "./components/WeeklyTrendChart";
import VehicleStatusList from "./components/VehicleStatusList";
import WardPerformance from "./components/WardPerformance";
import QuickActions from "./components/QuickActions";

import { fallbackTrend, getKpiConfig, QUICK_ACTIONS } from "./dashboardConfig";

const SupervisorDashboard = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [wards, setWards] = useState([]);
  const [collectionTrend, setCollectionTrend] = useState(fallbackTrend);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [vehicleRes, complaintRes] = await Promise.all([
          api.get("/vehicles"),
          api.get("/complaints"),
        ]);

        setVehicles(vehicleRes.data || []);
        setComplaints(complaintRes.data || []);
      } catch (err) {
        console.error("Dashboard API Error", err);
      }
    };

    loadData();
  }, []);

  const activeComplaints = complaints.filter(
    (c) => c.status === "pending" || c.status === "in-progress"
  ).length;

  const inProgress = complaints.filter((c) => c.status === "in-progress").length;

  const resolved = complaints.filter((c) => c.status === "resolved").length;

  useEffect(() => {
    if (!complaints.length) return;

    const wardMap = {};

    complaints.forEach((c) => {
      if (!wardMap[c.ward]) {
        wardMap[c.ward] = { total: 0, resolved: 0 };
      }
      wardMap[c.ward].total += 1;
      if (c.status === "resolved") {
        wardMap[c.ward].resolved += 1;
      }
    });

    const wardStats = Object.keys(wardMap).map((ward) => ({
      name: ward,
      percent: Math.round((wardMap[ward].resolved / wardMap[ward].total) * 100),
    }));

    setWards(wardStats);
  }, [complaints]);

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
