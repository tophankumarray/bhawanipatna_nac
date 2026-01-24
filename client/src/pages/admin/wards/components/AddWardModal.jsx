// @ts-nocheck
const AddWardModal = ({
  show,
  newWard,
  setNewWard,
  onClose,
  onSubmit,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Add New Ward
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ward Name *
                </label>
                <input
                  type="text"
                  required
                  value={newWard.wardName}
                  onChange={(e) =>
                    setNewWard({ ...newWard, wardName: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Ward 1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Area *
                </label>
                <input
                  type="text"
                  required
                  value={newWard.area}
                  onChange={(e) =>
                    setNewWard({ ...newWard, area: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="5.2 km²"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Population *
                </label>
                <input
                  type="number"
                  required
                  value={newWard.population}
                  onChange={(e) =>
                    setNewWard({ ...newWard, population: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="12500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Households *
                </label>
                <input
                  type="number"
                  required
                  value={newWard.household}
                  onChange={(e) =>
                    setNewWard({ ...newWard, household: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="2850"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Waste Generation/Day (tons) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWard.wasteGenerationPerDay}
                  onChange={(e) =>
                    setNewWard({
                      ...newWard,
                      wasteGenerationPerDay: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="8.5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Collection Frequency *
                </label>
                <select
                  required
                  value={newWard.collectionFrequency}
                  onChange={(e) =>
                    setNewWard({
                      ...newWard,
                      collectionFrequency: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="alternate">Alternate Days</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Supervisor Name *
                </label>
                <input
                  type="text"
                  required
                  value={newWard.supervisorName}
                  onChange={(e) =>
                    setNewWard({
                      ...newWard,
                      supervisorName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Rajesh Kumar"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Supervisor Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={newWard.supervisorPhone}
                  onChange={(e) =>
                    setNewWard({
                      ...newWard,
                      supervisorPhone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-xl font-semibold transition-all"
              >
                Add Ward
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWardModal;
