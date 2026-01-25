import { PRIORITY_COLOR, STATUS_COLOR } from "../complaintsConfig";

const ComplaintsMobileCards = ({ data, loading, onPreview, onRoute, isSLABreached }) => {
  return (
    <div className="md:hidden space-y-4">
      {data.map((c) => {
        const breached = isSLABreached(c.sla, c.status);

        return (
          <div
            key={c.id}
            className={`rounded-2xl shadow-sm border p-4 space-y-3 transition ${
              breached ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <p className="text-xs text-gray-500">Complaint ID</p>
                <h3 className="font-bold text-gray-900">
                  #{String(c.id).slice(-6)}
                </h3>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  STATUS_COLOR[c.status?.toLowerCase()]
                }`}
              >
                {c.status}
              </span>
            </div>

            <div className="flex gap-3">
              <img
                src={c.image}
                onClick={() => onPreview(c.image)}
                className="w-20 h-20 rounded-xl object-cover border cursor-pointer hover:scale-105 transition"
                alt="complaint"
              />

              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-gray-900">{c.type}</p>
                <p className="text-xs text-gray-500">Ward: {c.ward}</p>

                <p className={`text-xs ${PRIORITY_COLOR[c.priority?.toLowerCase()]}`}>
                  Priority: {c.priority}
                </p>

                <p className="text-xs text-gray-500">
                  Vehicle:{" "}
                  <span className="font-semibold text-gray-700">{c.vehicle}</span>
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              {breached ? (
                <span className="text-red-600 font-bold">SLA Breached ⚠</span>
              ) : (
                <span className="text-green-600 font-bold">On Time ✅</span>
              )}

              <button
                onClick={() => onRoute(c.location)}
                className="px-3 py-2 rounded-lg bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition"
              >
                View Route
              </button>
            </div>
          </div>
        );
      })}

      {!loading && data.length === 0 && (
        <div className="p-6 text-center text-gray-500 font-medium">
          No complaints found.
        </div>
      )}
    </div>
  );
};

export default ComplaintsMobileCards;
