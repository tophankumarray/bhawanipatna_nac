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

const buildRecentActivities = ({
  complaints = [],
  wasteCollections = [],
  fuelRecords = [],
}) => {
  const activities = [];

  // Complaints
  complaints.forEach((c) => {
    activities.push({
      message: `Complaint raised in Ward ${c.wardNumber} (${c.category})`,
      type:
        c.status === "Resolved"
          ? "success"
          : c.status === "Pending"
          ? "warning"
          : "info",
      timestamp: new Date(c.createdAt).toLocaleString("en-IN"),
      rawDate: c.createdAt,
    });
  });

  // Waste collection
  wasteCollections.forEach((w) => {
    activities.push({
      message: `Waste collected in Ward ${w.wardNumber || w.ward}`,
      type: "success",
      timestamp: new Date(w.createdAt).toLocaleString("en-IN"),
      rawDate: w.createdAt,
    });
  });

  // Fuel management
  fuelRecords.forEach((f) => {
    activities.push({
      message: `Fuel issued to vehicle ${f.vehicleNumber || f.registrationNumber}`,
      type: "warning",
      timestamp: new Date(f.createdAt).toLocaleString("en-IN"),
      rawDate: f.createdAt,
    });
  });

  return activities
    .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate))
    .slice(0, 10);
};

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


      
      /* ---------------- RECENT ACTIVITY ---------------- */
      const recentActivities = buildRecentActivities({
        complaints,
        wasteCollections,
        fuelRecords,
      });
      /* ---------------- WARD COVERAGE (WARD MODEL BASED) ---------------- */
      const wardCoverageData = wards.map((ward) => {
        const wastePerHousehold =
          ward.household > 0
            ? ward.wasteGenerationPerDay / ward.household
            : 0;

        let capacityFactor = 1;
        if (ward.collectionFrequency === "Alternate Day") capacityFactor = 0.7;
        if (ward.collectionFrequency === "Weekly") capacityFactor = 0.4;

        // Estimated coverage %
        const estimatedCoverage = Math.round(
          Math.min(wastePerHousehold * capacityFactor * 50, 100)
        );

        let status = "critical";
        if (
          ward.collectionFrequency === "Daily" &&
          wastePerHousehold <= 2
        ) {
          status = "good";
        } else if (
          ward.collectionFrequency === "Alternate Day" ||
          wastePerHousehold <= 3
        ) {
          status = "warning";
        }

        return {
          wardId: ward._id,
          wardName: ward.wardName,
          coverage: estimatedCoverage,
          status, // good | warning | critical
          wastePerDay: ward.wasteGenerationPerDay,
          households: ward.household,
          frequency: ward.collectionFrequency,
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
        recentActivities,

        vehicleLocations: activeVehicles
          .map((v) => {
            const lat = Number(v.lat ?? v.latitude);
            const lng = Number(v.lng ?? v.longitude);

            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

            return {
              id: v._id || v.id,
              registrationNumber: v.registrationNumber || v.truck_number,
              status: getVehicleStatus(v),
              speed: safeNumber(v.speed),
              assignedWard: v.address,
              signalStrength: v.signal_strength,
              ignitionOn: v.is_ignition_on?.value,
              lastUpdated: v.updatedAt || v.device_timestamp,

              // ✅ THIS IS THE KEY FIX
              location: {
                lat,
                lng,
              },
            };
          })
          .filter(Boolean),

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
