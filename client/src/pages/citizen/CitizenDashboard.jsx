// @ts-nocheck
import { useEffect, useState } from "react";
import api from "../../api/api.js";
import { FileText, CheckCircle, Clock } from "lucide-react";
import buguda1 from "../../assets/buguda1.jpg";
import buguda2 from "../../assets/buguda2.jpg";
import buguda3 from "../../assets/buguda3.jpg";

export default function CitizenDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
  });

  const [activeSlide, setActiveSlide] = useState(0);

  /* =========================
     LOAD DASHBOARD STATS
     ========================= */
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
     AUTO SLIDE CAROUSEL
     ========================= */
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4000);

    return () => clearInterval(timer);
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

  const carouselSlides = [
    { title: "Explore Buguda", image: buguda1 },
    { title: "Explore Buguda", image: buguda2 },
    { title: "Explore Buguda", image: buguda3 },
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
    <div className="rounded-3xl">

      {/* =========================
         MERCURY ANNOUNCEMENT BAR
         ========================= */}
      {/* <div className="w-full mb-6 rounded-xl overflow-hidden shadow-md">
        <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-600 text-white text-sm font-bold py-3 px-4 flex flex-wrap items-center justify-center gap-6">
          <span>🚨 LOGIN TO SWACHHTAM PORTAL NOW 🚨</span>

          <a
            href="https://admin.sbmurban.org/u/login"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-yellow-200 transition"
          >
            📱 https://admin.sbmurban.org/u/login 📱
          </a>

          <span>🚨 LOGIN TO SWACHHTAM PORTAL NOW 🚨</span>
        </div>
      </div> */}

      <div className="w-full bg-linear-to-r from-orange-500 via-red-500 to-pink-600 shadow-lg mb-6">
            <div className="overflow-hidden">
              <div className="flex animate-marquee whitespace-nowrap py-3 px-6">
                <div className="flex items-center gap-8">
                  <span className="text-white font-bold text-lg flex items-center gap-3">
                    🚨 LOGIN TO SWACHHTAM PORTAL NOW 🚨
                  </span>
                    <a 
              href="https://admin.sbmurban.org/u/login" 
              target="_blank" 
              
              className="text-white font-bold text-lg flex items-center gap-3 hover:text-orange-200 underline decoration-2 underline-offset-2 transition-all duration-200 hover:scale-105"
  
            >
              📱 https://admin.sbmurban.org/u/login 📱
            </a>
                  <span className="text-white font-bold text-lg flex items-center gap-3">
                    🚨 LOGIN TO SWACHHTAM PORTAL NOW 🚨
                  </span>
                </div>
              </div>
            </div>
          </div>

      {/* =========================
         HEADER
         ========================= */}
      <div className="mb-6">
        <h1 className="text-4xl font-extrabold text-green-700">
          Citizen Dashboard
        </h1>
        <p className="mt-2 text-gray-600 text-sm">
          Track waste collection and manage complaints efficiently.
        </p>
      </div>

      {/* =========================
         STATS + CAROUSEL
         ========================= */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-6">

        {/* Stat Cards */}
        <div className="lg:col-span-3 flex gap-2">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${card.gradient} h-48 w-48 rounded-2xl p-4 shadow-lg text-white flex flex-col justify-between relative`}
              >
                <div className="absolute top-3 right-3 bg-white/20 p-2 rounded-lg">
                  <Icon className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-xs uppercase font-semibold opacity-90">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold mt-1">{card.value}</p>
                </div>

                <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md transition">
                  View
                </button>
              </div>
            );
          })}
        </div>

        {/* Carousel */}
        <div className="lg:col-span-3 relative overflow-hidden rounded-3xl shadow-lg h-56">
          {carouselSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === activeSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 p-6 text-white">
                <h3 className="text-2xl font-bold">{slide.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================
         LOWER SECTION
         ========================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity */}
        <section className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6 border-t-4 border-emerald-400">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Recent Activity
          </h2>

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
