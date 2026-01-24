// @ts-nocheck
const WasteProgress = ({ totalWaste, targetWaste }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Today's Collection Progress
      </h2>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Total Waste Collected
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-emerald-600">
              {totalWaste}
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-lg font-semibold text-gray-600">
              {targetWaste} tons
            </span>
          </div>
        </div>

        <div className="relative w-full bg-gray-200 rounded-xl h-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl transition-all duration-1000"
            style={{
              width: `${Math.min(
                (totalWaste / targetWaste) * 100,
                100
              )}%`,
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between bg-emerald-50 rounded-xl p-4">
        <span className="text-sm font-semibold text-emerald-800">
          Target Achievement
        </span>
        <span className="text-xl font-bold text-emerald-700">
          {((totalWaste / targetWaste) * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default WasteProgress;
