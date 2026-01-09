// @ts-nocheck
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/api';
import StatsCard from '../../components/admin/StatsCard';


const WasteCollection = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    ward: 'all',
    date: '',
    search: ''
  });
  const [formData, setFormData] = useState({
    ward: '',
    vehicle: '',
    driver: '',
    route: '',
    wasteType: '',
    quantity: '',
    collectionDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    notes: ''
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await api.get('/wasteCollections');
      
      // Map db.json structure to UI expected structure
      const mappedData = response.data.map(w => ({
        id: w.id,
        ward: w.ward || w.wardName || 'N/A',
        vehicle: w.vehicle || 'N/A',
        driver: w.driver || 'N/A',
        route: w.route || 'Route ' + (w.ward?.split(' ')[1] || '1'),
        wasteType: w.wasteType || 'Mixed Waste',
        quantity: parseFloat(w.quantity || w.wasteQuantity || 0),
        targetQuantity: parseFloat(w.targetQuantity || w.wasteQuantity || 10),
        collectionDate: w.collectionDate || new Date().toISOString().split('T')[0],
        status: w.status || 'pending',
        notes: w.notes || '',
        startTime: w.startTime || '',
        endTime: w.endTime || '',
        householdsCovered: w.householdsCovered || 0,
        routeEfficiency: w.routeEfficiency || 0
      }));
      
      setCollections(mappedData);
    } catch (error) {
      console.warn('API not available, using mock data:', error.message);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: { bg: 'bg-emerald-500', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
      'in-progress': { bg: 'bg-blue-500', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
      pending: { bg: 'bg-orange-500', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' },
      cancelled: { bg: 'bg-red-500', text: 'text-red-600', badge: 'bg-red-100 text-red-700' }
    };
    return colors[status] || colors.pending;
  };

  const getWasteTypeIcon = (type) => {
    const icons = {
      'Mixed Waste': '🗑️',
      'Organic Waste': '🍃',
      'Recyclable': '♻️',
      'Hazardous': '⚠️'
    };
    return icons[type] || '🗑️';
  };

  const filteredCollections = collections.filter(collection => {
    const matchesStatus = filters.status === 'all' || collection.status === filters.status;
    const matchesWard = filters.ward === 'all' || collection.ward === filters.ward;
    const matchesDate = !filters.date || collection.collectionDate === filters.date;
    const matchesSearch = collection.vehicle.toLowerCase().includes(filters.search.toLowerCase()) ||
                         collection.driver.toLowerCase().includes(filters.search.toLowerCase()) ||
                         collection.route.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesWard && matchesDate && matchesSearch;
  });

  const getUniqueWards = () => {
    return [...new Set(collections.map(c => c.ward))].sort();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedCollection) {
        // Update existing collection
        const updatedCollection = { ...formData, id: selectedCollection.id };
        await api.patch(`/wasteCollections/${selectedCollection.id}`, updatedCollection);
        setCollections(collections.map(c => 
          c.id === selectedCollection.id ? updatedCollection : c
        ));
        toast.success('Waste collection updated successfully!');
      } else {
        // Add new collection
        const newCollection = {
          ...formData,
          quantity: 0,
          completionTime: null
        };
        const response = await api.post('/wasteCollections', newCollection);
        setCollections([...collections, response.data]);
        toast.success('Waste collection added successfully!');
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving waste collection:', error);
      toast.error('Failed to save waste collection');
    }
  };

  const handleEdit = (collection) => {
    setSelectedCollection(collection);
    setFormData({
      ward: collection.ward,
      vehicle: collection.vehicle,
      driver: collection.driver,
      route: collection.route,
      wasteType: collection.wasteType,
      quantity: collection.quantity,
      collectionDate: collection.collectionDate,
      status: collection.status,
      notes: collection.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this collection record?')) {
      try {
        await api.delete(`/wasteCollections/${id}`);
        setCollections(collections.filter(c => c.id !== id));
        toast.success('Waste collection deleted successfully!');
      } catch (error) {
        console.error('Error deleting waste collection:', error);
        toast.error('Failed to delete waste collection');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCollection(null);
    setFormData({
      ward: '',
      vehicle: '',
      driver: '',
      route: '',
      wasteType: '',
      quantity: '',
      collectionDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: ''
    });
  };

  const getTotalStats = () => {
    return {
      total: collections.length,
      completed: collections.filter(c => c.status === 'completed').length,
      inProgress: collections.filter(c => c.status === 'in-progress').length,
      pending: collections.filter(c => c.status === 'pending').length,
      totalWaste: collections.reduce((sum, c) => sum + (parseFloat(c.quantity) || 0), 0).toFixed(1),
      targetWaste: collections.reduce((sum, c) => sum + (parseFloat(c.targetQuantity) || 0), 0).toFixed(1)
    };
  };

  const stats = getTotalStats();

  const statsCards = [
    { title: "Total Collections", value: stats.total, icon: "📊", gradient: "from-blue-500 to-indigo-500" },
    { title: "Completed", value: stats.completed, icon: "✅", gradient: "from-emerald-500 to-teal-500" },
    { title: "In Progress", value: stats.inProgress, icon: "🔄", gradient: "from-blue-400 to-indigo-400" },
    { title: "Pending", value: stats.pending, icon: "⏰", gradient: "from-orange-500 to-amber-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Waste Collection Management
              </h1>
              <p className="text-gray-600 mt-1">Track and manage daily waste collection activities</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">➕</span>
              Add Collection
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} showButton={false} />
          ))}
        </div>

        {/* Waste Collection Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Collection Progress</h2>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Total Waste Collected</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-emerald-600">{stats.totalWaste}</span>
                <span className="text-gray-400">/</span>
                <span className="text-lg font-semibold text-gray-600">{stats.targetWaste} tons</span>
              </div>
            </div>
            <div className="relative w-full bg-gray-200 rounded-xl h-4 overflow-hidden">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl transition-all duration-1000"
                style={{ width: `${Math.min((stats.totalWaste / stats.targetWaste) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center justify-between bg-emerald-50 rounded-xl p-4">
            <span className="text-sm font-semibold text-emerald-800">Target Achievement</span>
            <span className="text-xl font-bold text-emerald-700">
              {((stats.totalWaste / stats.targetWaste) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Filter Collections</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Search</label>
              <input
                type="text"
                placeholder="🔎 Vehicle, Driver, Route..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">✓ Completed</option>
                <option value="in-progress">⏳ In Progress</option>
                <option value="pending">⏰ Pending</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ward</label>
              <select
                value={filters.ward}
                onChange={(e) => setFilters({ ...filters, ward: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Wards</option>
                {getUniqueWards().map(ward => (
                  <option key={ward} value={ward}>{ward}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Collections Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Waste Collection Records</h2>
          
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500"></div>
              <p className="text-gray-600 font-semibold">Loading collections...</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-500 to-teal-500">
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Ward</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Vehicle</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Route</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Waste Type</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Collected</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredCollections.map((collection, index) => (
                    <tr key={collection.id} className={`hover:bg-emerald-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">{collection.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">{collection.ward}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-bold text-gray-900">{collection.vehicle}</div>
                          <div className="text-xs text-gray-600 mt-1">{collection.driver}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-700 bg-blue-50 px-3 py-1 rounded-lg">{collection.route}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getWasteTypeIcon(collection.wasteType)}</span>
                          <span className="text-sm font-bold text-gray-900">{collection.wasteType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-black text-emerald-600">{collection.quantity} tons</div>
                          <div className="text-xs text-gray-500 font-semibold">Target: {collection.targetQuantity} tons</div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-4 py-2 rounded-xl text-xs font-black ${getStatusColor(collection.status).badge} shadow-sm`}>
                          {collection.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(collection)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(collection.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCollections.length === 0 && (
                <div className="text-center py-20">
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-6xl">🗑️</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">No Collections Found</h3>
                  <p className="text-gray-600 font-medium text-lg mb-6">Try adjusting your filters or add a new collection</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105"
                  >
                    + Add First Collection
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-white to-emerald-50 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-emerald-100 transform transition-all animate-slideUp">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">{selectedCollection ? '✏️' : '➕'}</span>
                  </div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {selectedCollection ? 'Edit Collection' : 'Add New Collection'}
                  </h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-10 h-10 bg-gray-200 hover:bg-red-500 hover:text-white text-gray-700 rounded-xl text-2xl font-black transition-all transform hover:scale-110 flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">Ward *</label>
                    <select
                      value={formData.ward}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium bg-white"
                      required
                    >
                      <option value="">Select Ward</option>
                      <option value="Ward 1">Ward 1</option>
                      <option value="Ward 2">Ward 2</option>
                      <option value="Ward 3">Ward 3</option>
                      <option value="Ward 4">Ward 4</option>
                      <option value="Ward 5">Ward 5</option>
                      <option value="Ward 6">Ward 6</option>
                      <option value="Ward 7">Ward 7</option>
                      <option value="Ward 8">Ward 8</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">Vehicle *</label>
                    <input
                      type="text"
                      value={formData.vehicle}
                      onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
                      placeholder="OD-05-1234"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">Driver Name *</label>
                    <input
                      type="text"
                      value={formData.driver}
                      onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
                      placeholder="Driver Name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">Route *</label>
                    <input
                      type="text"
                      value={formData.route}
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
                      placeholder="Route A-1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">Waste Type *</label>
                    <select
                      value={formData.wasteType}
                      onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium bg-white"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Mixed Waste">Mixed Waste</option>
                      <option value="Organic Waste">Organic Waste</option>
                      <option value="Recyclable">Recyclable</option>
                      <option value="Hazardous">Hazardous</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">Target Quantity (tons) *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
                      placeholder="0.0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">Collection Date *</label>
                    <input
                      type="date"
                      value={formData.collectionDate}
                      onChange={(e) => setFormData({ ...formData, collectionDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium bg-white"
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
                    rows="4"
                    placeholder="Additional notes or comments..."
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-4 rounded-xl font-black text-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 rounded-xl font-black text-lg transition-all shadow-lg hover:shadow-2xl transform hover:scale-105"
                  >
                    {selectedCollection ? '✓ Update' : '+ Add'} Collection
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

export default WasteCollection;
