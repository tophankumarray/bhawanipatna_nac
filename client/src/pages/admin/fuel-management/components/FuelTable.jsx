// @ts-nocheck
const FuelTable = ({
  loading,
  filteredRecords,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
        Fuel Records
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-12 sm:py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-500"></div>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-12 sm:py-20">
          <div className="text-4xl sm:text-6xl mb-4">⛽</div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
            No Fuel Records Found
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            Try adjusting your filters or add a new fuel record
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-emerald-500 to-teal-500">
                <tr>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                    ID
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                    Vehicle
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                    Fuel Type
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                    Quantity
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                    Cost
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                    Odometer
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                    Efficiency
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                    Station
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((r) => (
                  <tr
                    key={r._id}
                    className="hover:bg-emerald-50 transition-colors"
                  >
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm font-bold text-gray-900">
                        {r._id}
                      </span>
                    </td>

                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-gray-900">
                          {r.vehicle}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-600">
                          {r.driver}
                        </div>
                      </div>
                    </td>

                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm text-gray-900">
                        {r.refuelDate}
                      </span>
                    </td>

                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                          r.fuelType === "diesel"
                            ? "bg-blue-100 text-blue-700"
                            : r.fuelType === "petrol"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {r.fuelType.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm font-bold text-blue-600">
                        {r.quantity} L
                      </span>
                    </td>

                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-emerald-600">
                          ₹{r.totalCost}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-600">
                          @ ₹{r.pricePerLiter}/L
                        </div>
                      </div>
                    </td>

                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm text-gray-900">
                        {r.odometer} km
                      </span>
                    </td>

                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm font-bold text-purple-600">
                        {r.efficiency || "N/A"} km/L
                      </span>
                    </td>

                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <span className="text-xs sm:text-sm text-gray-900">
                        {r.fillingStation}
                      </span>
                    </td>

                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <button
                          onClick={() => handleEdit(r)}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-xs sm:text-sm transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="text-red-600 hover:text-red-800 font-semibold text-xs sm:text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelTable;
