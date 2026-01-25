const RouteMapModal = ({ location, onClose }) => {
  if (!location) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl h-[75vh] rounded-2xl shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
          <h3 className="font-bold text-gray-900 text-sm md:text-base">
            Route View – {location}
          </h3>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition"
          >
            Close
          </button>
        </div>

        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
          className="w-full h-full"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default RouteMapModal;
