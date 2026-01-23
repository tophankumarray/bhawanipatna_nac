const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`rounded-3xl p-6 text-white shadow ${color}`}>
    <div className="flex justify-between items-center mb-3">
      <div className="bg-white/20 p-2 rounded-lg">
        <Icon />
      </div>
      <span className="text-xs bg-white/30 px-2 py-1 rounded-full">Live</span>
    </div>
    <p className="text-sm opacity-90">{title}</p>
    <h2 className="text-3xl font-bold mt-1">{value}</h2>
  </div>
);

export default StatCard;
