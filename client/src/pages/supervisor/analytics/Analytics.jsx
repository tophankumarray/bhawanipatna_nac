// @ts-nocheck
import { useEffect, useState } from "react";
import api from "../../../api/api";

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
import { ALLOWED_VEHICLES } from "../vehicles/vehiclesConfig";

const Analytics = () => {
  const [vehicleData, setVehicleData] = useState([]);
  const [complaintData, setComplaintData] = useState([]);
  const [wardPerformance, setWardPerformance] = useState([]);

  // ✅ detect vehicle status from tracking item
  const getVehicleStatus = (item) => {
    const raw =
      item?.status ||
      item?.truck_status ||
      item?.vehicle_status ||
      item?.device_status ||
      item?.state ||
      "";

    const st = String(raw).toLowerCase().trim();

    // direct matching
    if (st.includes("run")) return "running";
    if (st.includes("stand")) return "standing";
    if (st.includes("stop")) return "stopped";

    // fallback using ignition
    const ignition = item?.is_ignition_on?.value;
    if (ignition === true) return "running";

    return "stopped";
  };

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [trackingRes, complaintsRes] = await Promise.all([
          api.get("/tracking/trackings"),
          api.get("/complaints/allcomplaints"),
        ]);

        const trackingList = trackingRes?.data?.data?.list || [];

        const complaints =
          complaintsRes?.data?.data || complaintsRes?.data || [];

        // ✅ Safety check
        const safeTrackingList = Array.isArray(trackingList) ? trackingList : [];

// ✅ ONLY allowed 5 vehicles
const filteredTrackingList = safeTrackingList.filter((item) =>
  ALLOWED_VEHICLES.has(String(item?.truck_no || item?.truck_number || "").trim())
);

        const safeComplaints = Array.isArray(complaints) ? complaints : [];

        // ✅ Normalize Vehicles for analytics utils
       const normalizedVehicles = filteredTrackingList.map((item) => ({
          status: getVehicleStatus(item),
          assignedWard: item?.address || "Unknown",
          ward: item?.address || "Unknown",
        }));

        // ✅ Normalize complaints status
        const normalizedComplaints = safeComplaints.map((c) => ({
          ...c,
          status: String(c?.status || "").toLowerCase().trim(),
        }));

        setVehicleData(buildVehicleStatusData(normalizedVehicles));
        setComplaintData(buildComplaintStatusData(normalizedComplaints));
        setWardPerformance(buildWardPerformance(normalizedVehicles));
      } catch (err) {
        console.log("Analytics Error:", err);
        setVehicleData([]);
        setComplaintData([]);
        setWardPerformance([]);
      }
    };

    loadAnalytics();
  }, []);

  // ✅ KPI calculations
  const totalVehicles = vehicleData.reduce((s, v) => s + (v.value || 0), 0);

  const runningVehicles =
    vehicleData.find((v) => v.name === "running")?.value || 0;

  const totalComplaints = complaintData.reduce((s, c) => s + (c.count || 0), 0);

  const resolved =
    complaintData.find((c) => c.name === "resolved")?.count || 0;

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
