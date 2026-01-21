// @ts-nocheck
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/api';
import StatsCard from '../../components/admin/StatsCard';
import WardCard from '../../components/admin/WardCard';


const Ward = () => {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: ''
  });
  const [selectedWard, setSelectedWard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
 const [newWard, setNewWard] = useState({
  wardName: '',
  area: '',
  population: '',
  household: '',
  wasteGenerationPerDay: '',
  collectionFrequency: 'daily',
  supervisorName: '',
  supervisorPhone: ''
});

  // Fetch wards from API
  useEffect(() => {
    fetchWards();
  }, [filters]);

const fetchWards = async () => {
  try {
    setLoading(true);
    const response = await api.get('/wards/getallwards');

    // backend already gives correct data
    setWards(response.data.data);

  } catch (error) {
    console.error('Error fetching wards:', error);
    toast.error('Failed to load wards');
    setWards([]);
  } finally {
    setLoading(false);
  }
};

 const handleAddWard = async (e) => {
  e.preventDefault();

  try {
    const wardToAdd = {
      wardName: newWard.wardName,
      area: Number(newWard.area),
      population: Number(newWard.population),
      household: Number(newWard.household),
      wasteGenerationPerDay: Number(newWard.wasteGenerationPerDay),
      collectionFrequency:
        newWard.collectionFrequency.charAt(0).toUpperCase() +
        newWard.collectionFrequency.slice(1),
      supervisorName: newWard.supervisorName,
      supervisorPhone: newWard.supervisorPhone,
    };

    await api.post('/wards/createward', wardToAdd);

    toast.success('Ward added successfully');
    setShowAddModal(false);

    setNewWard({
      wardName: '',
      area: '',
      population: '',
      household: '',
      wasteGenerationPerDay: '',
      collectionFrequency: 'daily',
      supervisorName: '',
      supervisorPhone: ''
    });

    fetchWards(); // ✅ source of truth

  } catch (error) {
    console.error(error.response?.data || error);
    toast.error('Failed to add ward');
  }
};




  const filteredWards = wards.filter(w => {
  const matchesSearch =
    !filters.search ||
    w.wardName?.toLowerCase().includes(filters.search.toLowerCase()) ||
    w.supervisorName?.toLowerCase().includes(filters.search.toLowerCase());

  return matchesSearch;
});


 const statsCards = [
  {
    title: "Total Wards",
    value: wards.length,
    icon: "🏘️",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    title: "Daily Collection",
    value: wards.filter(w => w.collectionFrequency === "Daily").length,
    icon: "🗑️",
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    title: "Total Population",
    value: wards.reduce((sum, w) => sum + w.population, 0),
    icon: "👥",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Households",
    value: wards.reduce((sum, w) => sum + w.household, 0),
    icon: "🏠",
    gradient: "from-orange-500 to-amber-500"
  }
];


  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Ward Management
              </h1>
              <p className="text-gray-600 mt-1">Monitor and manage all wards</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">➕</span>
              Add Ward
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} showButton={false} />
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Ward name, Supervisor..."
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
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ward Cards */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredWards.map((ward) => (
              <WardCard
                key={ward._id}
                ward={ward}
                
             
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredWards.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🏘️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Wards Found</h3>
            <p className="text-gray-600">Try adjusting your filters or add a new ward</p>
          </div>
        )}
      </div>

      {/* Ward Details Modal */}
      {showModal && selectedWard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Ward Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Ward Name</p>
                      <p className="text-lg font-bold text-gray-900">{selectedWard.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Status</p>
                      <span className={`${getStatusBadge(selectedWard.status)} text-white text-sm font-bold px-3 py-1 rounded-full inline-block mt-1 capitalize`}>
                        {selectedWard.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Area</p>
                      <p className="text-base font-bold text-gray-900">{selectedWard.area}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Collection Frequency</p>
                      <p className="text-base font-bold text-gray-900 capitalize">{selectedWard.collectionFrequency}</p>
                    </div>
                  </div>
                </div>

                {/* Demographics */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Demographics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Population</p>
                      <p className="text-base font-bold text-gray-900">{selectedWard.population.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Households</p>
                      <p className="text-base font-bold text-gray-900">{selectedWard.households.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Waste Generation/Day</p>
                      <p className="text-base font-bold text-gray-900">{selectedWard.wasteGenerationPerDay} tons</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Bin Locations</p>
                      <p className="text-base font-bold text-gray-900">{selectedWard.binLocations}</p>
                    </div>
                  </div>
                </div>

                {/* Supervisor Information */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Supervisor Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Name</p>
                      <p className="text-base font-bold text-gray-900">{selectedWard.supervisorName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Phone</p>
                      <p className="text-base font-bold text-gray-900">{selectedWard.supervisorPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Resources */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Assigned Resources</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-2">Vehicles ({selectedWard.assignedVehicles.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedWard.assignedVehicles.map((vehicle, index) => (
                          <span key={index} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {vehicle}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Staff Members</p>
                      <p className="text-base font-bold text-gray-900">{selectedWard.assignedStaff} personnel</p>
                    </div>
                  </div>
                </div>

                {/* Performance */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Today's Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Completion Rate</p>
                      <p className="text-base font-bold text-emerald-600">{selectedWard.completion}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Collected Today</p>
                      <p className="text-base font-bold text-gray-900">{selectedWard.collectedToday} / {selectedWard.targetDaily} tons</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Active Complaints</p>
                      <p className={`text-base font-bold ${selectedWard.complaints > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {selectedWard.complaints}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Last Collection</p>
                      <p className="text-base font-bold text-gray-900">
                        {new Date(selectedWard.lastCollectionTime).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-xl font-semibold transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => toast.info('Edit feature coming soon!')}
                    className="flex-1 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 rounded-xl font-semibold transition-all"
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Ward Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Add New Ward
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddWard} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ward Name *</label>
                    <input
                      type="text"
                      required
                      value={newWard.wardName}
                      onChange={(e) => setNewWard({ ...newWard, wardName: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Ward 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Area *</label>
                    <input
                      type="text"
                      required
                      value={newWard.area}
                      onChange={(e) => setNewWard({ ...newWard, area: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="5.2 km²"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Population *</label>
                    <input
                      type="number"
                      required
                      value={newWard.population}
                      onChange={(e) => setNewWard({ ...newWard, population: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="12500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Households *</label>
                    <input
                      type="number"
                      required
                        value={newWard.household}
                      onChange={(e) => setNewWard({ ...newWard, household: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="2850"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Waste Generation/Day (tons) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newWard.wasteGenerationPerDay}
                      onChange={(e) => setNewWard({ ...newWard, wasteGenerationPerDay: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="8.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Collection Frequency *</label>
                    <select
                      required
                      value={newWard.collectionFrequency}
                      onChange={(e) => setNewWard({ ...newWard, collectionFrequency: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="daily">Daily</option>
                      <option value="alternate">Alternate Days</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Supervisor Name *</label>
                    <input
                      type="text"
                      required
                      value={newWard.supervisorName}
                      onChange={(e) => setNewWard({ ...newWard, supervisorName: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Rajesh Kumar"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Supervisor Phone *</label>
                    <input
                      type="tel"
                      required
                      value={newWard.supervisorPhone}
                      onChange={(e) => setNewWard({ ...newWard, supervisorPhone: e.target.value })}
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
                    className="flex-1 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-xl font-semibold transition-all"
                  >
                    Add Ward
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

export default Ward;
