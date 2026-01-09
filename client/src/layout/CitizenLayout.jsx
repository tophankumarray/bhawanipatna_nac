import { Outlet, NavLink } from "react-router-dom";
import logo from "/image.jpg";

export default function CitizenLayout() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
      isActive
        ? "bg-white text-green-700 shadow-sm"
        : "text-white/90 hover:bg-white/10"
    }`;

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-60 bg-gradient-to-b from-emerald-500 to-emerald-700 text-white flex flex-col">
        {/* Top brand section */}
        <div className="px-4 pt-4 pb-3 border-b border-white/10">
          <p className="text-lg font-extrabold leading-tight">Citizen</p>
          <p className="text-[11px] text-white/80">Citizen Panel</p>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 flex flex-col gap-1 px-2 py-4">
          {/* FIX APPLIED HERE */}
          <NavLink to="/citizen" end className={linkClass}>
            <span className="text-lg">🏠</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/citizen/complaint" className={linkClass}>
            <span className="text-lg">📝</span>
            <span>Post a Complaint</span>
          </NavLink>

          <NavLink to="/citizen/track" className={linkClass}>
            <span className="text-lg">🚛</span>
            <span>Track Vehicle</span>
          </NavLink>

          <NavLink to="/citizen/payments" className={linkClass}>
            <span className="text-lg">💳</span>
            <span>Online Service Booking and Payments</span>
          </NavLink>
        </nav>

        {/* Bottom user info */}
        <div className="px-4 py-3 border-t border-white/10 text-[11px]">
          <p className="font-semibold">Logged in as</p>
          <p className="text-white/80 truncate">Citizen User</p>
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="flex-1 bg-gradient-to-br from-emerald-50 to-white overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-emerald-600 text-white shadow-sm">
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm md:text-base font-semibold">
                Solid Waste Management System
              </p>
              <p className="text-[11px] text-emerald-100">Citizen Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block bg-emerald-500/60 rounded-xl px-3 py-1.5 text-right text-[11px]">
              <p className="text-emerald-100">Current Date</p>
              <p className="font-semibold">
                {new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/";
              }}
              className="flex items-center gap-2 bg-white text-emerald-700 text-xs font-semibold px-3 py-2 rounded-full shadow hover:bg-emerald-50"
            >
              <span className="text-sm">⏻</span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="px-4 pb-6 pt-4">
          <div className="bg-white/70 rounded-3xl shadow-sm">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
