const NoVehiclesFound = () => {
  return (
  <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🚛</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Vehicles Found</h3>
            <p className="text-gray-600">Try adjusting your filters or add a new vehicle</p>
          </div>
  );
};

export default NoVehiclesFound;
