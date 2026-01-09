// @ts-nocheck
import { useEffect, useState } from "react";
import api from "../../api/api";
export default function CitizenDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
  });

  useEffect(() => {
    // TODO: replace with real API
    // setStats({ total: 2, resolved: 0, pending: 2 });

    const loadStats = async () => {
      try {
        const res = await api.get("/complaints");
        const complaints = res.data || [];

        const total = complaints.length;

        const resolved = complaints.filter((c) =>
          ["resolved", "done"].includes(c.status?.toLowerCase())
        ).length;

        const pending = complaints.filter((c) =>
          ["pending", "started", "in progress", "in-progress"].includes(
            c.status?.toLowerCase()
          )
        ).length;

        setStats({ total, resolved, pending });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };

    loadStats();
  }, []);

  /* =========================
     CONFIG DATA (CUSTOMIZABLE)
     ========================= */

  const statCards = [
    {
      label: "Total Complaints",
      value: stats.total,
      gradient: "from-emerald-400 to-emerald-500",
    },
    {
      label: "Resolved Complaints",
      value: stats.resolved,
      gradient: "from-sky-400 to-sky-500",
    },
    {
      label: "Pending Complaints",
      value: stats.pending,
      gradient: "from-orange-400 to-orange-500",
    },
  ];

  const recentActivities = [
    {
      title: "Complaint C-101 created",
      description: "Garbage not collected from your street.",
      time: "Today",
    },
    {
      title: "Vehicle arrival alert",
      description: "Vehicle will reach your area in 15 minutes.",
      time: "Today",
    },
  ];

  const quickActions = [
    {
      label: "Post a Complaint",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Track Vehicle",
      gradient: "from-sky-500 to-sky-600",
    },
    {
      label: "Online Service Booking and Payments",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      label: "View My Complaints",
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">
          Citizen Dashboard
        </h1>
        <p className="mt-2 text-gray-600 text-sm md:text-base">
          Track waste collection, report issues, and help keep our city clean.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.gradient} rounded-3xl p-5 shadow-md text-white flex flex-col justify-between`}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
                {card.label}
              </p>
              <p className="mt-3 text-3xl font-extrabold">{card.value}</p>
            </div>
            <button className="mt-4 inline-flex items-center text-xs font-medium bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full">
              View Details →
            </button>
          </div>
        ))}
      </div>

      {/* LOWER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <section className="lg:col-span-2 bg-white rounded-3xl shadow p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Activity
            </h2>
            <span className="text-xs text-gray-500">
              Latest updates on complaints and collections
            </span>
          </div>

          <ul className="space-y-3 text-sm">
            {recentActivities.map((activity, index) => (
              <li key={index} className="flex justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.description}
                  </p>
                </div>
                <span className="text-[11px] text-gray-400">
                  {activity.time}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Quick Actions */}
        <section className="bg-white rounded-3xl shadow p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Quick Actions
          </h2>

          <div className="flex flex-col gap-3 text-sm">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`w-full text-left px-4 py-3 rounded-2xl bg-gradient-to-r ${action.gradient} text-white font-medium shadow hover:shadow-md`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
