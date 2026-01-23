// @ts-nocheck
import { useEffect, useState } from "react";
import api from "../../../api/mockAPI";

import AnalyticsHeader from "./components/AnalyticsHeader";
import KpiGrid from "./components/KpiGrid";
import VehicleStatusPie from "./components/VehicleStatusPie";
import ComplaintStatusBar from "./components/ComplaintStatusBar";
import WardPerformance from "./components/WardPerformance";

import {
  buildComplaintStatusData,
  buildVehicleStatusData,
  buildWardPerformance,
} from "./utils/buildAnalyticsData";

const Analytics = () => {
  const [vehicleData, setVehicleData] = useState([]);
  const [complaintData, setComplaintData] = useState([]);
  const [wardPerformance, setWardPerformance] = useState([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [vehiclesRes, complaintsRes] = await Promise.all([
          api.get("/vehicles"),
          api.get("/complaints"),
        ]);

        const vehicles = vehiclesRes.data || [];
        const complaints = complaintsRes.data || [];

        setVehicleData(buildVehicleStatusData(vehicles));
        setComplaintData(buildComplaintStatusData(complaints));
        setWardPerformance(buildWardPerformance(vehicles));
      } catch (err) {
        console.log("Analytics Error:", err);
      }
    };

    loadAnalytics();
  }, []);

  const totalVehicles = vehicleData.reduce((s, v) => s + (v.value || 0), 0);
  const runningVehicles = vehicleData.find((v) => v.name === "running")?.value || 0;
  const totalComplaints = complaintData.reduce((s, c) => s + (c.count || 0), 0);
  const resolved = complaintData.find((c) => c.name === "Resolved")?.count || 0;

  const resolutionRate = totalComplaints
    ? `${Math.round((resolved / totalComplaints) * 100)}%`
    : "0%";

  const KPI_VALUES = {
    totalVehicles,
    runningVehicles,
    totalComplaints,
    resolutionRate,
  };

  return (
    <div className="space-y-8">
      <AnalyticsHeader />

      <KpiGrid values={KPI_VALUES} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <VehicleStatusPie data={vehicleData} />
        <ComplaintStatusBar data={complaintData} />
      </div>

      <WardPerformance data={wardPerformance} />

      <p className="text-xs text-gray-500 text-center">
        Data shown is system-generated and updated periodically. This analytics
        module supports operational review and decision-making.
      </p>
    </div>
  );
};

export default Analytics;
