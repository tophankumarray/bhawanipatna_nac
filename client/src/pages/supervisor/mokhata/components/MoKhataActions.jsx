import { Minus, Plus } from "lucide-react";

const MoKhataActions = ({
  addAmountInput,
  setAddAmountInput,
  soldAmountInput,
  setSoldAmountInput,
  onAdd,
  onSell,
  loading,
  khataStock,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-[90%] mx-auto">
      {/* Add */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-100 hover:border-green-300 transition-colors duration-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Add Khata</h3>
        </div>

        <input
          type="number"
          value={addAmountInput}
          onChange={(e) => setAddAmountInput(e.target.value)}
          placeholder="Enter quantity"
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold text-gray-800 transition-all duration-200 mb-5"
          min="1"
        />

        <button
          onClick={onAdd}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-60 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
        >
          Add to Stock
        </button>
      </div>

      {/* Sell */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-100 hover:border-orange-300 transition-colors duration-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl">
            <Minus className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Sold Khata</h3>
        </div>

        <input
          type="number"
          value={soldAmountInput}
          onChange={(e) => setSoldAmountInput(e.target.value)}
          placeholder="Enter quantity"
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-semibold text-gray-800 transition-all duration-200 mb-5"
          min="1"
          max={khataStock}
        />

        <button
          onClick={onSell}
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-60 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
        >
          Mark as Sold
        </button>
      </div>
    </div>
  );
};

export default MoKhataActions;
