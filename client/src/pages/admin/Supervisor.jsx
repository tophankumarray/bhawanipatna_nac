// @ts-nocheck
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/api';
import StatsCard from '../../components/admin/StatsCard';


const SupervisorManagement = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    status: 'active'
  });

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/supervisors');
      setSupervisors(response.data);
    } catch (error) {
      console.warn('API not available:', error.message);
      setSupervisors([]);
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({ ...formData, password });
    toast.success('Password generated!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.username || !formData.email || !formData.mobile || !formData.password) {
      toast.error('All fields are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Mobile validation
    if (formData.mobile.length !== 10) {
      toast.error('Mobile number must be 10 digits');
      return;
    }

    try {
      if (selectedSupervisor) {
        // Update existing supervisor
        const updatedSupervisor = { ...formData, id: selectedSupervisor.id, createdAt: selectedSupervisor.createdAt };
        await api.patch(`/supervisors/${selectedSupervisor.id}`, updatedSupervisor);
        
        // Update user credentials
        try {
          const usersResponse = await api.get('/users');
          const existingUser = usersResponse.data.find(u => u.username === selectedSupervisor.username);
          if (existingUser) {
            await api.patch(`/users/${existingUser.id}`, {
              username: formData.username,
              password: formData.password,
              name: formData.name,
              role: 'supervisor'
            });
          }
        } catch (err) {
          console.warn('Could not update user credentials:', err);
        }
        
        setSupervisors(supervisors.map(s => 
          s.id === selectedSupervisor.id ? updatedSupervisor : s
        ));
        toast.success('Supervisor updated successfully!');
      } else {
        // Check for duplicate username
        if (supervisors.some(s => s.username === formData.username)) {
          toast.error('Username already exists');
          return;
        }

        // Add new supervisor
        const newSupervisor = {
          ...formData,
          createdAt: new Date().toISOString()
        };
        const response = await api.post('/supervisors', newSupervisor);
        
        // Add user credentials for login
        try {
          const newUser = {
            role: 'supervisor',
            username: formData.username,
            password: formData.password,
            name: formData.name
          };
          await api.post('/users', newUser);
        } catch (err) {
          console.warn('Could not create user credentials:', err);
        }
        
        setSupervisors([...supervisors, response.data]);
        toast.success('Supervisor created successfully with login credentials!');
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error saving supervisor:', error);
      toast.error('Failed to save supervisor');
    }
  };

  const handleEdit = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setFormData({
      name: supervisor.name,
      username: supervisor.username,
      email: supervisor.email,
      mobile: supervisor.mobile,
      password: supervisor.password,
      status: supervisor.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supervisor?')) {
      try {
        const supervisorToDelete = supervisors.find(s => s.id === id);
        
        await api.delete(`/supervisors/${id}`);
        
        // Also delete user credentials
        try {
          const usersResponse = await api.get('/users');
          const userToDelete = usersResponse.data.find(u => u.username === supervisorToDelete?.username);
          if (userToDelete) {
            await api.delete(`/users/${userToDelete.id}`);
          }
        } catch (err) {
          console.warn('Could not delete user credentials:', err);
        }
        
        setSupervisors(supervisors.filter(s => s.id !== id));
        toast.success('Supervisor deleted successfully!');
      } catch (error) {
        console.error('Error deleting supervisor:', error);
        toast.error('Failed to delete supervisor');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSupervisor(null);
    setFormData({
      name: '',
      username: '',
      email: '',
      mobile: '',
      password: '',
      status: 'active'
    });
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
      : 'bg-red-100 text-red-700 border-red-200';
  };

  const statsCards = [
    {
      title: "Total Supervisors",
      value: supervisors.length,
      icon: "👥",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      title: "Active",
      value: supervisors.filter(s => s.status === 'active').length,
      icon: "✅",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      title: "Inactive",
      value: supervisors.filter(s => s.status === 'inactive').length,
      icon: "⏳",
      gradient: "from-orange-500 to-amber-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Supervisor Management
              </h1>
              <p className="text-gray-600 mt-1">Create and manage supervisor accounts</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">➕</span>
              Add Supervisor
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} showButton={false} />
          ))}
        </div>

        {/* Supervisors Table */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Supervisor List</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-500 to-teal-500">
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Username</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Mobile</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {supervisors.map((supervisor) => (
                    <tr key={supervisor.id} className="hover:bg-emerald-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {supervisor.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="ml-3 text-sm font-bold text-gray-900">{supervisor.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">{supervisor.username}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{supervisor.email}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{supervisor.mobile}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          supervisor.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {supervisor.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(supervisor)}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(supervisor.id)}
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

              {supervisors.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔑</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Supervisors Found</h3>
                  <p className="text-gray-600">Create your first supervisor account to get started</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {selectedSupervisor ? 'Edit Supervisor' : 'Add Supervisor'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Supervisor Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md"
                    placeholder="Enter supervisor name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
                    placeholder="Enter username"
                    required
                    disabled={selectedSupervisor !== null}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
                    placeholder="supervisor@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={formData.mobile}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value) && e.target.value.length <= 10) {
                        setFormData({ ...formData, mobile: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 pr-32 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-mono"
                      placeholder="Enter your password or click generate"
                      required
                    />
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-md"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

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
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 rounded-xl font-semibold transition-all"
                  >
                    {selectedSupervisor ? 'Update' : 'Add'} Supervisor
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

export default SupervisorManagement;
