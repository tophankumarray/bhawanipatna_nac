// @ts-nocheck
const VehiclesStatus = ({ data }) => {
  const vehicleStatuses = [
    { label: 'All', count: data?.all || 0, badge: 'from-blue-500 to-cyan-500', icon: '🚗' },
    { label: 'Over Speeding', count: data?.overSpeeding || 0, badge: 'from-red-500 to-rose-500', icon: '⚡' },
    { label: 'Running', count: data?.running || 0, badge: 'from-emerald-500 to-teal-500', icon: '▶️' },
    { label: 'Standing', count: data?.standing || 0, badge: 'from-blue-400 to-indigo-400', icon: '⏸️' },
    { label: 'Stopped', count: data?.stopped || 0, badge: 'from-orange-500 to-amber-500', icon: '⏹️' },
    { label: 'Data Not Retrieving', count: data?.dataNotRetrieving || 0, badge: 'from-gray-400 to-gray-500', icon: '❓' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 hover:shadow-2xl transition-all duration-500 border border-gray-100 group relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Vehicles Status
          </h3>
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <span className="text-white text-2xl">🚛</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {vehicleStatuses.map((status, index) => (
            <div key={index} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 group/item border border-transparent hover:border-emerald-200 hover:shadow-md">
              <div className="flex items-center space-x-3">
                <span className="text-2xl group-hover/item:scale-110 transition-transform">{status.icon}</span>
                <span className="text-sm text-gray-700 font-semibold group-hover/item:text-gray-900">{status.label}</span>
              </div>
              <span className={`bg-gradient-to-r ${status.badge} text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg group-hover/item:scale-110 transition-transform`}>
                {status.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehiclesStatus;
