import { Package, Plus, ShoppingCart } from "lucide-react";

const MoKhataStats = ({ khataStock, todayMade, todaySold }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Stock */}
      <div className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Package className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-indigo-100 text-sm font-medium mb-2">
            Current Stock
          </p>
          <p className="text-5xl font-bold text-white mb-2">{khataStock}</p>
          <p className="text-indigo-200 text-sm">Khata</p>
        </div>
      </div>

      {/* Made */}
      <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Plus className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-emerald-100 text-sm font-medium mb-2">
            Today Made
          </p>
          <p className="text-5xl font-bold text-white mb-2">{todayMade}</p>
          <p className="text-emerald-200 text-sm">Added</p>
        </div>
      </div>

      {/* Sold */}
      <div className="group relative bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-red-100 text-sm font-medium mb-2">Today Sold</p>
          <p className="text-5xl font-bold text-white mb-2">{todaySold}</p>
          <p className="text-red-200 text-sm">Sold</p>
        </div>
      </div>
    </div>
  );
};

export default MoKhataStats;
