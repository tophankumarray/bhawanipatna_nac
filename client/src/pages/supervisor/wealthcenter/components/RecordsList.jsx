import { AlertCircle } from "lucide-react";
import RecordCard from "./RecordCard";

const RecordsList = ({ loading, records, activeTab }) => {
  if (loading) {
    return (
      <div className="text-center text-gray-600 font-semibold">
        Loading records...
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-10 sm:p-20 text-center border border-gray-100">
        <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">
          No Records Found
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {records
        .slice()
        .sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted))
        .map((record) => (
          <RecordCard
            key={record._id || record.id}
            record={record}
            activeTab={activeTab}
          />
        ))}
    </div>
  );
};

export default RecordsList;
