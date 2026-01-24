// @ts-nocheck
const WasteFilters = ({ filters, setFilters, getUniqueWards }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Filter Collections
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* SEARCH */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
            Search
          </label>
          <input
            type="text"
            placeholder="🔎 Vehicle, Driver, Route..."
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
          />
        </div>

        {/* STATUS */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">✓ Completed</option>
            <option value="inprogress">⏳ In Progress</option>
            <option value="pending">⏰ Pending</option>
            <option value="cancel">❌ Cancelled</option>
          </select>
        </div>

        {/* WARD */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ward
          </label>
          <select
            value={filters.ward}
            onChange={(e) =>
              setFilters({ ...filters, ward: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">All Wards</option>
            {getUniqueWards().map((ward) => (
              <option key={ward} value={ward}>
                {ward}
              </option>
            ))}
          </select>
        </div>

        {/* DATE */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) =>
              setFilters({ ...filters, date: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default WasteFilters;
