// @ts-nocheck
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/api';
import StatsCard from '../../components/admin/StatsCard';


const FuelManagement = () => {
  const [fuelRecords, setFuelRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filters, setFilters] = useState({
    vehicle: 'all',
    type: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  const [formData, setFormData] = useState({
    vehicle: '',
    driver: '',
    fuelType: 'diesel',
    quantity: '',
    pricePerLiter: '',
    totalCost: '',
    odometer: '',
    fillingStation: '',
    refuelDate: new Date().toISOString().split('T')[0],
    receiptNumber: '',
    notes: ''
  });

  useEffect(() => {
    fetchFuelRecords();
  }, []);

  const fetchFuelRecords = async () => {
    try {
      setLoading(true);
      const response = await api.get('/fuelRecords');
      setFuelRecords(response.data);
    } catch (error) {
      console.warn('API not available:', error.message);
      setFuelRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const getFuelTypeColor = (type) => {
    const colors = {
      diesel: { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'bg-blue-500' },
      petrol: { bg: 'bg-orange-100', text: 'text-orange-700', badge: 'bg-orange-500' },
      cng: { bg: 'bg-green-100', text: 'text-green-700', badge: 'bg-green-500' }
    };
    return colors[type] || colors.diesel;
  };

  const filteredRecords = fuelRecords.filter(record => {
    const matchesVehicle = filters.vehicle === 'all' || record.vehicle === filters.vehicle;
    const matchesType = filters.type === 'all' || record.fuelType === filters.type;
    const matchesDateFrom = !filters.dateFrom || record.refuelDate >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || record.refuelDate <= filters.dateTo;
    const matchesSearch = record.vehicle.toLowerCase().includes(filters.search.toLowerCase()) ||
                         record.driver.toLowerCase().includes(filters.search.toLowerCase()) ||
                         record.fillingStation.toLowerCase().includes(filters.search.toLowerCase());
    return matchesVehicle && matchesType && matchesDateFrom && matchesDateTo && matchesSearch;
  });

  const getUniqueVehicles = () => {
    return [...new Set(fuelRecords.map(r => r.vehicle))].sort();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const totalCost = parseFloat(formData.quantity) * parseFloat(formData.pricePerLiter);
    
    try {
      if (selectedRecord) {
        // Update existing record
        const updatedRecord = {
          ...formData,
          totalCost: totalCost.toFixed(2),
          id: selectedRecord.id,
          efficiency: 0,
          previousOdometer: selectedRecord.previousOdometer
        };
        await api.patch(`/fuelRecords/${selectedRecord.id}`, updatedRecord);
        setFuelRecords(fuelRecords.map(r => 
          r.id === selectedRecord.id ? updatedRecord : r
        ));
        toast.success('Fuel record updated successfully!');
      } else {
        // Add new record
        const newRecord = {
          ...formData,
          totalCost: totalCost.toFixed(2),
          previousOdometer: 0,
          efficiency: 0
        };
        const response = await api.post('/fuelRecords', newRecord);
        setFuelRecords([...fuelRecords, response.data]);
        toast.success('Fuel record added successfully!');
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving fuel record:', error);
      toast.error('Failed to save fuel record');
    }
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setFormData({
      vehicle: record.vehicle,
      driver: record.driver,
      fuelType: record.fuelType,
      quantity: record.quantity,
      pricePerLiter: record.pricePerLiter,
      totalCost: record.totalCost,
      odometer: record.odometer,
      fillingStation: record.fillingStation,
      refuelDate: record.refuelDate,
      receiptNumber: record.receiptNumber,
      notes: record.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fuel record?')) {
      try {
        await api.delete(`/fuelRecords/${id}`);
        setFuelRecords(fuelRecords.filter(r => r.id !== id));
        toast.success('Fuel record deleted successfully!');
      } catch (error) {
        console.error('Error deleting fuel record:', error);
        toast.error('Failed to delete fuel record');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
    setFormData({
      vehicle: '',
      driver: '',
      fuelType: 'diesel',
      quantity: '',
      pricePerLiter: '',
      totalCost: '',
      odometer: '',
      fillingStation: '',
      refuelDate: new Date().toISOString().split('T')[0],
      receiptNumber: '',
      notes: ''
    });
  };

  const getTotalStats = () => {
    return {
      totalRecords: fuelRecords.length,
      totalFuel: fuelRecords.reduce((sum, r) => sum + parseFloat(r.quantity), 0).toFixed(1),
      totalCost: fuelRecords.reduce((sum, r) => sum + parseFloat(r.totalCost), 0).toFixed(2),
      avgEfficiency: (fuelRecords.reduce((sum, r) => sum + (r.efficiency || 0), 0) / fuelRecords.length).toFixed(2),
      dieselRecords: fuelRecords.filter(r => r.fuelType === 'diesel').length,
      petrolRecords: fuelRecords.filter(r => r.fuelType === 'petrol').length
    };
  };

  const stats = getTotalStats();

  const statsCards = [
    { title: "Total Records", value: stats.totalRecords, icon: "📊", gradient: "from-blue-500 to-indigo-500" },
    { title: "Total Fuel", value: `${stats.totalFuel}L`, icon: "⛽", gradient: "from-emerald-500 to-teal-500" },
    { title: "Total Cost", value: `₹${stats.totalCost}`, icon: "💰", gradient: "from-emerald-500 to-teal-500" },
    { title: "Avg Efficiency", value: `${stats.avgEfficiency} km/L`, icon: "📈", gradient: "from-purple-500 to-pink-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Fuel Management
              </h1>
              <p className="text-gray-600 mt-1">Track and manage vehicle fuel consumption</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">➕</span>
              Add Fuel Record
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} showButton={false} />
          ))}
        </div>

        {/* Fuel Type Distribution */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Fuel Type Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Diesel</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{stats.dieselRecords}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">⛽</span>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Petrol</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">{stats.petrolRecords}</p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">⛽</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Vehicle, Driver, Station..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle</label>
              <select
                value={filters.vehicle}
                onChange={(e) => setFilters({ ...filters, vehicle: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Vehicles</option>
                {getUniqueVehicles().map(vehicle => (
                  <option key={vehicle} value={vehicle}>{vehicle}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fuel Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="diesel">Diesel</option>
                <option value="petrol">Petrol</option>
                <option value="cng">CNG</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Fuel Records Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Fuel Records</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-500 to-teal-500">
                    <th className="px-4 py-3 text-left text-sm font-bold text-white">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Vehicle</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Fuel Type</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Cost</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Odometer</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Efficiency</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Station</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-emerald-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">{record.id}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-bold text-gray-900">{record.vehicle}</div>
                          <div className="text-xs text-gray-600">{record.driver}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{record.refuelDate}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getFuelTypeColor(record.fuelType).bg} ${getFuelTypeColor(record.fuelType).text}`}>
                          {record.fuelType.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-blue-600">{record.quantity} L</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-bold text-emerald-600">₹{record.totalCost}</div>
                          <div className="text-xs text-gray-600">@ ₹{record.pricePerLiter}/L</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{record.odometer} km</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-purple-600">{record.efficiency || 'N/A'} km/L</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-900">{record.fillingStation}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(record)}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="text-red-600 hover:text-red-800 font-semibold text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredRecords.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⛽</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Fuel Records Found</h3>
                  <p className="text-gray-600">Try adjusting your filters or add a new fuel record</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {selectedRecord ? 'Edit Fuel Record' : 'Add New Fuel Record'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Number *</label>
                    <input
                      type="text"
                      value={formData.vehicle}
                      onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="OD-05-1234"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Driver Name *</label>
                    <input
                      type="text"
                      value={formData.driver}
                      onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Driver Name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fuel Type *</label>
                    <select
                      value={formData.fuelType}
                      onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="diesel">Diesel</option>
                      <option value="petrol">Petrol</option>
                      <option value="cng">CNG</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity (Liters) *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0.0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price per Liter (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.pricePerLiter}
                      onChange={(e) => setFormData({ ...formData, pricePerLiter: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Odometer Reading (km) *</label>
                    <input
                      type="number"
                      value={formData.odometer}
                      onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Refuel Date *</label>
                    <input
                      type="date"
                      value={formData.refuelDate}
                      onChange={(e) => setFormData({ ...formData, refuelDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Receipt Number</label>
                    <input
                      type="text"
                      value={formData.receiptNumber}
                      onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="REC-2025-001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Filling Station *</label>
                  <input
                    type="text"
                    value={formData.fillingStation}
                    onChange={(e) => setFormData({ ...formData, fillingStation: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Indian Oil - Bhubaneswar"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows="3"
                    placeholder="Additional notes or comments..."
                  ></textarea>
                </div>

                {formData.quantity && formData.pricePerLiter && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-sm text-gray-700">
                      <strong>Total Cost:</strong> ₹{(parseFloat(formData.quantity || 0) * parseFloat(formData.pricePerLiter || 0)).toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-xl font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 rounded-xl font-semibold transition-all"
                  >
                    {selectedRecord ? 'Update' : 'Add'} Record
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

export default FuelManagement;
