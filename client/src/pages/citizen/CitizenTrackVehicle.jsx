// @ts-nocheck
import TrackVehicleFilters from "../admin/track-vehicles/components/TrackVehicleFilters";
import TrackVehicleHeader from "../admin/track-vehicles/components/TrackVehicleHeader";
import TrackVehicleMap from "../admin/track-vehicles/components/TrackVehicleMap";
import TrackVehicleStats from "../admin/track-vehicles/components/TrackVehicleStats";
import VehicleList from "../admin/track-vehicles/components/VehicleList";
import { useTrackVehicle } from "../admin/track-vehicles/useTrackVehicle";

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
