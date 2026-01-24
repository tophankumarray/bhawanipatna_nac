// @ts-nocheck
const FuelDistribution = ({ stats }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
        Fuel Type Distribution
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Diesel */}
        <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Diesel</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.dieselRecords}
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">⛽</span>
            </div>
          </div>
        </div>

        {/* Petrol */}
        <div className="bg-orange-50 rounded-xl p-4 sm:p-6 border-2 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Petrol</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {stats.petrolRecords}
              </p>
            </div>
            <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">⛽</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelDistribution;
