import { Calendar, Cuboid, Phone, User } from "lucide-react";

const RecordCard = ({ record, activeTab }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-2xl shadow-lg">
              <Cuboid className="h-8 w-8 text-white" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-800">
                {activeTab}-{record._id?.slice(-5) || record.id}
              </h3>
              <p className="text-gray-600 font-semibold">
                Cube #{record.cubeNumber}
              </p>
            </div>
          </div>

          <span className="px-4 py-2 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300 w-fit">
            {record.status || "Stored"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-4 bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border-2 border-blue-200">
              <User className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600 font-bold mb-1">
                  Supervisor
                </p>
                <p className="font-bold text-gray-800 text-base">
                  {record.supervisorName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border-2 border-purple-200">
              <Phone className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600 font-bold mb-1">Contact</p>
                <p className="font-bold text-gray-800 text-base">
                  {record.contactNumber || record.phoneNo || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border-2 border-orange-200">
              <Calendar className="h-6 w-6 text-orange-600" />
              <div>
                <p className="text-xs text-gray-600 font-bold mb-1">
                  Date & Time
                </p>
                <p className="font-bold text-gray-800 text-base">
                  {record.dateSubmitted
                    ? new Date(record.dateSubmitted).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-1 flex items-center justify-center">
            {record.image ? (
              <div className="border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg w-full h-44">
                <img
                  src={`http://localhost:5900/${record.image}`}
                  alt="Record"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center text-gray-400 italic text-sm w-full h-44 border-2 border-dashed border-gray-300 rounded-xl">
                No image
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordCard;
