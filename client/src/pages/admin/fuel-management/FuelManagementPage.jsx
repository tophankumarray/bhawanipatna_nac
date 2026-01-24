// @ts-nocheck
import FuelModal from "./components/FuelModal";
import FuelFilters from "./components/FuelFilters";
import FuelStats from "./components/FuelStats";
import FuelDistribution from "./components/FuelDistribution";
import FuelTable from "./components/FuelTable";

import useFuelManagement from "./useFuelManagement";

const FuelManagementPage = () => {
  const {
    /* state */
    loading,
    filteredRecords,
    filters,
    formData,
    showModal,
    editMode,
    stats,

    /* helpers */
    setFilters,
    getUniqueVehicles,

    /* modal & form */
    openModal,
    closeModal,
    handleInputChange,
    handleSubmit,

    /* table actions */
    handleEdit,
    handleDelete,

    /* pdf */
    downloadPDF,
  } = useFuelManagement();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Modal */}
        <FuelModal
          showModal={showModal}
          editMode={editMode}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          closeModal={closeModal}
        />

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-emerald-600">
                Fuel Management
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Track and manage vehicle fuel consumption
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={openModal}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
              >
                ⛽ Add Fuel
              </button>

              <button
                onClick={downloadPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
              >
                📄 Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <FuelStats stats={stats} />

        {/* Fuel Distribution */}
        <FuelDistribution stats={stats} />

        {/* Filters */}
        <FuelFilters
          filters={filters}
          setFilters={setFilters}
          getUniqueVehicles={getUniqueVehicles}
        />

        {/* Table */}
        <FuelTable
          loading={loading}
          filteredRecords={filteredRecords}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default FuelManagementPage;
