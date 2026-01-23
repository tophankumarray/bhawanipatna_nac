const RouteMapModal = ({ location, onClose }) => {
  if (!location) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-[90%] md:w-[70%] h-[70%] rounded-xl shadow-xl overflow-hidden">
        <div className="flex justify-between px-4 py-3 border-b">
          <h3 className="font-semibold">Route View – {location}</h3>
          <button onClick={onClose}>Close</button>
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
