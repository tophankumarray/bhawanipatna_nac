import { NavLink } from "react-router-dom";

const SupervisorSidebar = ({ logo, links }) => {
  return (
    <aside
      className="hidden md:flex w-64 
      bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-500
      shadow flex-col fixed left-0 top-0 h-screen text-white"
    >
      <div className="px-6 py-5 border-b border-white/20 flex items-center gap-3">
        <img src={logo} className="h-10 w-10 rounded-full bg-white p-1" />
        <div>
          <h2 className="font-bold">Supervisor Panel</h2>
          <p className="text-xs text-white/70">Waste Management</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((l) => {
  const Icon = l.icon;

  return (
    <NavLink
      key={l.name}
      to={l.path}
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

      <div className="p-4 border-t border-white/20" />
    </aside>
  );
};

export default SupervisorSidebar;
