// @ts-nocheck
import { useEffect, useState } from "react";
import api from "../../api/api.js";
import { FileText, CheckCircle, Clock } from "lucide-react";

export default function CitizenDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
  });

  useEffect(() => {
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
     CONFIG DATA
     ========================= */

  const statCards = [
    {
      label: "Total",
      value: stats.total,
      gradient: "from-emerald-400 to-emerald-500",
      icon: FileText,
    },
    {
      label: "Resolved",
      value: stats.resolved,
      gradient: "from-sky-400 to-sky-500",
      icon: CheckCircle,
    },
    {
      label: "Pending",
      value: stats.pending,
      gradient: "from-orange-400 to-orange-500",
      icon: Clock,
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
    { label: "Post a Complaint", gradient: "from-emerald-500 to-emerald-600" },
    { label: "Track Vehicle", gradient: "from-sky-500 to-sky-600" },
    {
      label: "Service Booking & Payment",
      gradient: "from-orange-500 to-orange-600",
    },
    { label: "My Complaints", gradient: "from-purple-500 to-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-extrabold text-green-700">
          Citizen Dashboard
        </h1>
        <p className="mt-2 text-gray-600 text-sm">
          Track waste collection and manage complaints efficiently.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="flex gap-4 mb-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.gradient} h-48 w-48 rounded-2xl p-3 shadow-lg text-white flex flex-col justify-between relative`}
            >
              {/* Icon */}
              <div className="absolute top-2 right-2 bg-white/20 p-1.5 rounded-lg">
                <Icon className="w-4 h-4" />
              </div>

              {/* Content */}
              <div>
                <p className="text-[10px] uppercase font-semibold opacity-90">
                  {card.label}
                </p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>

              <button className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md transition">
                View
              </button>
            </div>
          );
        })}
      </div>

      {/* LOWER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <section className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6 border-t-4 border-emerald-400">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              Recent Activity
            </h2>
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
              Latest
            </span>
          </div>

          <ul className="space-y-4 text-sm">
            {recentActivities.map((activity, index) => (
              <li
                key={index}
                className="flex justify-between p-4 bg-gray-50 rounded-2xl"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {activity.time}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Quick Actions */}
        <section className="bg-white rounded-3xl shadow-lg p-6 border-t-4 border-blue-400">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>

          <div className="flex flex-col gap-3 text-sm">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`px-4 py-3 rounded-2xl bg-gradient-to-r ${action.gradient} text-white font-semibold shadow hover:scale-105 transition`}
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
