// @ts-nocheck
const WasteTable = ({
  loading,
  filteredCollections,
  handleEdit,
  handleDelete,
  setShowModal,
}) => {
  /* ================= HELPERS ================= */
  const getWasteTypeIcon = (type) => {
    const icons = {
      "Mixed Waste": "🗑️",
      "Organic Waste": "🍃",
      Recyclable: "♻️",
      Hazardous: "⚠️",
    };
    return icons[type] || "🗑️";
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-emerald-100 text-emerald-700",
      inprogress: "bg-blue-100 text-blue-700",
      pending: "bg-orange-100 text-orange-700",
      cancel: "bg-red-100 text-red-700",
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Waste Collection Records
      </h2>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500"></div>
          <p className="text-gray-600 font-semibold">Loading collections...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-emerald-500 to-teal-500">
                <th className="px-6 py-4 text-left text-sm font-bold text-white">ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Ward</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Vehicle</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Route</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Waste Type</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Collected</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredCollections.map((collection, index) => (
                <tr
                  key={collection._id}
                  className={`hover:bg-emerald-50 transition-colors ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    {collection._id}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {collection.ward}
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <div className="font-bold">{collection.vehicle}</div>
                      <div className="text-xs text-gray-600">{collection.driver}</div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="bg-blue-50 px-3 py-1 rounded-lg font-bold">
                      {collection.route}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {getWasteTypeIcon(collection.wasteType)}
                      </span>
                      <span className="font-bold">{collection.wasteType}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <div className="font-black text-emerald-600">
                        {collection.quantity} tons
                      </div>
                      <div className="text-xs text-gray-500">
                        Target: {collection.targetQuantity} tons
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-2 rounded-xl text-xs font-black ${getStatusColor(
                        collection.status
                      )}`}
                    >
                      {collection.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(collection)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(collection._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCollections.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold">No Collections Found</h3>
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold"
              >
                + Add First Collection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WasteTable;
