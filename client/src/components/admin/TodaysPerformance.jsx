// @ts-nocheck
const TodaysPerformance = ({ data }) => {
  // Mock 7-day trend data (in real app, this would come from API)
  const complaintsTrend = data?.complaintsTrend || [72, 68, 75, 81, 78, 85, 87];
  const collectionTrend = data?.collectionTrend || [88, 90, 89, 92, 91, 93, 94];
  
  // Function to generate SVG path for line chart
  const generatePath = (dataPoints, maxValue = 100, height = 60, width = 200) => {
    const points = dataPoints.map((value, index) => {
      const x = (index / (dataPoints.length - 1)) * width;
      const y = height - (value / maxValue) * height;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-emerald-500 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-800">Today's Performance</h3>
        <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Resolved Complaints */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-sm font-medium text-gray-600">Resolved Complaints</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-emerald-600">{data?.resolvedComplaints || 0}</span>
                <span className="text-xs text-emerald-600 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                  +12% ↑
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <svg width="100%" height="60" className="overflow-visible">
              {/* Grid lines */}
              <line x1="0" y1="60" x2="100%" y2="60" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="40" x2="100%" y2="40" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="0" y1="20" x2="100%" y2="20" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
              
              {/* Area under curve */}
              <defs>
                <linearGradient id="complaintGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path
                d={`${generatePath(complaintsTrend)} L 100%,60 L 0,60 Z`}
                fill="url(#complaintGradient)"
              />
              
              {/* Line */}
              <path
                d={generatePath(complaintsTrend)}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-md"
              />
              
              {/* Data points */}
              {complaintsTrend.map((value, index) => {
                const x = (index / (complaintsTrend.length - 1)) * 100;
                const y = 60 - (value / 100) * 60;
                return (
                  <circle
                    key={index}
                    cx={`${x}%`}
                    cy={y}
                    r="4"
                    fill="#10b981"
                    className="hover:r-6 transition-all cursor-pointer"
                  >
                    <title>{`Day ${index + 1}: ${value}`}</title>
                  </circle>
                );
              })}
            </svg>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>7 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>
        
        {/* Collection Rate */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-sm font-medium text-gray-600">Collection Rate</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-blue-600">{data?.collectionRate || 0}%</span>
                <span className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-0.5 rounded-full">
                  +6% ↑
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <svg width="100%" height="60" className="overflow-visible">
              {/* Grid lines */}
              <line x1="0" y1="60" x2="100%" y2="60" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="40" x2="100%" y2="40" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="0" y1="20" x2="100%" y2="20" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
              
              {/* Area under curve */}
              <defs>
                <linearGradient id="collectionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path
                d={`${generatePath(collectionTrend)} L 100%,60 L 0,60 Z`}
                fill="url(#collectionGradient)"
              />
              
              {/* Line */}
              <path
                d={generatePath(collectionTrend)}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-md"
              />
              
              {/* Data points */}
              {collectionTrend.map((value, index) => {
                const x = (index / (collectionTrend.length - 1)) * 100;
                const y = 60 - (value / 100) * 60;
                return (
                  <circle
                    key={index}
                    cx={`${x}%`}
                    cy={y}
                    r="4"
                    fill="#3b82f6"
                    className="hover:r-6 transition-all cursor-pointer"
                  >
                    <title>{`Day ${index + 1}: ${value}%`}</title>
                  </circle>
                );
              })}
            </svg>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>7 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaysPerformance;
