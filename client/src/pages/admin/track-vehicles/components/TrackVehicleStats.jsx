// @ts-nocheck
import StatsCard from "../../../../components/admin/StatsCard";

const TrackVehicleStats = ({ vehicles }) => {
  const statsCards = [
    { title: "Running", value: vehicles.filter(v => v.status === "running").length, icon: "▶️", gradient: "from-emerald-500 to-teal-500" },
    { title: "Standing", value: vehicles.filter(v => v.status === "standing").length, icon: "⏸️", gradient: "from-blue-500 to-indigo-500" },
    { title: "Stopped", value: vehicles.filter(v => v.status === "stopped").length, icon: "⏹️", gradient: "from-orange-500 to-amber-500" },
    { title: "Offline", value: vehicles.filter(v => v.status === "dataNotRetrieving").length, icon: "❓", gradient: "from-gray-400 to-gray-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statsCards.map((s, i) => (
        <StatsCard key={i} {...s} showButton={false} />
      ))}
    </div>
  );
};

export default TrackVehicleStats;
