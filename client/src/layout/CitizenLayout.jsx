import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "/image.jpg";

export default function CitizenLayout() {
  const [open, setOpen] = useState(false);

  /* ================= MENU CONFIG (MAP USED) ================= */
  const menuItems = [
    { path: "/citizen", label: "Dashboard", icon: "🏠", end: true },
    { path: "/citizen/complaint", label: "Post Complaint", icon: "📝" },
    { path: "/citizen/track", label: "Track Vehicle", icon: "🚛" },
    { path: "/citizen/payments", label: "Service & Payments", icon: "💳" },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
      isActive
        ? "bg-white text-emerald-700 shadow-sm"
        : "text-white/90 hover:bg-white/10"
    }`;

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-emerald-50">
      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* ================= SIDEBAR (FIXED) ================= */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50
        h-screen w-64 bg-gradient-to-b from-emerald-500 to-emerald-700
        text-white flex flex-col
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand */}
        <div className="px-4 py-4 border-b border-white/10">
          <p className="text-xl font-extrabold">Citizen</p>
          <p className="text-xs text-white/80">Citizen Panel</p>
        </div>

        {/* NAVIGATION (MAP FUNCTION) */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.end}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT → MOBILE ONLY (BOTTOM) */}
        <div className="px-4 py-4 border-t border-white/10 lg:hidden">
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-white text-emerald-700 py-2 rounded-xl
                       text-sm font-semibold hover:bg-emerald-50"
          >
            ⏻ Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN WRAPPER ================= */}
      <div className="flex-1 flex flex-col h-screen">
        {/* ================= HEADER (FIXED) ================= */}
        <header className="fixed top-0 right-0 left-0 lg:left-64
                           h-14 bg-emerald-600 text-white shadow
                           flex items-center justify-between
                           px-4 sm:px-6 z-30">
          <div className="flex items-center gap-3">
            {/* HAMBURGER (MOBILE ONLY) */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden text-2xl"
            >
              ☰
            </button>

            <img
              src={logo}
              alt="Logo"
              className="w-8 h-8 rounded-full object-cover"
            />

            <div>
              <p className="text-sm sm:text-base font-semibold">
                Solid Waste Management System
              </p>
              <p className="text-xs text-emerald-100">Citizen Panel</p>
            </div>
          </div>

          {/* LOGOUT → DESKTOP ONLY (TOP RIGHT) */}
          <button
            onClick={() => (window.location.href = "/")}
            className="hidden lg:flex items-center gap-2
                       bg-white text-emerald-700
                       text-sm font-semibold px-4 py-2
                       rounded-full shadow hover:bg-emerald-50"
          >
            ⏻ Logout
          </button>
        </header>

        {/* ================= SCROLLABLE CONTENT ================= */}
        <main
          className="flex-1 overflow-y-auto
             pt-16 px-2 lg:px-4 pb-4 
             bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"
>
  {/* remove the inner white container */}
  <Outlet />
        </main>
      </div>
    </div>
  );
}
