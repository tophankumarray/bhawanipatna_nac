import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import DefectCard from "./DefectCard";

export default function DefectList({ loading, records, updatingId, onUpdateStatus }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-gray-100">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3" />
        <p className="text-gray-600 font-semibold">Loading defects...</p>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-10 sm:p-20 text-center border border-gray-100">
        <AlertCircle className="h-14 w-14 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-6" />
        <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-3">
          No Machinery Defects Found
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {records.map((record) => (
        <DefectCard
          key={record._id}
          record={record}
          updatingId={updatingId}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
}
