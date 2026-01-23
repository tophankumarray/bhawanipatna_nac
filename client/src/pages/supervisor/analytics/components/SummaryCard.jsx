const SummaryCard = ({ title, value, icon: Icon, variant = "blue" }) => {
  const styles = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-emerald-600",
    yellow: "from-yellow-500 to-orange-500",
    purple: "from-purple-500 to-indigo-600",
    red: "from-red-500 to-rose-600",
  };

  return (
    <div
      className={`bg-gradient-to-br ${
        styles[variant]
      } rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
          <Icon size={18} />
        </div>
        <span className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full">
          KPI
        </span>
      </div>

      <p className="text-white/80 text-sm font-semibold mb-2">{title}</p>
      <h3 className="text-4xl font-black">{value}</h3>
    </div>
  );
};

export default SummaryCard;
