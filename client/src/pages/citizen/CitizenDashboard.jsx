// @ts-nocheck
import { CheckCircle, Clock, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api.js";
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
        const res = await api.get("/complaints/allcomplaints");
        const complaints = res.data?.data || [];

        const total = complaints.length;
        const resolved = complaints.filter(c => c.status === "Resolved").length;
        const pending = complaints.filter(
          c => c.status === "Pending" || c.status === "In Progress"
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
      setActiveSlide(prev => (prev + 1) % carouselSlides.length);
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
      title: `Total complaints: ${stats.total}`,
      description: "Complaints registered in the system",
      time: "Updated now",
    },
    {
      title: `Resolved complaints: ${stats.resolved}`,
      description: "Issues successfully closed",
      time: "Updated now",
    },
  ];

  const quickActions = [
    { label: "Post a Complaint", gradient: "from-emerald-500 to-emerald-600", path: "/citizen/complaint" },
    { label: "Track Vehicle", gradient: "from-sky-500 to-sky-600", path: "/citizen/track" },
    {
      label: "Service Booking & Payment",
      gradient: "from-orange-500 to-orange-600",
      path: "/citizen/payments"
    },
    { label: "My Complaints", gradient: "from-purple-500 to-purple-600", path: "/citizen/complaint" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-6 md:py-8 rounded-3xl bg-white shadow-xl">

      {/* =========================
         ANNOUNCEMENT BAR - FIXED
         ========================= */}
      <div className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 shadow-lg mb-3 sm:mb-4 md:mb-6 rounded-xl sm:rounded-2xl overflow-hidden">
        <div className="overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap py-1.5 sm:py-2 md:py-3 px-2 sm:px-4 md:px-6 text-center">
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4 lg:gap-6 min-w-max">
              <span className="text-white font-bold text-xs sm:text-sm md:text-base flex-shrink-0">
                🚨 LOGIN NOW 🚨
              </span>
              <a
                href="https://admin.sbmurban.org/u/login"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-bold text-xs sm:text-sm md:text-base underline hover:text-orange-200 transition whitespace-nowrap flex-shrink-0"
              >
                admin.sbmurban.org/u/login
              </a>
              <span className="text-white font-bold text-xs sm:text-sm md:text-base flex-shrink-0">
                🚨 LOGIN NOW 🚨
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
         HEADER
         ========================= */}
      <div className="mb-3 sm:mb-4 md:mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-green-700 leading-tight">
          Citizen Dashboard
        </h1>
        <p className="mt-1 sm:mt-2 text-gray-600 text-xs sm:text-sm md:text-base">
          Track waste collection and manage complaints efficiently.
        </p>
      </div>

      {/* =========================
         STATS + CAROUSEL - MOBILE FIXED
         ========================= */}
      <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-4 sm:mb-6 md:mb-8">

        {/* Carousel - FULL WIDTH ON ALL SCREENS */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg h-32 sm:h-40 md:h-48 lg:h-64 xl:h-72">
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
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/50 sm:bg-black/40" />
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 text-white">
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight">
                  {slide.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Stat Cards - ROW BELOW CAROUSEL */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${card.gradient} rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-4 lg:p-5 shadow-md sm:shadow-lg text-white flex flex-col justify-between relative min-h-[80px] sm:min-h-[100px] md:min-h-[120px] lg:min-h-[140px]`}
              >
                <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 md:top-3 md:right-3 bg-white/20 p-1 sm:p-1.5 rounded-md">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </div>

                <div className="pr-8 sm:pr-10">
                  <p className="text-[10px] sm:text-xs uppercase font-semibold opacity-90">
                    {card.label}
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-0.5 sm:mt-1 leading-tight">
                    {card.value}
                  </p>
                </div>

                <button className="text-[9px] sm:text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-sm sm:rounded-md text-center transition w-full sm:w-fit mt-1">
                  View
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================
         LOWER SECTION
         ========================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">

        {/* Recent Activity */}
        <section className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg p-3 sm:p-4 md:p-6 border-t-4 border-emerald-400">
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">
            Recent Activity
          </h2>

          <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
            {recentActivities.map((activity, index) => (
              <li
                key={index}
                className="flex flex-col sm:flex-row sm:justify-between gap-2 p-2.5 sm:p-3 md:p-4 bg-gray-50 rounded-lg sm:rounded-xl"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap self-end sm:self-auto">
                  {activity.time}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Quick Actions */}
        <section className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg p-3 sm:p-4 md:p-6 border-t-4 border-blue-400">
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">
            Quick Actions
          </h2>

          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className={`w-full px-3 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl bg-gradient-to-r ${action.gradient} text-white font-semibold shadow hover:scale-105 transition h-12 sm:h-16 md:h-20 flex items-center justify-center`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
