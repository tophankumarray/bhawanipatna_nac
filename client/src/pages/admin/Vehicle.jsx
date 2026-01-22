// @ts-nocheck
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/api';
import VehicleCard from '../../components/admin/VehicleCard';

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    type: 'all'
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const ALLOWED_VEHICLES = [
  "OD33AR9619",
  "OD33AR9647",
  "OD07AV6580",
  "OD07AB8906",
  "OD07AB8905",
];

  

  // Fetch vehicles from API
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
  try {
    setLoading(true);

    const response = await api.get('/tracking/trackings');
    const list = response.data?.data?.list || [];

    const normalizedVehicles = list.map(item => ({
      id: item.imei,
      registrationNumber: item.truck_number,
      status: item.status,
      assignedWard: item.address,
      speed: item.speed,
      lat: item.lat,
      lng: item.lng,
      signalStrength: item.signal_strength,
      ignitionOn: item.is_ignition_on?.value,
      lastUpdated: new Date(item.device_timestamp),
    }));

    // ✅ SHOW ONLY REQUIRED VEHICLES
    const filteredByAllowed = normalizedVehicles.filter(v =>
      ALLOWED_VEHICLES.includes(v.registrationNumber)
    );

    setVehicles(filteredByAllowed);

  } catch (error) {
    console.error('Error fetching vehicles:', error);
    toast.error('Failed to load vehicles');
    setVehicles([]);
  } finally {
    setLoading(false);
  }
};




  const handleViewDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  const handleTrackLive = () => {
    toast.info('GPS tracking feature coming soon!');
  };

  const getStatusBadge = (status) => {
    const badges = {
      running: 'bg-linear-to-r from-emerald-500 to-teal-500',
      standing: 'bg-gradient-to-r from-blue-400 to-indigo-400',
      stopped: 'bg-gradient-to-r from-orange-500 to-amber-500',
      dataNotRetrieving: 'bg-gradient-to-r from-gray-400 to-gray-500'
    };
    return badges[status] || badges.stopped;
  };

 const filteredVehicles = vehicles.filter(vehicle => {
  const matchesStatus =
    filters.status === 'all' || vehicle.status === filters.status;

  const matchesType =
    filters.type === 'all' || vehicle.type === filters.type;

  const matchesSearch =
    !filters.search ||
    vehicle.registrationNumber
      ?.toLowerCase()
      .includes(filters.search.toLowerCase()) ||
    vehicle.assignedWard
      ?.toLowerCase()
      .includes(filters.search.toLowerCase());

  return matchesStatus && matchesType && matchesSearch;
});


  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Vehicle Details
              </h1>
              <p className="text-gray-600 mt-1">Monitor and manage your fleet</p>
            </div>
            {/* <button
              onClick={() => setShowAddModal(true)}
              className="bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">➕</span>
              Add Vehicle
            </button> */}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Registration, Driver, Ward..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option value="all">All Status</option>
                <option value="running">Running</option>
                <option value="standing">Standing</option>
                <option value="stopped">Stopped</option>
                <option value="dataNotRetrieving">Data Not Retrieving</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                      <option value="all">All Types</option>
                      <option value="cesspool">Cesspool</option>
                      <option value="tractor">Tractor</option>
                      <option value="jcb">JCB</option>
                      <option value="bucket-truck">Bucket Truck</option>
                      <option value="ev">Electric Vehicle</option>
                      <option value="road-sweeper-truck ">Road Sweeper Truck </option>
              </select>
            </div>
          </div>
        </div>

        {/* Vehicle Cards */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onViewDetails={handleViewDetails}
                onTrackLive={handleTrackLive}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredVehicles.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🚛</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Vehicles Found</h3>
            <p className="text-gray-600">Try adjusting your filters or add a new vehicle</p>
          </div>
        )}
      </div>

      {/* Vehicle Details Modal */}
      {showModal && selectedVehicle && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Vehicle Details
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Registration Number</p>
              <p className="text-lg font-bold text-gray-900">
                {selectedVehicle.registrationNumber || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 font-semibold">Status</p>
              <span
                className={`${getStatusBadge(
                  selectedVehicle.status,
                  selectedVehicle.ignitionOn
                )} text-white text-sm font-bold px-3 py-1 rounded-full inline-block mt-1`}
              >
                {selectedVehicle.ignitionOn ? "Running" : selectedVehicle.status || "Unknown"}
              </span>
            </div>
          </div>

          {/* Location & Speed */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Assigned Ward</p>
              <p className="text-base font-bold text-gray-900">
                {selectedVehicle.assignedWard || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 font-semibold">Speed</p>
              <p className="text-base font-bold text-gray-900">
                {selectedVehicle.speed != null
                  ? `${selectedVehicle.speed} km/h`
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* GPS & Ignition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Ignition</p>
              <p
                className={`text-base font-bold ${
                  selectedVehicle.ignitionOn ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {selectedVehicle.ignitionOn ? "ON" : "OFF"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 font-semibold">Signal Strength</p>
              <p className="text-base font-bold text-gray-900">
                {selectedVehicle.signalStrength ?? "N/A"}
              </p>
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Latitude</p>
              <p className="text-sm font-mono text-gray-900">
                {selectedVehicle.lat ?? "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">Longitude</p>
              <p className="text-sm font-mono text-gray-900">
                {selectedVehicle.lng ?? "N/A"}
              </p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 font-semibold">Last Updated</p>
            <p className="text-base font-bold text-gray-900">
              {selectedVehicle.lastUpdated
                ? selectedVehicle.lastUpdated.toLocaleString()
                : "N/A"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-xl font-semibold transition-all"
            >
              Close
            </button>
            <button
              onClick={() => onTrackLive(selectedVehicle)}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 rounded-xl font-semibold transition-all"
            >
              Track Live
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default Vehicle;
