// @ts-nocheck
const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 hover:shadow-2xl transition-all duration-500 border border-gray-100 group relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Recent Activity
          </h3>
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <span className="text-white text-2xl">⚡</span>
          </div>
        </div>
        
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-600">No recent activities</p>
            <p className="text-xs text-gray-400 mt-1">Activity will appear here</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-b-0 hover:bg-gradient-to-r hover:from-gray-50 hover:to-orange-50 -mx-3 px-3 py-3 rounded-xl transition-all group/item">
                <div className={`w-3 h-3 rounded-full mt-1.5 shadow-lg ${
                  activity.type === 'success' ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/50' :
                  activity.type === 'warning' ? 'bg-gradient-to-br from-orange-400 to-amber-500 shadow-orange-500/50' :
                  activity.type === 'error' ? 'bg-gradient-to-br from-red-400 to-rose-500 shadow-red-500/50' :
                  'bg-gradient-to-br from-blue-400 to-indigo-500 shadow-blue-500/50'
                } group-hover/item:scale-125 transition-transform`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 group-hover/item:text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
