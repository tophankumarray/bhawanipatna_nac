const DashboardHeader = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-3xl p-8 text-white shadow">
      <h1 className="text-3xl font-bold">Supervisor Dashboard</h1>
      <p className="text-sm opacity-90 mt-1">
        Smart Solid Waste Monitoring System
      </p>
      <p className="text-xs opacity-80 mt-1">
        Updated: {new Date().toLocaleString()}
      </p>
    </div>
  );
};

export default DashboardHeader;
