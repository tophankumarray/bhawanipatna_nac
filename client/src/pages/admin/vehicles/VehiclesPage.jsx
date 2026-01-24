// @ts-nocheck
import { toast } from "react-toastify";
import VehicleDetailsModal from "./components/VehicleDetailsModal";
import VehicleFilters from "./components/VehicleFilters";
import VehicleGrid from "./components/VehicleGrid";
import { useVehicles } from "./useVehicles";

const VehiclesPage = () => {
  const {
    loading,
    filters,
    setFilters,
    filteredVehicles,
    selectedVehicle,
    setSelectedVehicle,
  } = useVehicles();

  const handleTrackLive = () => {
    toast.info("GPS tracking coming soon!");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 lg:px-20">
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Vehicle Details
              </h1>
              <p className="text-gray-600 mt-1">Monitor and manage your fleet</p>
            </div>
          </div>
        </div>
      <VehicleFilters
        filters={filters}
        setFilters={setFilters}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500"></div>
          </div>
      ) : (
        <VehicleGrid
          vehicles={filteredVehicles}
          onView={setSelectedVehicle}
          onTrack={handleTrackLive}
        />
      )}

      {selectedVehicle && (
        <VehicleDetailsModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onTrack={handleTrackLive}
        />
      )}
    </div>
  );
};

export default VehiclesPage;
