// @ts-nocheck
const ComplaintsStatus = ({ data }) => {
  const totalComplaints = (data?.pending || 0) + (data?.open || 0) + (data?.closed || 0) + (data?.outOfScope || 0);
  
  const calculatePercentage = (value) => {
    if (totalComplaints === 0) return 0;
    return ((value / totalComplaints) * 100).toFixed(1);
  };

  const complaintStats = [
    { label: 'Pending', count: data?.pending || 0, color: 'text-orange-500', dotColor: 'bg-orange-500', gradient: 'from-orange-400 to-amber-500' },
    { label: 'Open', count: data?.open || 0, color: 'text-red-500', dotColor: 'bg-red-500', gradient: 'from-red-400 to-rose-500' },
    { label: 'Closed', count: data?.closed || 0, color: 'text-green-500', dotColor: 'bg-green-500', gradient: 'from-emerald-400 to-teal-500' },
    { label: 'Out of Scope', count: data?.outOfScope || 0, color: 'text-gray-500', dotColor: 'bg-gray-500', gradient: 'from-gray-400 to-slate-500' },
  ];

  const maxCount = Math.max(...complaintStats.map(s => s.count), 1);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
          Complaints
        </h3>
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">📋</span>
        </div>
      </div>
      
      {/* Horizontal Bar Chart */}
      <div className="space-y-4 mb-6">
        {complaintStats.map((stat, index) => (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className={`w-2.5 h-2.5 rounded-full ${stat.dotColor} mr-2`}></span>
                <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">{stat.label}</span>
              </div>
              <span className={`text-sm font-bold ${stat.color}`}>
                {stat.count}
              </span>
            </div>
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-700 ease-out shadow-sm`}
                style={{ width: `${maxCount > 0 ? (stat.count / maxCount) * 100 : 0}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Summary */}
      <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Total Complaints</span>
          <span className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {totalComplaints}
          </span>
        </div>
      </div>

      {/* Secondary Scan Section */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">Secondary Scan</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center p-2 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 mr-2"></span>
            <span className="text-gray-700 font-medium">0 Today</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
            <span className="text-gray-600">0 Yesterday</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            <span className="text-gray-600">0 Till Month</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
            <span className="text-gray-600">0 Prev Month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsStatus;
