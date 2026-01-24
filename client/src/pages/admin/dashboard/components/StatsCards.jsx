// @ts-nocheck
import StatsCard from "../../../../components/admin/StatsCard";

const StatsCards = ({ dashboardData }) => {
  const statsCards = [
    {
      title: "Waste Collection",
      value: dashboardData.stats.waste,
      icon: "♻️",
      gradient: "from-emerald-500 to-teal-600",
      link: "/admin/waste-collection",
    },
    {
      title: "Active Vehicles",
      value: dashboardData.stats.vehicles,
      icon: "🚛",
      gradient: "from-teal-500 to-cyan-600",
      link: "/admin/vehicles",
    },
    {
      title: "Staff Details",
      value: dashboardData.stats.activeStaff,
      icon: "👷",
      gradient: "from-blue-500 to-indigo-600",
      link: "/admin/attendance",
    },
    {
      title: "Complaints",
      value: dashboardData.stats.complaints,
      icon: "📧",
      gradient: "from-rose-500 to-pink-600",
      link: "/admin/complaints",
    },
    {
      title: "Total Wards",
      value: dashboardData.stats.wards,
      icon: "🏘️",
      gradient: "from-lime-600 to-green-600",
      link: "/admin/wards",
    },
    {
      title: "Registered Citizens",
      value: dashboardData.stats.citizens,
      icon: "👥",
      gradient: "from-purple-500 to-violet-600",
      link: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5 mb-8 sm:mb-10">
      {statsCards.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          gradient={stat.gradient}
          link={stat.link}
        />
      ))}
    </div>
  );
};

export default StatsCards;
