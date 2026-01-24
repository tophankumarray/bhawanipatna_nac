// @ts-nocheck
import VehicleCard from "../../../../components/admin/VehicleCard";

const VehicleGrid = ({ vehicles = [], onView, onTrack }) => {
  if (!vehicles.length) {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🚛</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Vehicles Found</h3>
            <p className="text-gray-600">Try adjusting your filters or add a new vehicle</p>
          </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {vehicles.map(vehicle => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onViewDetails={onView}
          onTrackLive={onTrack}
        />
      ))}
    </div>
  );
};

export default VehicleGrid;
