// @ts-nocheck
const WasteModal = ({
  showModal,
  selectedCollection,
  formData,
  setFormData,
  handleSubmit,
  handleCloseModal,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-linear-to-br from-white to-emerald-50 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-emerald-100 transform transition-all animate-slideUp">
        <div className="p-8">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">
                  {selectedCollection ? "✏️" : "➕"}
                </span>
              </div>
              <h2 className="text-3xl font-black bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {selectedCollection ? "Edit Collection" : "Add New Collection"}
              </h2>
            </div>
            <button
              onClick={handleCloseModal}
              className="w-10 h-10 bg-gray-200 hover:bg-red-500 hover:text-white text-gray-700 rounded-xl text-2xl font-black transition-all transform hover:scale-110 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Ward */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">
                  Ward *
                </label>
                <select
                  value={formData.ward}
                  onChange={(e) =>
                    setFormData({ ...formData, ward: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium bg-white"
                  required
                >
                  <option value="">Select Ward</option>
                  <option value="Ward 1">Ward 1</option>
                  <option value="Ward 2">Ward 2</option>
                  <option value="Ward 3">Ward 3</option>
                  <option value="Ward 4">Ward 4</option>
                  <option value="Ward 5">Ward 5</option>
                </select>
              </div>

              {/* Vehicle */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">
                  Vehicle *
                </label>
                <input
                  type="text"
                  value={formData.vehicle}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicle: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
                  placeholder="OD-05-1234"
                  required
                />
              </div>

              {/* Driver */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">
                  Driver Name *
                </label>
                <input
                  type="text"
                  value={formData.driver}
                  onChange={(e) =>
                    setFormData({ ...formData, driver: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
                  placeholder="Driver Name"
                  required
                />
              </div>

              {/* Route */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">
                  Route *
                </label>
                <input
                  type="text"
                  value={formData.route}
                  onChange={(e) =>
                    setFormData({ ...formData, route: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
                  placeholder="Route A-1"
                  required
                />
              </div>

              {/* Waste Type */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">
                  Waste Type *
                </label>
                <select
                  value={formData.wasteType}
                  onChange={(e) =>
                    setFormData({ ...formData, wasteType: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium bg-white"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Mixed Waste">Mixed Waste</option>
                  <option value="Organic Waste">Organic Waste</option>
                  <option value="Recyclable">Recyclable</option>
                  <option value="Hazardous">Hazardous</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">
                  Target Quantity (tons) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
                  placeholder="0.0"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">
                  Collection Date *
                </label>
                <input
                  type="date"
                  value={formData.collectionDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      collectionDate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium bg-white"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="inprogress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancel">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
                rows="4"
                placeholder="Additional notes or comments..."
              />
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-4 rounded-xl font-black text-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 rounded-xl font-black text-lg transition-all shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                {selectedCollection ? "✓ Update" : "+ Add"} Collection
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WasteModal;
