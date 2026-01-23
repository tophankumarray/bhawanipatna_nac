import { Clock, Gauge, Navigation, Satellite, Truck, User } from "lucide-react";
import MiniInfo from "./MiniInfo";
import StatusBadge from "./StatusBadge";

const VehicleCard = ({ vehicle, onOpenDetails, onOpenMap }) => {
  const statusText = vehicle.ignitionOn ? "running" : vehicle.status || "stopped";

  return (
    <div className="bg-white rounded-2xl shadow border border-gray-200 p-5 hover:shadow-lg transition">
      {/* TOP */}
      <div className="flex justify-between items-start gap-3">
        <div>
          <p className="text-xs text-gray-500 font-semibold">Vehicle Number</p>
          <h3 className="text-xl font-black text-gray-800">
            {vehicle.registrationNumber}
          </h3>

          {vehicle.lastUpdated && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Clock size={14} /> {vehicle.lastUpdated.toLocaleString()}
            </p>
          )}
        </div>

        <StatusBadge status={statusText} />
      </div>

      {/* INFO GRID */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {vehicle.driver && (
          <MiniInfo icon={<User size={16} />} label="Driver" value={vehicle.driver} />
        )}

        {vehicle.status && (
          <MiniInfo icon={<Satellite size={16} />} label="GPS" value={vehicle.status} />
        )}

        {typeof vehicle.speed !== "undefined" && (
          <MiniInfo icon={<Gauge size={16} />} label="Speed" value={`${vehicle.speed} km/h`} />
        )}

        <MiniInfo
          icon={<Truck size={16} />}
          label="Ignition"
          value={vehicle.ignitionOn ? "ON" : "OFF"}
        />
      </div>

      {/* LOCATION */}
      {vehicle.assignedWard && (
        <div className="mt-4 bg-gray-50 border rounded-xl p-3">
          <p className="text-xs text-gray-500 font-semibold mb-1">
            Assigned Ward / Location
          </p>
          <p className="text-sm font-semibold text-gray-800">{vehicle.assignedWard}</p>

          {vehicle.lat && vehicle.lng && (
            <p className="text-xs text-gray-500 mt-1">
              Lat: {vehicle.lat} | Lng: {vehicle.lng}
            </p>
          )}
        </div>
      )}

      {/* BUTTONS */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => onOpenDetails(vehicle)}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold"
        >
          <Truck size={16} /> Details
        </button>

        <button
          disabled={!vehicle.lat || !vehicle.lng}
          onClick={() => onOpenMap(vehicle)}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-white ${
            vehicle.lat && vehicle.lng
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <Navigation size={16} /> Map
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;
