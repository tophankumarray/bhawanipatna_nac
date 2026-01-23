// @ts-nocheck
const VehicleCard = ({ vehicle, onViewDetails, onTrackLive, onDelete }) => {
  const getVehicleStatus = (vehicle) => {
  if (vehicle.lat == null || vehicle.lng == null) {
    return 'dataNotRetrieving';
  } else if (vehicle.speed > 0) {
    return 'running';
  } else if (vehicle.speed === 0) {
    return 'standing';
  }
  return 'stopped';
};

const getStatusText = (vehicle) => {
  const map = {
    dataNotRetrieving: 'Data Not Retrieving',
    running: 'Running',
    standing: 'Standing',
    stopped: 'Stopped',
  };
  return map[getVehicleStatus(vehicle)] || 'Unknown';
};

const getStatusBadge = (vehicle) => {
  const map = {
    dataNotRetrieving: 'bg-gradient-to-r from-gray-400 to-gray-500',
    running: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    standing: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    stopped: 'bg-gradient-to-r from-orange-500 to-amber-500',
  };
  return map[getVehicleStatus(vehicle)];
};


  return (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">🚛</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {vehicle.registrationNumber || 'N/A'}
              </h3>
              <p className="text-xs text-gray-500">
                IMEI: {vehicle.id}
              </p>
            </div>
          </div>

          <span
            className={`${getStatusBadge(vehicle)}
              text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}
          >
            {getStatusText(vehicle)}
          </span>

        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Speed */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-xl">
            <p className="text-xs text-gray-600 font-semibold mb-1">Speed</p>
            <p className="text-sm font-bold text-gray-900">
              {vehicle.speed != null ? `${vehicle.speed} km/h` : 'N/A'}
            </p>
          </div>

          {/* Signal Strength */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl">
            <p className="text-xs text-gray-600 font-semibold mb-1">Signal</p>
            <p className="text-sm font-bold text-gray-900">
              {vehicle.signalStrength != null ? vehicle.signalStrength : 'N/A'}
            </p>
          </div>
        </div>

        {/* Ward & Ignition */}
        <div className="border-t border-gray-200 pt-4 mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">📍 Address</span>
            <span className="text-sm font-semibold text-gray-900">
              {vehicle.assignedWard || 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">🔑 Ignition</span>
            <span
              className={`text-sm font-semibold ${
                vehicle.ignitionOn ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {vehicle.ignitionOn ? 'ON' : 'OFF'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">⏱ Last Updated</span>
            <span className="text-xs text-gray-700">
              {vehicle.lastUpdated
                ? vehicle.lastUpdated.toLocaleString()
                : 'N/A'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(vehicle)}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 rounded-xl font-semibold shadow-md transition-all"
          >
            View Details
          </button>

          <button
            onClick={() => onTrackLive(vehicle)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 rounded-xl font-semibold shadow-md transition-all"
          >
            Track Live
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
