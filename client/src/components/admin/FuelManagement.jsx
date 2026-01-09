// @ts-nocheck
const FuelManagement = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-800">Fuel Management</h3>
        <div className="p-2 bg-orange-50 rounded-lg">
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      </div>

      {/* Fuel Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
          <div className="text-xs text-gray-600 font-medium mb-1">Today's Usage</div>
          <div className="text-2xl font-bold text-orange-600">{data?.todayUsage || 0}L</div>
          <div className="text-xs text-orange-600 mt-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            +8% from yesterday
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
          <div className="text-xs text-gray-600 font-medium mb-1">This Month</div>
          <div className="text-2xl font-bold text-emerald-600">{data?.monthUsage || 0}L</div>
          <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
            -5% efficient
          </div>
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-100 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Total Fuel Cost</span>
          <span className="text-2xl font-bold text-red-600">₹{data?.totalCost?.toLocaleString() || 0}</span>
        </div>
        <div className="text-xs text-gray-600">
          Average: ₹{data?.avgCostPerLiter || 0}/L
        </div>
      </div>

      {/* Alerts & Insights */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-gray-700 mb-2">Fuel Alerts</div>
        
        {data?.alerts?.map((alert, index) => (
          <div key={index} className={`flex items-start gap-2 p-3 rounded-lg ${
            alert.type === 'warning' ? 'bg-amber-50 border border-amber-200' :
            alert.type === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            <svg className={`w-4 h-4 mt-0.5 ${
              alert.type === 'warning' ? 'text-amber-600' :
              alert.type === 'error' ? 'text-red-600' :
              'text-blue-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <div className={`text-xs font-medium ${
                alert.type === 'warning' ? 'text-amber-800' :
                alert.type === 'error' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {alert.message}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{alert.vehicle}</div>
            </div>
          </div>
        )) || (
          <div className="text-center py-4 text-gray-400 text-xs">
            No alerts at this time
          </div>
        )}
      </div>
    </div>
  );
};

export default FuelManagement;
