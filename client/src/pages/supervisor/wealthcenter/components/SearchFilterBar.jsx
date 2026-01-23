import { Filter, Search } from "lucide-react";
import { STATUS_OPTIONS } from "../config/wealthCenterConfig";

const SearchFilterBar = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-10 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by supervisor, id, cube..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="relative w-full md:w-52">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 h-5 w-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white font-semibold"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Status" : s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
