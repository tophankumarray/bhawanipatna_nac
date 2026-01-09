// @ts-nocheck
const WardCard = ({ ward, onViewDetails, onViewMap, onDelete }) => {
  const getStatusBadge = (status) => {
    const badges = {
      completed: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      'in-progress': 'bg-gradient-to-r from-blue-500 to-indigo-500',
      pending: 'bg-gradient-to-r from-orange-500 to-amber-500'
    };
    return badges[status] || badges.pending;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'pending': return '⏳';
      default: return '⏳';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">🏘️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{ward.name}</h3>
              <p className="text-sm text-gray-600">{ward.area}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`${getStatusBadge(ward.status)} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md capitalize`}>
              {ward.status.replace('-', ' ')}
            </span>
            <span className="text-2xl">{getStatusIcon(ward.status)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Collection Progress</span>
            <span className="text-sm font-bold text-emerald-600">{ward.completion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`${getStatusBadge(ward.status)} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${ward.completion}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
            <span>Collected: {ward.collectedToday} tons</span>
            <span>Target: {ward.targetDaily} tons</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl">
            <p className="text-xs text-gray-600 font-semibold mb-1">Population</p>
            <p className="text-sm font-bold text-gray-900">{ward.population.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-xl">
            <p className="text-xs text-gray-600 font-semibold mb-1">Households</p>
            <p className="text-sm font-bold text-gray-900">{ward.households.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-3 rounded-xl">
            <p className="text-xs text-gray-600 font-semibold mb-1">Vehicles</p>
            <p className="text-sm font-bold text-gray-900">{ward.assignedVehicles.length}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-xl">
            <p className="text-xs text-gray-600 font-semibold mb-1">Staff</p>
            <p className="text-sm font-bold text-gray-900">{ward.assignedStaff}</p>
          </div>
        </div>

        {/* Supervisor Info */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">👤 Supervisor:</span>
              <span className="text-sm font-semibold text-gray-900">{ward.supervisorName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">📞 Phone:</span>
              <span className="text-sm font-semibold text-gray-900">{ward.supervisorPhone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">📍 Bin Locations:</span>
              <span className="text-sm font-semibold text-gray-900">{ward.binLocations}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">📋 Complaints:</span>
              <span className={`text-sm font-semibold ${ward.complaints > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {ward.complaints}
              </span>
            </div>
          </div>
        </div>

        {/* Last Collection Info */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl mb-4">
          <div className="flex items-center justify-between text-xs">
            <p className="text-gray-600">Last Collection:</p>
            <p className="font-semibold text-gray-900">
              {new Date(ward.lastCollectionTime).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(ward)}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
          >
            View Details
          </button>
          <button
            onClick={() => onViewMap(ward)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
          >
            View Map
          </button>
          <button
            onClick={() => onDelete(ward.id)}
            className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
            title="Delete Ward"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default WardCard;
