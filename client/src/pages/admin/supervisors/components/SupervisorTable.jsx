// @ts-nocheck
const SupervisorTable = ({ supervisors, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Supervisor List
      </h2>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-500 to-teal-500">
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">Username</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">Mobile</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {supervisors.map((supervisor) => (
              <tr
                key={supervisor._id}
                className="hover:bg-emerald-50 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {supervisor.supervisorName.charAt(0)}
                    </div>
                    <span className="ml-3 text-sm font-bold text-gray-900">
                      {supervisor.supervisorName}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4 text-sm font-semibold">
                  {supervisor.username}
                </td>

                <td className="px-4 py-4 text-sm text-gray-600">
                  {supervisor.email}
                </td>

                <td className="px-4 py-4 text-sm text-gray-900">
                  {supervisor.phoneNumber}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      supervisor.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {supervisor.status.toUpperCase()}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(supervisor)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(supervisor._id)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {supervisors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔑</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Supervisors Found
            </h3>
            <p className="text-gray-600">
              Create your first supervisor account to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorTable;
