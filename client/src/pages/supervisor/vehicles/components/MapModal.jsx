import { MapPin, X } from "lucide-react";

const MapModal = ({ vehicle, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[75vh] overflow-hidden relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
        >
          <X size={16} /> Close
        </button>

        <div className="p-4 border-b">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <MapPin size={18} /> {vehicle.registrationNumber} Location Map
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Lat: {vehicle.lat} | Lng: {vehicle.lng}
          </p>
        </div>

        <iframe
          title="Vehicle Map"
          src={`https://www.google.com/maps?q=${vehicle.lat},${vehicle.lng}&z=15&output=embed`}
          className="w-full h-full"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default MapModal;
