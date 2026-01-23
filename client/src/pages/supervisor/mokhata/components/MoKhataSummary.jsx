import { TrendingUp } from "lucide-react";
import { calcSalesRate } from "../utils/moKhataHelpers";

const MoKhataSummary = ({ todayMade, todaySold, khataStock }) => {
  const netChange = todayMade - todaySold;
  const salesRate = calcSalesRate(todayMade, todaySold);

  return (
    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-8 text-white mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold">Daily Summary</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
          <p className="text-purple-100 text-sm mb-2 font-medium">
            Net Change Today
          </p>
          <p className="text-4xl font-bold">
            {netChange > 0 ? "+" : ""}
            {netChange}
          </p>
          <p className="text-purple-200 text-xs mt-2">Khata</p>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
          <p className="text-purple-100 text-sm mb-2 font-medium">
            Sales Rate
          </p>
          <p className="text-4xl font-bold">{salesRate}%</p>
          <p className="text-purple-200 text-xs mt-2">Conversion</p>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
          <p className="text-purple-100 text-sm mb-2 font-medium">
            Remaining Stock
          </p>
          <p className="text-4xl font-bold">{khataStock}</p>
          <p className="text-purple-200 text-xs mt-2">Available</p>
        </div>
      </div>
    </div>
  );
};

export default MoKhataSummary;
