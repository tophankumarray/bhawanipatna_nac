// @ts-nocheck
import StatsCard from "../../../components/admin/StatsCard";
import { useWards } from "./useWards";

import WardFilters from "./components/WardFilters";
import WardGrid from "./components/WardGrid";
import AddWardModal from "./components/AddWardModal";

const WardsPage = () => {
  const {
    wards,
    loading,
    filters,
    setFilters,
    filteredWards,
    selectedWard,
    setSelectedWard,
    showAddModal,
    setShowAddModal,
    newWard,
    setNewWard,
    addWard,
  } = useWards();

  const statsCards = [
    {
      title: "Total Wards",
      value: wards.length,
      icon: "🏘️",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Daily Collection",
      value: wards.filter(w => w.collectionFrequency === "Daily").length,
      icon: "🗑️",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Total Population",
      value: wards.reduce((sum, w) => sum + w.population, 0),
      icon: "👥",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Households",
      value: wards.reduce((sum, w) => sum + w.household, 0),
      icon: "🏠",
      gradient: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Ward Management
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage all wards
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
          >
            ➕ Add Ward
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {statsCards.map((stat, index) => (
            <StatsCard
              key={index}
              {...stat}
              showButton={false}
            />
          ))}
        </div>

        {/* Filters */}
        <WardFilters
          filters={filters}
          setFilters={setFilters}
        />

        {/* Ward Cards */}
        {loading ? (
            <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500"></div>
          </div>
        ) : (
          <WardGrid
            wards={filteredWards}
            onView={setSelectedWard}
          />
        )}

        {/* Empty State */}
        {!loading && filteredWards.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center mt-6">
            <div className="text-6xl mb-4">🏘️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Wards Found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or add a new ward
            </p>
          </div>
        )}
      </div>


      {/* Add Ward Modal */}
      <AddWardModal
        show={showAddModal}
        newWard={newWard}
        setNewWard={setNewWard}
        onClose={() => setShowAddModal(false)}
        onSubmit={addWard}
      />
    </div>
  );
};

export default WardsPage;
