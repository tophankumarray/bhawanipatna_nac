import React from "react";
import {
  CheckCircle,
  Calendar,
  User,
  Phone,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function DefectCard({ record, updatingId, onUpdateStatus }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-800">
              DEF-{record._id?.slice(-6).toUpperCase()}
            </h3>
            <p className="text-gray-600 font-semibold">{record.machineType}</p>
          </div>

          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold w-fit ${
              record.status === "started"
                ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                : record.status === "inprogress"
                ? "bg-orange-100 text-orange-800 border border-orange-300"
                : "bg-green-100 text-green-800 border border-green-300"
            }`}
          >
            {record.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-4 bg-blue-50 p-4 sm:p-5 rounded-xl border-2 border-blue-200">
              <User className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600 font-bold">Supervisor</p>
                <p className="font-bold text-gray-800">{record.supervisorName}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-purple-50 p-4 sm:p-5 rounded-xl border-2 border-purple-200">
              <Phone className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600 font-bold">Phone</p>
                <p className="font-bold text-gray-800">{record.contactNumber}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-orange-50 p-4 sm:p-5 rounded-xl border-2 border-orange-200">
              <Calendar className="h-6 w-6 text-orange-600" />
              <div>
                <p className="text-xs text-gray-600 font-bold">Created</p>
                <p className="font-bold text-gray-800">
                  {new Date(record.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-1 flex items-center justify-center">
            {record.image ? (
              <div className="border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg w-full h-40 sm:h-44">
                <img
                  src={`http://localhost:5900/${record.image}`}
                  alt="Defect"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center text-gray-400 italic text-sm w-full h-40 sm:h-44 border-2 border-dashed border-gray-300 rounded-xl">
                No image
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border-2 border-gray-200">
          <p className="text-sm text-gray-700 font-bold mb-2">Description:</p>
          <p className="text-gray-800">{record.description}</p>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => onUpdateStatus(record)}
            disabled={record.status === "repaired" || updatingId === record._id}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all duration-200 ${
              record.status === "repaired"
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
            }`}
          >
            {updatingId === record._id ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : record.status === "repaired" ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Completed
              </>
            ) : (
              <>
                Update Status <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
