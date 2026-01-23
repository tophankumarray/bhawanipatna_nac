import React from "react";
import { Search, Filter } from "lucide-react";

export default function DefectFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 mb-8 sm:mb-10 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by supervisor or machine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="relative w-full md:w-56">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 h-5 w-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-12 pr-10 py-3 sm:py-4 border-2 border-gray-200 rounded-xl bg-white font-semibold text-gray-700"
          >
            <option value="All">All Status</option>
            <option value="started">started</option>
            <option value="inprogress">inprogress</option>
            <option value="repaired">repaired</option>
          </select>
        </div>
      </div>
    </div>
  );
}
