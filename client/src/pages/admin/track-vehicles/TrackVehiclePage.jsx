// @ts-nocheck
import TrackVehicleFilters from "./components/TrackVehicleFilters";
import TrackVehicleHeader from "./components/TrackVehicleHeader";
import TrackVehicleMap from "./components/TrackVehicleMap";
import TrackVehicleStats from "./components/TrackVehicleStats";
import VehicleList from "./components/VehicleList";
import { useTrackVehicle } from "./useTrackVehicle";

const TrackVehiclePage = () => {
  const {
    vehicles,
    filteredVehicles,
    selectedVehicle,
    setSelectedVehicle,
    loading,
    filters,
    setFilters,
    uniqueWards,
  } = useTrackVehicle();

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        <TrackVehicleHeader />
        <TrackVehicleStats vehicles={vehicles} />
        <TrackVehicleFilters
          filters={filters}
          setFilters={setFilters}
          wards={uniqueWards}
        />
        <TrackVehicleMap
          vehicles={filteredVehicles}
          selectedVehicle={selectedVehicle}
        />
        <VehicleList
          filteredVehicles={filteredVehicles}
          loading={loading}
          setSelectedVehicle={setSelectedVehicle}
        />
      </div>
    </div>
  );
};

export default TrackVehiclePage;
