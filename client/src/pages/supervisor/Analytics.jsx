// @ts-nocheck
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../../api/api";

/* ================= CONFIG ================= */

const COLORS = {
  Active: "#22c55e",
  Inactive: "#ef4444",
  Maintenance: "#facc15",
  Pending: "#ef4444",
  "In Progress": "#facc15",
  Resolved: "#22c55e",
};

const VEHICLE_STATUSES = ["Active", "Inactive", "Maintenance"];
const COMPLAINT_STATUSES = ["Pending", "In Progress", "Resolved"];

const KPI_CONFIG = [
  { title: "Total Vehicles", key: "totalVehicles" },
  { title: "Active Vehicles", key: "activeVehicles", color: "text-green-600" },
  { title: "Complaints Today", key: "totalComplaints" },
  { title: "Resolution Rate", key: "resolutionRate", color: "text-green-700" },
];

/* ================= COMPONENT ================= */

const Analytics = () => {
  const [vehicleData, setVehicleData] = useState([]);
  const [complaintData, setComplaintData] = useState([]);
  const [wardPerformance, setWardPerformance] = useState([]);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [vehiclesRes, complaintsRes] = await Promise.all([
          api.get("/vehicles"),
          api.get("/complaints"),
        ]);

        /* -------- VEHICLE STATUS -------- */
        const vehicleStatusCount = VEHICLE_STATUSES.reduce((acc, s) => {
          acc[s] = 0;
          return acc;
        }, {});

        vehiclesRes.data.forEach((v) => {
          vehicleStatusCount[v.status] =
            (vehicleStatusCount[v.status] || 0) + 1;
        });

        setVehicleData(
          VEHICLE_STATUSES.map((s) => ({
            name: s,
            value: vehicleStatusCount[s],
          }))
        );

        /* -------- COMPLAINT STATUS -------- */
        const complaintStatusCount = COMPLAINT_STATUSES.reduce((acc, s) => {
          acc[s] = 0;
          return acc;
        }, {});

        complaintsRes.data.forEach((c) => {
          complaintStatusCount[c.status] =
            (complaintStatusCount[c.status] || 0) + 1;
        });

        setComplaintData(
          COMPLAINT_STATUSES.map((s) => ({
            name: s,
            count: complaintStatusCount[s],
          }))
        );

        /* -------- WARD PERFORMANCE (SIMULATED %) -------- */
        const wardMap = {};

        vehiclesRes.data.forEach((v) => {
          if (!wardMap[v.ward]) {
            wardMap[v.ward] = 70 + Math.floor(Math.random() * 25);
          }
        });

        setWardPerformance(
          Object.keys(wardMap).map((w) => ({
            ward: w,
            percent: wardMap[w],
          }))
        );
      } catch (err) {
        console.error("Failed to load analytics");
      }
    };

    loadAnalytics();
  }, []);

  /* ================= KPI VALUES ================= */

  const totalVehicles = vehicleData.reduce((s, v) => s + v.value, 0);
  const activeVehicles =
    vehicleData.find((v) => v.name === "Active")?.value || 0;

  const totalComplaints = complaintData.reduce(
    (s, c) => s + c.count,
    0
  );

  const resolved =
    complaintData.find((c) => c.name === "Resolved")?.count || 0;

  const resolutionRate = totalComplaints
    ? `${Math.round((resolved / totalComplaints) * 100)}%`
    : "0%";

  const KPI_VALUES = {
    totalVehicles,
    activeVehicles,
    totalComplaints,
    resolutionRate,
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Analytics Overview
        </h1>
        <p className="text-sm text-gray-500">
          Data Period: Today ({new Date().toLocaleDateString()})
        </p>
      </div>

      {/* KPI SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPI_CONFIG.map((kpi) => (
          <SummaryCard
            key={kpi.title}
            title={kpi.title}
            value={KPI_VALUES[kpi.key]}
            color={kpi.color}
          />
        ))}
      </div>

      {/* CHART GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* VEHICLE STATUS PIE */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">
            Vehicle Status Distribution
          </h3>

          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={vehicleData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {vehicleData.map((v) => (
                    <Cell
                      key={v.name}
                      fill={COLORS[v.name]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* COMPLAINT STATUS BAR */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">
            Complaint Status Overview
          </h3>

          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={complaintData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {complaintData.map((c) => (
                    <Cell
                      key={c.name}
                      fill={COLORS[c.name]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* WARD PERFORMANCE */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold mb-4">
          Ward-wise Collection Performance
        </h3>

        <div className="space-y-4">
          {wardPerformance.map((w) => (
            <div key={w.ward}>
              <div className="flex justify-between text-sm mb-1">
                <span>{w.ward}</span>
                <span className="font-medium">
                  {w.percent}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-green-600 rounded"
                  style={{ width: `${w.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOT NOTE */}
      <p className="text-xs text-gray-500">
        Data shown is system-generated and updated periodically.
        This analytics module supports operational review and
        decision-making.
      </p>
    </div>
  );
};

/* ================= SMALL COMPONENT ================= */

const SummaryCard = ({ title, value, color }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <p className="text-xs text-gray-500">{title}</p>
    <h3 className={`text-2xl font-bold ${color || ""}`}>
      {value}
    </h3>
  </div>
);

export default Analytics;
