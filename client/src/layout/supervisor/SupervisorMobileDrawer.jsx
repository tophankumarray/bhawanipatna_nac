import { NavLink } from "react-router-dom";
import { X, LogOut } from "lucide-react";

const SupervisorMobileDrawer = ({ open, onClose, links, onLogout }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40">
      <aside
        className="w-64 
        bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-500
        h-full shadow-lg p-4 flex flex-col text-white"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold">Supervisor Panel</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {links.map((l) => {
  const Icon = l.icon;

  return (
    <NavLink
      key={l.name}
      to={l.path}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
          isActive
            ? "bg-white text-green-700 font-semibold"
            : "text-white/80 hover:bg-white/10"
        }`
      }
    >
      <Icon size={18} />
      {l.name}
    </NavLink>
  );
})}

        </nav>

        <button
          onClick={onLogout}
          className="mt-4 flex items-center gap-3 
          bg-white text-red-600 px-4 py-2 rounded-lg"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
    </div>
  );
};

export default SupervisorMobileDrawer;
