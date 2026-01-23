import { Bell } from "lucide-react";

const DashboardAlert = ({ vehiclesCount }) => {
  return (
    <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl px-6 py-4 flex items-center gap-3">
      <Bell size={20} />
      <p className="text-sm">{vehiclesCount} vehicles currently registered.</p>
    </div>
  );
};

export default DashboardAlert;
