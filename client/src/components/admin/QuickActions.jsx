// @ts-nocheck
import { useState } from 'react';
import { toast } from 'react-toastify';

const QuickActions = () => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [formData, setFormData] = useState({
    supervisor: '',
    ward: '',
    vehicle: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: ''
  });

  // Mock data for dropdowns
  const supervisors = [
    { id: 'SUP001', name: 'Rajesh Kumar' },
    { id: 'SUP002', name: 'Priya Sharma' },
    { id: 'SUP003', name: 'Amit Patel' },
    { id: 'SUP004', name: 'Sunita Das' },
    { id: 'SUP005', name: 'Vijay Singh' }
  ];

  const wards = [
    'Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 
    'Ward 6', 'Ward 7', 'Ward 8', 'Ward 9', 'Ward 10'
  ];

  const vehicles = [
    'OD-05-1234', 'OD-05-5678', 'OD-05-9012', 
    'OD-05-3456', 'OD-05-7890', 'OD-05-2345'
  ];

  const handleGenerateReport = () => {
    // TODO: Implement report generation
    toast.info('Report generation feature coming soon!');
  };

  const handleAssignSupervisor = () => {
    setShowAssignModal(true);
  };

  const handleViewAnalytics = () => {
    // TODO: Navigate to analytics page
    toast.info('Analytics page coming soon!');
  };

  const handleCloseModal = () => {
    setShowAssignModal(false);
    setFormData({
      supervisor: '',
      ward: '',
      vehicle: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/admin/assign-supervisor', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });

    const selectedSupervisor = supervisors.find(s => s.id === formData.supervisor);
    
    toast.success(`Supervisor ${selectedSupervisor?.name} assigned successfully to ${formData.ward}!`);
    handleCloseModal();
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-blue-500 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={handleGenerateReport}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate Report
          </button>
          
          <button 
            onClick={handleAssignSupervisor}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Assign Supervisor
          </button>
          
          <button 
            onClick={handleViewAnalytics}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Analytics
          </button>
        </div>
      </div>

      {/* Assign Supervisor Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Assign Supervisor
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
                    Select Supervisor *
                  </label>
                  <select
                    value={formData.supervisor}
                    onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Choose a supervisor...</option>
                    {supervisors.map(sup => (
                      <option key={sup.id} value={sup.id}>
                        {sup.name} ({sup.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Assign Ward *
                    </label>
                    <select
                      value={formData.ward}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select ward...</option>
                      {wards.map(ward => (
                        <option key={ward} value={ward}>{ward}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Assign Vehicle
                    </label>
                    <select
                      value={formData.vehicle}
                      onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select vehicle (optional)...</option>
                      {vehicles.map(vehicle => (
                        <option key={vehicle} value={vehicle}>{vehicle}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      min={formData.startDate}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows="3"
                    placeholder="Add any special instructions or notes..."
                  ></textarea>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Assignment Summary:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Supervisor: {formData.supervisor ? supervisors.find(s => s.id === formData.supervisor)?.name : 'Not selected'}</li>
                    <li>• Ward: {formData.ward || 'Not selected'}</li>
                    <li>• Vehicle: {formData.vehicle || 'None'}</li>
                    <li>• Duration: {formData.startDate} {formData.endDate ? `to ${formData.endDate}` : '(ongoing)'}</li>
                  </ul>
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
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 rounded-xl font-semibold transition-all"
                  >
                    Assign Supervisor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActions;
