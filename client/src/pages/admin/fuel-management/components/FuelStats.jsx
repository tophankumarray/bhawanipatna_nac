// @ts-nocheck
import StatsCard from "../../../../components/admin/StatsCard";

const FuelStats = ({ stats }) => {
  const statsCards = [
    {
      title: "TOTAL RECORDS",
      value: stats.totalRecords,
      icon: "📊",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "TOTAL FUEL",
      value: `${stats.totalFuel} L`,
      icon: "⛽",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "TOTAL COST",
      value: `₹${stats.totalCost}`,
      icon: "💰",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "AVG EFFICIENCY",
      value: `${stats.avgEfficiency} km/L`,
      icon: "📈",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
      {statsCards.map((card, i) => (
        <StatsCard key={i} {...card} showButton={false} />
      ))}
    </div>
  );
};

export default FuelStats;
