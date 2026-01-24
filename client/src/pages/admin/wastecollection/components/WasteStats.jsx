// @ts-nocheck
import StatsCard from "../../../../components/admin/StatsCard";

const WasteStats = ({ stats }) => {
  const cards = [
    { title: "Total Collected ward", value: stats.total, icon: "📊", gradient: "from-blue-500 to-indigo-500" },
    { title: "Ward Collection Completed", value: stats.completed, icon: "✅", gradient: "from-emerald-500 to-teal-500" },
    { title: "Ward Collection In Progress", value: stats.inProgress, icon: "🔄", gradient: "from-blue-400 to-indigo-400" },
    { title: "Ward Collection Pending", value: stats.pending, icon: "⏰", gradient: "from-orange-500 to-amber-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <StatsCard key={index} {...card} showButton={false} />
      ))}
    </div>
  );
};

export default WasteStats;
