// @ts-nocheck
const VehicleCard = ({ vehicle, onViewDetails, onTrackLive, onDelete }) => {
  const getStatusBadge = (status) => {
    const badges = {
      running: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      standing: 'bg-gradient-to-r from-blue-400 to-indigo-400',
      stopped: 'bg-gradient-to-r from-orange-500 to-amber-500',
      dataNotRetrieving: 'bg-gradient-to-r from-gray-400 to-gray-500'
    };
    return badges[status] || badges.stopped;
  };

  const getMaintenanceIcon = (status) => {
    switch (status) {
      case 'good': return '✅';
      case 'service-due': return '⚠️';
      case 'over-speeding': return '⚡';
      case 'gps-issue': return '❌';
      default: return '✅';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">🚛</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{vehicle.registrationNumber}</h3>
              <p className="text-sm text-gray-600">{vehicle.model}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`${getStatusBadge(vehicle.status)} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
              {vehicle.status?.replace(/([A-Z])/g, ' $1').trim() || 'Unknown'}
            </span>
            <span className="text-2xl">{getMaintenanceIcon(vehicle.maintenanceStatus)}</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-3 rounded-xl">
            <p className="text-xs text-gray-600 font-semibold mb-1">Type</p>
            <p className="text-sm font-bold text-gray-900 capitalize">{vehicle.type}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl">
            <p className="text-xs text-gray-600 font-semibold mb-1">Capacity</p>
            <p className="text-sm font-bold text-gray-900">{vehicle.capacity}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-xl">
            <p className="text-xs text-gray-600 font-semibold mb-1">Speed</p>
            <p className="text-sm font-bold text-gray-900">
              {vehicle.speed !== null ? `${vehicle.speed} km/h` : 'N/A'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-xl">
            <p className="text-xs text-gray-600 font-semibold mb-1">Fuel Level</p>
            <p className="text-sm font-bold text-gray-900">
              {vehicle.fuelLevel !== null ? `${vehicle.fuelLevel}%` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Driver & Ward Info */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">👤 Driver:</span>
              <span className="text-sm font-semibold text-gray-900">{vehicle.driverName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">📍 Ward:</span>
              <span className="text-sm font-semibold text-gray-900">{vehicle.assignedWard}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">🛣️ Odometer:</span>
              <span className="text-sm font-semibold text-gray-900">{vehicle.odometer?.toLocaleString() || 'N/A'} km</span>
            </div>
          </div>
        </div>

        {/* Service Info */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl mb-4">
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="text-gray-600">Last Service</p>
              <p className="font-semibold text-gray-900">{new Date(vehicle.lastService).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Next Service</p>
              <p className="font-semibold text-gray-900">{new Date(vehicle.nextService).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(vehicle)}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
          >
            View Details
          </button>
          <button
            onClick={() => onTrackLive(vehicle)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Track Live
          </button>
          <button
            onClick={() => onDelete(vehicle.id)}
            className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
            title="Delete Vehicle"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
