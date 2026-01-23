import { Truck, X } from "lucide-react";
import Info from "./Info";
import StatusBadge from "./StatusBadge";

const VehicleDetailsModal = ({ vehicle, onClose }) => {
  const statusText = vehicle.ignitionOn ? "running" : vehicle.status || "stopped";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Truck size={20} /> Vehicle Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <Info label="Registration No" value={vehicle.registrationNumber} />
          <Info label="Driver" value={vehicle.driver || "N/A"} />
          <Info label="GPS Status" value={vehicle.status || "N/A"} />
          <Info label="Ignition" value={vehicle.ignitionOn ? "ON" : "OFF"} />
          <Info label="Speed" value={`${vehicle.speed ?? 0} km/h`} />
          <Info label="Signal Strength" value={vehicle.signalStrength ?? "N/A"} />
          <Info label="Latitude" value={vehicle.lat ?? "N/A"} />
          <Info label="Longitude" value={vehicle.lng ?? "N/A"} />
          <Info
            label="Last Updated"
            value={vehicle.lastUpdated ? vehicle.lastUpdated.toLocaleString() : "N/A"}
          />
          <Info label="Ward/Location" value={vehicle.assignedWard || "N/A"} />
        </div>

        <div className="mt-4">
          <StatusBadge status={statusText} />
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default VehicleDetailsModal;
