import { Truck, Activity, MapPin } from "lucide-react";

const statusStyles = {
  running: {
    label: "Running",
    dot: "bg-green-500",
    badge: "bg-green-100 text-green-700 border border-green-200",
  },
  standing: {
    label: "Standing",
    dot: "bg-yellow-500",
    badge: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  },
  stopped: {
    label: "Stopped",
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-700 border border-red-200",
  },
};

const VehicleStatusList = ({ vehicles = [] }) => {
  return (
    <div className="bg-white rounded-3xl shadow p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <Truck size={18} className="text-emerald-600" />
            Vehicle Status
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Live fleet operational overview
          </p>
        </div>

        <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
          {vehicles.length} Vehicles
        </span>
      </div>

      {/* LIST */}
      {vehicles.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-10">
          No vehicle data available
        </div>
      ) : (
        <div className="space-y-3 h-72 overflow-y-auto pr-2">
          {vehicles.map((v) => {
            const st = (v.status || "stopped").toLowerCase().trim();
            const ui = statusStyles[st] || statusStyles.stopped;

            return (
              <div
                key={v.id}
                className="p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-start justify-between gap-3"
              >
                {/* LEFT */}
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-50 p-2 rounded-xl">
                    <Truck size={18} className="text-emerald-600" />
                  </div>

                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      {v.registrationNumber || "-"}
                    </p>

                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin size={13} className="text-gray-400" />
                      {v.assignedWard || "Unknown Ward"}
                    </p>

                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Activity size={13} className="text-gray-400" />
                      Speed:{" "}
                      <span className="font-semibold text-gray-700">
                        {v.speed || 0} km/h
                      </span>
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${ui.badge}`}
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${ui.dot}`}
                    />
                    {ui.label}
                  </span>

                  <p className="text-[11px] text-gray-400">
                    {v.lastUpdated ? "Updated" : "No Update"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VehicleStatusList;
