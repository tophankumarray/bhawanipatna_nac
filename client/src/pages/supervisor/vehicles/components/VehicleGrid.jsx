import VehicleCard from "./VehicleCard";

const VehicleGrid = ({ vehicles, onOpenDetails, onOpenMap }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {vehicles.map((v) => (
        <VehicleCard
          key={v.id}
          vehicle={v}
          onOpenDetails={onOpenDetails}
          onOpenMap={onOpenMap}
        />
      ))}
    </div>
  );
};

export default VehicleGrid;
