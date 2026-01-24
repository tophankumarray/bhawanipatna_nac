const TrackVehicleHeader = () => (
  <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Live Vehicle Tracking
        </h1>
        <p className="text-gray-600 mt-1">
          Real-time monitoring of all vehicles
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-xl">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-emerald-700">
            Live Updates
          </span>
        </div>
        <span className="text-xs text-gray-500">Auto-refresh: 10s</span>
      </div>
    </div>
  </div>
);

export default TrackVehicleHeader;
