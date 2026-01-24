// @ts-nocheck
import { getStatusColor, getTimeSinceUpdate } from "../utils/trackVehicle.utils";

const VehicleList = ({
  loading,
  filteredVehicles,
  setSelectedVehicle,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Vehicle List
      </h2>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500" />
        </div>
      )}

      {/* LIST */}
      {!loading && filteredVehicles.length > 0 && (
        <div className="space-y-3">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-gradient-to-r from-gray-50 to-white hover:from-emerald-50 hover:to-teal-50 border border-gray-200 rounded-xl p-4 transition-all duration-300 cursor-pointer"
              onClick={() => {
                setSelectedVehicle(vehicle);

                setTimeout(() => {
                  document
                    .querySelector(
                      ".max-w-7xl > div:nth-child(4)"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }, 100);
              }}
            >
              <div className="flex items-center justify-between">
                {/* LEFT */}
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 ${getStatusColor(vehicle.status).bg} rounded-xl flex items-center justify-center shadow-md`}
                  >
                    <span className="text-white text-2xl">
                      🚛
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {vehicle.registrationNumber}
                    </h3>

                    <div className="flex items-center space-x-3 mt-1">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(vehicle.status).bg} text-white`}
                      >
                        {vehicle.status}
                      </span>

                      {vehicle.ignitionOn && (
                        <span className="text-xs font-semibold text-emerald-600">
                          🔑 Ignition ON
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* MIDDLE (Desktop) */}
                <div className="hidden md:flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">
                      Speed
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {vehicle.speed != null
                        ? `${vehicle.speed} km/h`
                        : "N/A"}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-600">
                      Route
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {vehicle.assignedWard}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Last Update
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    {getTimeSinceUpdate(
                      vehicle.lastUpdated
                    )}
                  </p>
                </div>
              </div>

              {/* MOBILE PROGRESS */}
              <div className="mt-3 md:hidden">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">
                    Route Progress
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    {vehicle.routeProgress}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${vehicle.routeProgress}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚛</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Vehicles Found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters
          </p>
        </div>
      )}
    </div>
  );
};

export default VehicleList;
