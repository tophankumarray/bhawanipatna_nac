// @ts-nocheck
const FuelModal = ({
  showModal,
  editMode,
  formData,
  handleInputChange,
  handleSubmit,
  closeModal,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {editMode ? "Edit Fuel Record" : "Add Fuel Record"}
            </h2>
            <button
              onClick={closeModal}
              className="text-white hover:text-gray-200 text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vehicle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vehicle Number *
              </label>
              <input
                type="text"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleInputChange}
                required
                placeholder="e.g., OD-01-1234"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Driver */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Driver Name *
              </label>
              <input
                type="text"
                name="driver"
                value={formData.driver}
                onChange={handleInputChange}
                required
                placeholder="Enter driver name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Refuel Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Refuel Date *
              </label>
              <input
                type="date"
                name="refuelDate"
                value={formData.refuelDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fuel Type *
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="diesel">Diesel</option>
                <option value="petrol">Petrol</option>
                <option value="cng">CNG</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity (Liters) *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                placeholder="e.g., 50"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Price per Liter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price per Liter (₹) *
              </label>
              <input
                type="number"
                name="pricePerLiter"
                value={formData.pricePerLiter}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                placeholder="e.g., 95.50"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Odometer */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Odometer Reading (km) *
              </label>
              <input
                type="number"
                name="odometer"
                value={formData.odometer}
                onChange={handleInputChange}
                required
                min="0"
                placeholder="e.g., 12500"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Efficiency */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Efficiency (km/L)
              </label>
              <input
                type="number"
                name="efficiency"
                value={formData.efficiency}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                placeholder="e.g., 12.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Filling Station */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filling Station *
              </label>
              <input
                type="text"
                name="fillingStation"
                value={formData.fillingStation}
                onChange={handleInputChange}
                required
                placeholder="e.g., Indian Oil - Main Road"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Total Cost Display */}
          {formData.quantity && formData.pricePerLiter && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
              <p className="text-sm text-gray-600 font-semibold">
                Total Cost
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                ₹
                {(
                  parseFloat(formData.quantity || 0) *
                  parseFloat(formData.pricePerLiter || 0)
                ).toFixed(2)}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg"
            >
              {editMode ? "Update Record" : "Add Fuel Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FuelModal;
