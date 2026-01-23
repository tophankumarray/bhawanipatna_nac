import { PRIORITY_COLOR, STATUS_COLOR, TABLE_HEADERS } from "../complaintsConfig";

const ComplaintsTable = ({ data, loading, onPreview, onRoute, isSLABreached }) => {
  return (
    <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="text-gray-600 uppercase text-xs tracking-wide">
              {TABLE_HEADERS.map((h) => (
                <th key={h} className="px-5 py-4 text-left border border-gray-300">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((c) => {
              const breached = isSLABreached(c.sla, c.status);

              return (
                <tr
                  key={c.id}
                  className={`hover:bg-gray-50 ${breached ? "bg-red-50" : ""}`}
                >
                  <td className="px-5 py-4 font-medium border border-gray-300">
                    {String(c.id).slice(-6)}
                  </td>

                  <td className="px-5 py-4 border border-gray-300">
                    <img
                      src={c.image}
                      onClick={() => onPreview(c.image)}
                      className="w-14 h-14 rounded-lg object-cover border cursor-pointer"
                      alt="complaint"
                    />
                  </td>

                  <td className="px-5 py-4 border border-gray-300">{c.ward}</td>

                  <td className="px-5 py-4 border border-gray-300">{c.type}</td>

                  <td
                    className={`px-5 py-4 border border-gray-300 ${
                      PRIORITY_COLOR[c.priority?.toLowerCase()]
                    }`}
                  >
                    {c.priority}
                  </td>

                  <td className="px-5 py-4 border border-gray-300">{c.vehicle}</td>

                  <td className="px-5 py-4 border border-gray-300">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        STATUS_COLOR[c.status?.toLowerCase()]
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-xs border border-gray-300">
                    {breached ? (
                      <span className="text-red-600 font-semibold">
                        SLA Breached
                      </span>
                    ) : (
                      <span className="text-green-600">On Time</span>
                    )}
                  </td>

                  <td className="px-5 py-4 border border-gray-300">
                    <button
                      onClick={() => onRoute(c.location)}
                      className="text-green-600 text-xs font-medium hover:underline"
                    >
                      View Route
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!loading && data.length === 0 && (
          <div className="p-8 text-center text-gray-500">No complaints found.</div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsTable;
