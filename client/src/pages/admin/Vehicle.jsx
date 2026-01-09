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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    registrationNumber: '',
    type: 'compactor',
    model: '',
    capacity: '',
    fuelType: 'diesel',
    assignedWard: '',
    driverName: '',
    driverPhone: ''
  });

  // Fetch vehicles from API
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vehicles');
      console.log('Admin vehicles API response:', response.data);
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load vehicles');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };



  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      // Create complete vehicle object with both field name conventions
      const completeVehicle = {
        registrationNumber: newVehicle.registrationNumber,
        number: newVehicle.registrationNumber, // For supervisor compatibility
        type: newVehicle.type,
        model: newVehicle.model,
        capacity: newVehicle.capacity,
        fuelType: newVehicle.fuelType,
        assignedWard: newVehicle.assignedWard,
        ward: newVehicle.assignedWard, // For supervisor compatibility
        driverName: newVehicle.driverName,
        driver: newVehicle.driverName, // For supervisor compatibility
        driverPhone: newVehicle.driverPhone,
        status: 'Inactive', // Default status
        speed: 0,
        fuelLevel: 100,
        odometer: 0,
        maintenanceStatus: 'good',
        lastService: new Date().toISOString().split('T')[0],
        nextService: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        location: {
          lat: 20.2961,
          lng: 85.8245
        },
        route: 'Zone A',
        averageSpeed: 0
      };
      
      const response = await api.post('/vehicles', completeVehicle);
      toast.success('Vehicle added successfully');
      setShowAddModal(false);
      setNewVehicle({
        registrationNumber: '',
        type: 'compactor',
        model: '',
        capacity: '',
        fuelType: 'diesel',
        assignedWard: '',
        driverName: '',
        driverPhone: ''
      });
      fetchVehicles();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('Failed to add vehicle');
    }
  };

  const handleUpdateStatus = async (vehicleId, newStatus) => {
    try {
      await api.patch(`/vehicles/${vehicleId}`, { status: newStatus });
      toast.success('Vehicle status updated');
      fetchVehicles();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
      await api.delete(`/vehicles/${vehicleId}`);
      toast.success('Vehicle deleted successfully');
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
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
      running: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      standing: 'bg-gradient-to-r from-blue-400 to-indigo-400',
      stopped: 'bg-gradient-to-r from-orange-500 to-amber-500',
      dataNotRetrieving: 'bg-gradient-to-r from-gray-400 to-gray-500'
    };
    return badges[status] || badges.stopped;
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesStatus = filters.status === 'all' || vehicle.status === filters.status;
    const matchesType = filters.type === 'all' || vehicle.type === filters.type;
    const matchesSearch = !filters.search || 
                         vehicle.registrationNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         vehicle.driverName?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         vehicle.assignedWard?.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Vehicle Management
              </h1>
              <p className="text-gray-600 mt-1">Monitor and manage your fleet</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">➕</span>
              Add Vehicle
            </button>
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
                <option value="compactor">Compactor</option>
                <option value="tipper">Tipper</option>
                <option value="mini-truck">Mini Truck</option>
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
                onDelete={handleDeleteVehicle}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Registration Number</p>
                    <p className="text-lg font-bold text-gray-900">{selectedVehicle.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Status</p>
                    <span className={`${getStatusBadge(selectedVehicle.status)} text-white text-sm font-bold px-3 py-1 rounded-full inline-block mt-1`}>
                      {selectedVehicle.status || 'Unknown'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Type</p>
                    <p className="text-base font-bold text-gray-900 capitalize">{selectedVehicle.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Model</p>
                    <p className="text-base font-bold text-gray-900">{selectedVehicle.model}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Capacity</p>
                    <p className="text-base font-bold text-gray-900">{selectedVehicle.capacity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Fuel Type</p>
                    <p className="text-base font-bold text-gray-900 capitalize">{selectedVehicle.fuelType}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Driver Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Name</p>
                      <p className="text-base font-bold text-gray-900">{selectedVehicle.driverName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Phone</p>
                      <p className="text-base font-bold text-gray-900">{selectedVehicle.driverPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Maintenance & Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Last Service</p>
                      <p className="text-base font-bold text-gray-900">{new Date(selectedVehicle.lastService).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Next Service</p>
                      <p className="text-base font-bold text-gray-900">{new Date(selectedVehicle.nextService).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Odometer</p>
                      <p className="text-base font-bold text-gray-900">{selectedVehicle.odometer?.toLocaleString() || 'N/A'} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Insurance Expiry</p>
                      <p className="text-base font-bold text-gray-900">{selectedVehicle.insuranceExpiry ? new Date(selectedVehicle.insuranceExpiry).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-xl font-semibold transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => toast.info('Edit feature coming soon!')}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 rounded-xl font-semibold transition-all"
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Add New Vehicle
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Number *</label>
                    <input
                      type="text"
                      required
                      value={newVehicle.registrationNumber}
                      onChange={(e) => setNewVehicle({ ...newVehicle, registrationNumber: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="OD-05-1234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Type *</label>
                    <select
                      required
                      value={newVehicle.type}
                      onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="compactor">Compactor</option>
                      <option value="tipper">Tipper</option>
                      <option value="mini-truck">Mini Truck</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Model *</label>
                    <input
                      type="text"
                      required
                      value={newVehicle.model}
                      onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Tata LPT 1613"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity *</label>
                    <input
                      type="text"
                      required
                      value={newVehicle.capacity}
                      onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="10 tons"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fuel Type *</label>
                    <select
                      required
                      value={newVehicle.fuelType}
                      onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="diesel">Diesel</option>
                      <option value="petrol">Petrol</option>
                      <option value="cng">CNG</option>
                      <option value="electric">Electric</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned Ward *</label>
                    <input
                      type="text"
                      required
                      value={newVehicle.assignedWard}
                      onChange={(e) => setNewVehicle({ ...newVehicle, assignedWard: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Ward 5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Driver Name *</label>
                    <input
                      type="text"
                      required
                      value={newVehicle.driverName}
                      onChange={(e) => setNewVehicle({ ...newVehicle, driverName: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Ramesh Singh"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Driver Phone *</label>
                    <input
                      type="tel"
                      required
                      value={newVehicle.driverPhone}
                      onChange={(e) => setNewVehicle({ ...newVehicle, driverPhone: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-xl font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-xl font-semibold transition-all"
                  >
                    Add Vehicle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicle;
