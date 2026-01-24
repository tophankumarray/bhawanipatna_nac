// @ts-nocheck
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  fetchVehicles,
  fetchComplaints,
  fetchWards,
  fetchWasteCollections,
  fetchFuelRecords,
} from "./utils/dashboardApi";

import {
  normalizeComplaintStatus,
  getVehicleStatus,
  safeNumber,
} from "./utils/helpers";

const useAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      waste: 0,
      vehicles: 0,
      activeStaff: 0,
      complaints: 0,
      wards: 0,
      citizens: 0,
    },
    performance: {
      resolvedComplaints: 0,
      totalComplaints: 0,
      collectionRate: 94,
    },
    pending: {},
    wardCoverage: { wards: [] },
    staffPerformance: {},
    routeCompletion: {},
    fuelManagement: {},
    vehicles: {},
    complaints: {},
    recentActivities: [],
    vehicleLocations: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (silent = false, showToast = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);

      /* ---------------- MOCK DATA ---------------- */
      const attendance = [
        { status: "Present" },
        { status: "Present" },
        { status: "Absent" },
        { status: "Leave" },
      ];
      const citizens = Array(120).fill({});

      /* ---------------- API CALLS ---------------- */
      const [
        vehiclesRes,
        complaintsRes,
        wardsRes,
        wasteRes,
        fuelRes,
      ] = await Promise.all([
        fetchVehicles(),
        fetchComplaints(),
        fetchWards(),
        fetchWasteCollections(),
        fetchFuelRecords(),
      ]);

      /* ---------------- SAFE VEHICLE EXTRACTION ---------------- */
      const vehicles =
        Array.isArray(vehiclesRes?.data?.data)
          ? vehiclesRes.data.data
          : Array.isArray(vehiclesRes?.data?.data?.trackings)
          ? vehiclesRes.data.data.trackings
          : Array.isArray(vehiclesRes?.data?.data?.list)
          ? vehiclesRes.data.data.list
          : [];

      if (!Array.isArray(vehicles)) {
        throw new Error("Vehicles is not an array");
      }

      const complaints = complaintsRes?.data?.data || [];
      const wards = wardsRes?.data?.data || [];
      const wasteCollections = wasteRes?.data?.data || [];
      const fuelRecords = fuelRes?.data?.data || [];

      /* ---------------- WARD COVERAGE (WASTE-BASED) ---------------- */
      const wardCoverageData = wards.map((ward) => {
        const wardWaste = wasteCollections.filter((w) => {
          const wasteWardId =
            w?.wardId?._id ||
            w?.ward?._id ||
            w?.wardId ||
            w?.ward;

          return String(wasteWardId) === String(ward._id);
        });

        const target = wardWaste.reduce(
          (s, w) => s + Number(w.targetQuantity || 0),
          0
        );

        const collected = wardWaste.reduce(
          (s, w) =>
            s +
            Number(
              w.collectedQuantity ??
              w.quantityCollected ??
              w.actualQuantity ??
              0
            ),
          0
        );

        const coverage =
          target > 0 ? Math.round((collected / target) * 100) : 0;

        return {
          wardId: ward._id,
          wardName: ward.wardName,
          coverage,
          status:
            coverage >= 80
              ? "good"
              : coverage >= 50
              ? "warning"
              : "critical",
        };
      });


      /* ---------------- TOTAL WASTE ---------------- */
      const totalWaste =
        wasteCollections.reduce(
          (s, w) => s + parseFloat(w?.targetQuantity || 0),
          0
        ) / 1000;

      /* ---------------- ACTIVE VEHICLES ---------------- */
      const activeVehicleNumbers = [
        "OD33AR9619",
        "OD33AR9647",
        "OD07AV6580",
        "OD07AB8906",
        "OD07AB8905",
      ];

      const activeVehicles = vehicles.filter((v) => {
        const reg = (v.registrationNumber || v.truck_number || "")
          .replace(/\s+/g, "")
          .toUpperCase();
        return activeVehicleNumbers.some((n) => reg.includes(n));
      });

      /* ---------------- COMPLAINTS ---------------- */
      const normalizedComplaints = complaints.map((c) => ({
        ...c,
        normalizedStatus: normalizeComplaintStatus(c.status),
      }));

      const pendingCount = normalizedComplaints.filter(
        (c) => c.normalizedStatus === "pending"
      ).length;

      const openCount = normalizedComplaints.filter(
        (c) => c.normalizedStatus === "in-progress"
      ).length;

      const closedCount = normalizedComplaints.filter(
        (c) => c.normalizedStatus === "resolved"
      ).length;

      /* ---------------- FUEL ---------------- */
      const totalFuelCost = fuelRecords.reduce(
        (s, f) =>
          s +
          Number(
            f?.totalCost ??
              (f?.quantityLiters || 0) * (f?.pricePerLiter || 0)
          ),
        0
      );

      const totalFuelQty = fuelRecords.reduce(
        (s, f) => s + Number(f?.quantity || f?.quantityLiters || 0),
        0
      );

      /* ---------------- STATE SET ---------------- */
      setDashboardData({
        stats: {
          waste: safeNumber(totalWaste),
          vehicles: safeNumber(activeVehicles.length),
          activeStaff: safeNumber(
            attendance.filter((a) => a.status === "Present").length
          ),
          complaints: safeNumber(complaints.length),
          wards: safeNumber(wards.length),
          citizens: safeNumber(citizens.length),
        },

        performance: {
          resolvedComplaints: safeNumber(closedCount),
          totalComplaints: safeNumber(complaints.length),
          collectionRate: safeNumber(
            dashboardData.performance?.collectionRate ?? 94
          ),
        },

        pending: {
          pendingComplaints: safeNumber(pendingCount),
          avgResponseTime: "2.4h",
        },

        wardCoverage: {
          wards: wardCoverageData,
        },

        vehicles: {
          running: safeNumber(
            activeVehicles.filter((v) => getVehicleStatus(v) === "running")
              .length
          ),
          standing: safeNumber(
            activeVehicles.filter((v) => getVehicleStatus(v) === "standing")
              .length
          ),
          stopped: safeNumber(
            activeVehicles.filter((v) => getVehicleStatus(v) === "stopped")
              .length
          ),
          dataNotRetrieving: safeNumber(
            activeVehicles.filter(
              (v) => getVehicleStatus(v) === "dataNotRetrieving"
            ).length
          ),
        },

        complaints: {
          pending: safeNumber(pendingCount),
          open: safeNumber(openCount),
          closed: safeNumber(closedCount),
          outOfScope: 0,
        },

        fuelManagement: {
          totalCost: Math.round(totalFuelCost),
          avgCostPerLiter:
            totalFuelQty > 0
              ? Math.round(totalFuelCost / totalFuelQty)
              : 0,
        },

        vehicleLocations: activeVehicles.map((v) => ({
          id: v._id || v.id,
          registrationNumber: v.registrationNumber || v.truck_number,
          status: getVehicleStatus(v),
          lat: v.lat ?? v.latitude,
          lng: v.lng ?? v.longitude,
          speed: safeNumber(v.speed),
          assignedWard: v.address,
        })),
      });

      if (showToast) toast.success("Dashboard refreshed!");
    } catch (e) {
      console.error("DASHBOARD ERROR ⛔", e);
      toast.error("Failed to load dashboard data");
      setError("Offline mode");
    } finally {
      setLoading(false);
    }
  };

  return { dashboardData, loading, error, fetchDashboardData };
};

export default useAdminDashboard;
