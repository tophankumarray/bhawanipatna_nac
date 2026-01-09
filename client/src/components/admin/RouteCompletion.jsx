// @ts-nocheck
const RouteCompletion = ({ data }) => {
  const routes = data?.routes || [];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-800">Route Completion Status</h3>
        <div className="p-2 bg-purple-50 rounded-lg">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">Overall Completion</span>
          <span className="text-2xl font-bold text-purple-600">{data?.overallCompletion || 0}%</span>
        </div>
        <div className="w-full bg-white rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${data?.overallCompletion || 0}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
          <span>{data?.completedRoutes || 0} completed</span>
          <span>{data?.totalRoutes || 0} total routes</span>
        </div>
      </div>

      {/* Route List */}
      <div className="space-y-2 max-h-[280px] overflow-y-auto">
        {routes.map((route, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                route.status === 'completed' ? 'bg-emerald-500' :
                route.status === 'in-progress' ? 'bg-blue-500 animate-pulse' :
                'bg-gray-400'
              }`}></div>
              <div>
                <div className="font-medium text-gray-800 text-sm">{route.name}</div>
                <div className="text-xs text-gray-500">{route.vehicle}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-700">{route.completion}%</div>
              <div className={`text-xs ${
                route.status === 'completed' ? 'text-emerald-600' :
                route.status === 'in-progress' ? 'text-blue-600' :
                'text-gray-500'
              } capitalize`}>
                {route.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteCompletion;
