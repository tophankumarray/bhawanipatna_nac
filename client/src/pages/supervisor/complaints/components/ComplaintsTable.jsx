import { PRIORITY_COLOR, STATUS_COLOR, TABLE_HEADERS } from "../complaintsConfig";

const ComplaintsTable = ({ data, loading, onPreview, onRoute, isSLABreached }) => {
  return (
    <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* TABLE HEADER */}
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white uppercase text-xs tracking-wider">
              {TABLE_HEADERS.map((h) => (
                <th
                  key={h}
                  className="px-5 py-4 text-left border-b border-gray-200"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {data.map((c) => {
              const breached = isSLABreached(c.sla, c.status);

              return (
                <tr
                  key={c.id}
                  className={`transition-all duration-200 hover:bg-gray-50 ${
                    breached ? "bg-red-50/60" : ""
                  }`}
                >
                  {/* ID */}
                  <td className="px-5 py-4 font-semibold text-gray-800 border-b border-gray-200">
                    #{String(c.id).slice(-6)}
                  </td>

                  {/* IMAGE */}
                  <td className="px-5 py-4 border-b border-gray-200">
                    <img
                      src={c.image}
                      onClick={() => onPreview(c.image)}
                      className="w-14 h-14 rounded-xl object-cover border cursor-pointer hover:scale-105 transition"
                      alt="complaint"
                    />
                  </td>

                  {/* WARD */}
                  <td className="px-5 py-4 border-b border-gray-200">{c.ward}</td>

                  {/* ISSUE */}
                  <td className="px-5 py-4 border-b border-gray-200 font-medium text-gray-800">
                    {c.type}
                  </td>

                  {/* PRIORITY */}
                  <td className="px-5 py-4 border-b border-gray-200">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        c.priority?.toLowerCase() === "high"
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : c.priority?.toLowerCase() === "medium"
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          : "bg-green-100 text-green-700 border border-green-200"
                      }`}
                    >
                      {c.priority}
                    </span>
                  </td>

                  {/* VEHICLE */}
                  <td className="px-5 py-4 border-b border-gray-200 text-gray-700">
                    {c.vehicle}
                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4 border-b border-gray-200">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        STATUS_COLOR[c.status?.toLowerCase()]
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  {/* SLA */}
                  <td className="px-5 py-4 text-xs border-b border-gray-200">
                    {breached ? (
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold border border-red-200">
                        SLA Breached ⚠
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold border border-green-200">
                        On Time ✅
                      </span>
                    )}
                  </td>

                  {/* ROUTE */}
                  <td className="px-5 py-4 border-b border-gray-200">
                    <button
                      onClick={() => onRoute(c.location)}
                      className="px-3 py-2 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition"
                    >
                      View Route
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* EMPTY STATE */}
        {!loading && data.length === 0 && (
          <div className="p-10 text-center text-gray-500 font-medium">
            No complaints found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsTable;
