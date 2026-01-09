// @ts-nocheck
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/api';
import StatsCard from '../../components/admin/StatsCard';

const Complaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateFrom: '',
    dateTo: ''
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageModal, setImageModal] = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');

  // Fetch complaints from API
  useEffect(() => {
    fetchComplaints();
    fetchSupervisors();
  }, [filters]);

  const fetchSupervisors = async () => {
    try {
      const [supervisorsRes, wardsRes] = await Promise.all([
        api.get('/supervisors'),
        api.get('/wards')
      ]);
      
      const supervisorsList = supervisorsRes.data || [];
      const wardsList = wardsRes.data || [];
      
      // Combine supervisors from supervisors table and wards
      const allSupervisors = [...supervisorsList];
      
      // Add supervisors from wards that don't exist in supervisors table
      wardsList.forEach(ward => {
        if (ward.supervisor || ward.supervisorName) {
          const supervisorName = ward.supervisor || ward.supervisorName;
          const supervisorPhone = ward.supervisorPhone || '';
          
          // Check if this supervisor already exists
          const exists = allSupervisors.some(s => 
            s.name === supervisorName || s.mobile === supervisorPhone
          );
          
          if (!exists && supervisorName && supervisorName.trim() !== '') {
            allSupervisors.push({
              id: ward.id + '_sup',
              name: supervisorName,
              mobile: supervisorPhone,
              source: 'ward'
            });
          }
        }
      });
      
      setSupervisors(allSupervisors);
    } catch (error) {
      console.warn('Error fetching supervisors:', error.message);
      setSupervisors([]);
    }
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await api.get('/complaints');
      const data = response.data;
      
      // Apply filters
      let filteredData = data;
      if (filters.status !== 'all') {
        filteredData = filteredData.filter(c => c.status === filters.status);
      }
      if (filters.search) {
        filteredData = filteredData.filter(c => 
          c.citizenName?.toLowerCase().includes(filters.search.toLowerCase()) ||
          c.location?.toLowerCase().includes(filters.search.toLowerCase()) ||
          c.description?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      setComplaints(filteredData);
    } catch (error) {
      console.warn('API not available:', error.message);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await api.patch(`/complaints/${complaintId}`, { status: newStatus });
      
      setComplaints(complaints.map(c => 
        c.id === complaintId ? { ...c, status: newStatus } : c
      ));
      toast.success('Complaint status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update complaint status');
    }
  };

  const handleAssignSupervisor = async () => {
    if (!selectedSupervisor) {
      toast.error('Please select a supervisor');
      return;
    }

    try {
      const supervisor = supervisors.find(s => s.id === selectedSupervisor);
      const assignedToText = `${supervisor.name} (Supervisor)`;
      
      await api.patch(`/complaints/${selectedComplaint.id}`, {
        assignedTo: assignedToText,
        status: 'in-progress'
      });

      setComplaints(complaints.map(c =>
        c.id === selectedComplaint.id
          ? { ...c, assignedTo: assignedToText, status: 'in-progress' }
          : c
      ));

      setSelectedComplaint({
        ...selectedComplaint,
        assignedTo: assignedToText,
        status: 'in-progress'
      });

      toast.success('Supervisor assigned successfully');
      setSelectedSupervisor('');
    } catch (error) {
      console.error('Error assigning supervisor:', error);
      toast.error('Failed to assign supervisor');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      closed: 'bg-green-100 text-green-800',
      rejected: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600',
      medium: 'text-orange-600',
      low: 'text-green-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = filters.status === 'all' || complaint.status === filters.status;
    const matchesSearch = complaint.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
                          complaint.id?.toLowerCase().includes(filters.search.toLowerCase()) ||
                          complaint.location?.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === 'open').length,
    pending: complaints.filter(c => c.status === 'pending').length,
    closed: complaints.filter(c => c.status === 'closed').length
  };

  const statsCards = [
    {
      title: "Total Complaints",
      value: stats.total,
      icon: "📋",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "Open",
      value: stats.open,
      icon: "⚠️",
      gradient: "from-rose-500 to-pink-600"
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: "⏰",
      gradient: "from-amber-500 to-orange-600"
    },
    {
      title: "Closed",
      value: stats.closed,
      icon: "✅",
      gradient: "from-emerald-500 to-teal-600"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading complaints...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-300/40 to-emerald-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-300/40 to-cyan-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-2">Complaint Management 📋</h1>
          <p className="text-gray-600 text-lg">Monitor and resolve citizen complaints efficiently</p>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {statsCards.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            gradient={stat.gradient}
            showButton={false}
          />
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by ID, title, or location..."
                className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-end space-x-2">
            <button
              onClick={() => setFilters({ status: 'all', search: '', dateFrom: '', dateTo: '' })}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all shadow-sm hover:shadow-md"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">ID</th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Title</th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider hidden lg:table-cell">Location</th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Image</th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider hidden xl:table-cell">Date</th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    No complaints found
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-0">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {complaint.id}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div className="max-w-xs">
                        <p className="font-medium truncate">{complaint.title}</p>
                        <p className="text-gray-500 text-xs truncate md:hidden">{complaint.location}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {complaint.category}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {complaint.location}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {complaint.photo ? (
                        <img 
                          src={complaint.photo} 
                          alt="Complaint" 
                          className="h-12 w-12 rounded-lg object-cover border-2 border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => setImageModal(complaint.photo)}
                          title="Click to view full image"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <select
                        value={complaint.status}
                        onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1 rounded-full border-0 ${getStatusColor(complaint.status)}`}
                      >
                        <option value="open">Open</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="closed">Closed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setShowModal(true);
                        }}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-sm hover:shadow-md"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="p-6 sm:p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{selectedComplaint.title}</h2>
                  <p className="text-sm text-gray-500 mt-2 font-medium">ID: {selectedComplaint.id}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <p className="text-gray-900 leading-relaxed">{selectedComplaint.description}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <p className="text-gray-900 font-medium">{selectedComplaint.category}</p>
                </div>

                {selectedComplaint.photo && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Complaint Image</label>
                    <img 
                      src={selectedComplaint.photo} 
                      alt="Complaint" 
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setImageModal(selectedComplaint.photo)}
                      title="Click to view full image"
                    />
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <p className="text-gray-900 font-medium">{selectedComplaint.location}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Citizen Name</label>
                    <p className="text-gray-900">{selectedComplaint.citizenName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{selectedComplaint.citizenPhone}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <p className="text-gray-900">{selectedComplaint.assignedTo || 'Not assigned yet'}</p>
                </div>

                {/* Assign Supervisor Section */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Assign Supervisor</label>
                  <select
                    value={selectedSupervisor}
                    onChange={(e) => setSelectedSupervisor(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                  >
                    <option value="">Select Supervisor</option>
                    {supervisors.map((supervisor) => (
                      <option key={supervisor.id} value={supervisor.id}>
                        {supervisor.name} - {supervisor.mobile}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                    <p className="text-gray-900">{new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                    <p className="text-gray-900">{new Date(selectedComplaint.updatedAt).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(selectedComplaint.status)}`}>
                    {selectedComplaint.status?.toUpperCase() || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all shadow-sm hover:shadow-md"
                >
                  Close
                </button>
                <button
                  onClick={handleAssignSupervisor}
                  disabled={!selectedSupervisor}
                  className={`px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg ${
                    !selectedSupervisor ? 'opacity-50 cursor-not-allowed' : 'hover:from-emerald-600 hover:to-teal-700'
                  }`}
                >
                  Assign Supervisor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {imageModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setImageModal(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setImageModal(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-4xl font-bold"
            >
              ×
            </button>
            <img 
              src={imageModal} 
              alt="Complaint Full Size" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Complaint;