// @ts-nocheck
import { getStatusColor } from "../utils/complaint.utils";

const ComplaintTable = ({
  complaints,
  onStatusChange,
  onView,
  onImage,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-linear-to-r from-emerald-600 to-teal-600 text-white">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase">
                ID
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase">
                Title
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase hidden md:table-cell">
                Category
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase hidden lg:table-cell">
                Location
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase">
                Image
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase">
                Status
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase hidden xl:table-cell">
                Date
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {complaints.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No complaints found
                </td>
              </tr>
            ) : (
              complaints.map((complaint) => (
                <tr
                  key={complaint.id}
                  className="hover:bg-emerald-50 transition-colors"
                >
                  <td className="px-4 py-4 text-sm font-medium">
                    {complaint.id}
                  </td>

                  <td className="px-4 py-4 text-sm">
                    <p className="font-medium truncate">
                      {complaint.title}
                    </p>
                    <p className="text-xs text-gray-500 md:hidden">
                      {complaint.location}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-sm hidden md:table-cell">
                    {complaint.category}
                  </td>

                  <td className="px-4 py-4 text-sm hidden lg:table-cell">
                    {complaint.location}
                  </td>

                  <td className="px-4 py-4">
                    {complaint.photo ? (
                      <img
                        src={complaint.photo}
                        alt="Complaint"
                        className="h-12 w-12 rounded-lg object-cover cursor-pointer border"
                        onClick={() => onImage(complaint.photo)}
                      />
                    ) : (
                      <span className="text-xs text-gray-400">
                        No image
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <select
                      value={complaint.status}
                      onChange={(e) =>
                        onStatusChange(
                          complaint.id,
                          e.target.value
                        )
                      }
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                        complaint.status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">
                        In Progress
                      </option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>

                  <td className="px-4 py-4 text-sm hidden xl:table-cell">
                    {new Date(
                      complaint.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-4">
                    <button
                      onClick={() => onView(complaint)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintTable;
