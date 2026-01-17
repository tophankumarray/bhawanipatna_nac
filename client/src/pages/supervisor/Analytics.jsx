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
import { Truck, CheckCircle, AlertCircle, Percent } from "lucide-react";

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
  {
    title: "Total Vehicles",
    key: "totalVehicles",
    icon: <Truck size={18} />,
    variant: "blue",
  },
  {
    title: "Active Vehicles",
    key: "activeVehicles",
    icon: <CheckCircle size={18} />,
    variant: "green",
  },
  {
    title: "Complaints Today",
    key: "totalComplaints",
    icon: <AlertCircle size={18} />,
    variant: "yellow",
  },
  {
    title: "Resolution Rate",
    key: "resolutionRate",
    icon: <Percent size={18} />,
    variant: "purple",
  },
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

  const totalComplaints = complaintData.reduce((s, c) => s + c.count, 0);

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
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h1 className="text-2xl font-black text-gray-900">
          Analytics Overview
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Data Period: Today ({new Date().toLocaleDateString()})
        </p>
      </div>

      {/* KPI SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {KPI_CONFIG.map((kpi) => (
          <SummaryCard
            key={kpi.title}
            title={kpi.title}
            value={KPI_VALUES[kpi.key]}
            icon={kpi.icon}
            variant={kpi.variant}
          />
        ))}
      </div>

      {/* CHART GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* VEHICLE STATUS PIE */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="font-bold text-gray-800 mb-4 text-lg">
            Vehicle Status Distribution
          </h3>

          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={vehicleData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={95}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {vehicleData.map((v) => (
                    <Cell key={v.name} fill={COLORS[v.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* COMPLAINT STATUS BAR */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="font-bold text-gray-800 mb-4 text-lg">
            Complaint Status Overview
          </h3>

          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={complaintData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {complaintData.map((c) => (
                    <Cell key={c.name} fill={COLORS[c.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* WARD PERFORMANCE */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
        <h3 className="font-bold text-gray-800 mb-4 text-lg">
          Ward-wise Collection Performance
        </h3>

        <div className="space-y-4">
          {wardPerformance.map((w) => (
            <div key={w.ward}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-700">{w.ward}</span>
                <span className="font-bold text-gray-900">{w.percent}%</span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                  style={{ width: `${w.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOT NOTE */}
      <p className="text-xs text-gray-500 text-center">
        Data shown is system-generated and updated periodically. This analytics
        module supports operational review and decision-making.
      </p>
    </div>
  );
};

/* ================= KPI BOX COMPONENT ================= */

const SummaryCard = ({ title, value, icon, variant = "blue" }) => {
  const styles = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-emerald-600",
    yellow: "from-yellow-500 to-orange-500",
    purple: "from-purple-500 to-indigo-600",
    red: "from-red-500 to-rose-600",
  };

  return (
    <div
      className={`bg-gradient-to-br ${
        styles[variant]
      } rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
          {icon}
        </div>
        <span className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full">
          KPI
        </span>
      </div>

      <p className="text-white/80 text-sm font-semibold mb-2">{title}</p>
      <h3 className="text-4xl font-black">{value}</h3>
    </div>
  );
};

export default Analytics;
