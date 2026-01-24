// @ts-nocheck
import { getStatusBadge } from "../utils/vehicle.utils";

const VehicleDetailsModal = ({ vehicle, onClose, onTrack }) => {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">Vehicle Details</h2>
          <button onClick={onClose}>×</button>
        </div>

        <p><b>Registration:</b> {vehicle.registrationNumber}</p>
        <p><b>Ward:</b> {vehicle.assignedWard}</p>
        <p><b>Speed:</b> {vehicle.speed ?? "N/A"}</p>

        <span
          className={`${getStatusBadge(vehicle.status)} text-white px-3 py-1 rounded-full`}
        >
          {vehicle.status}
        </span>

        <div className="mt-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 rounded-xl py-2"
          >
            Close
          </button>
          <button
            onClick={() => onTrack(vehicle)}
            className="flex-1 bg-emerald-500 text-white rounded-xl py-2"
          >
            Track Live
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsModal;
