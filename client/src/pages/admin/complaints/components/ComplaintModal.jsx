// @ts-nocheck
import { getStatusColor } from "../utils/complaint.utils";

const ComplaintModal = ({ complaint, onClose, onImage }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-y-auto max-h-[90vh]">
        <div className="p-6">

          {/* Header */}
          <div className="flex justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">
                {complaint.title}
              </h2>
              <p className="text-sm text-gray-500">
                ID: {complaint.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-xl font-bold"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <p>{complaint.description}</p>

            <p>
              <strong>Category:</strong>{" "}
              {complaint.category}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {complaint.location}
            </p>

            <p>
              <strong>Citizen:</strong>{" "}
              {complaint.citizenName} (
              {complaint.citizenPhone})
            </p>

            {complaint.photo && (
              <img
                src={complaint.photo}
                alt="Complaint"
                className="w-full h-60 object-cover rounded cursor-pointer"
                onClick={() => onImage(complaint.photo)}
              />
            )}

            <span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                complaint.status
              )}`}
            >
              {complaint.status.toUpperCase()}
            </span>
          </div>

          {/* Footer */}
          <div className="mt-6 text-right">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 rounded-lg"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ComplaintModal;
