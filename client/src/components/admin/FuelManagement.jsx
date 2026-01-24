// @ts-nocheck
import useFuelManagement from "../../pages/admin/fuel-management/useFuelManagement";

const FuelManagement = () => {
  const {
    stats,
    fuelRecords,
  } = useFuelManagement();

  /* Derived dashboard-level metrics */
  const today = new Date().toISOString().split("T")[0];

  const todayUsage = fuelRecords
    .filter(r => r.refuelDate === today)
    .reduce((s, r) => s + Number(r.quantity || 0), 0)
    .toFixed(1);

  const monthUsage = fuelRecords
    .filter(r => r.refuelDate?.slice(0, 7) === today.slice(0, 7))
    .reduce((s, r) => s + Number(r.quantity || 0), 0)
    .toFixed(1);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-800">Fuel Management</h3>
        <div className="p-2 bg-orange-50 rounded-lg">
          ⛽
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <div className="text-xs text-gray-600 font-medium mb-1">
            Today's Usage
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {todayUsage} L
          </div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <div className="text-xs text-gray-600 font-medium mb-1">
            This Month
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {monthUsage} L
          </div>
        </div>
      </div>

      {/* Cost */}
      <div className="bg-red-50 rounded-xl p-4 border border-red-100 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Total Fuel Cost
          </span>
          <span className="text-2xl font-bold text-red-600">
            ₹{stats.totalCost}
          </span>
        </div>
        <div className="text-xs text-gray-600">
          Average: ₹{stats.avgCostPerLiter || 0}/L
        </div>
      </div>

      {/* Alerts (future ready) */}
      <div className="text-xs text-gray-500 text-center py-3">
        No fuel alerts at this time
      </div>
    </div>
  );
};

export default FuelManagement;
