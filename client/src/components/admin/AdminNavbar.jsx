// @ts-nocheck
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';

const AdminNavbar = ({ onMenuClick }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [contactData, setContactData] = useState({
    contactLevel: 'ULB',
    state: 'ODISHA',
    district: 'BUGUDA',
    cityULB: 'BUGUDA (NAC)',
    designation: '',
    name: '',
    officialMobile: '',
    officialEmail: '',
    officialLandline: '',
    whatsappNumber: '',
    personalEmail: '',
    personalPhone: '',
    address: 'NAC,BUGUDA',
    twitter: '',
    facebook: '',
    instagram: '',
    linkedIn: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to save the contact details
    console.log('Contact Details:', contactData);
    toast.success('Contact details updated successfully!');
    setShowContactModal(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirm password do not match!');
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }

    try {
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // In a real app, you would verify currentPassword with backend
      // For now, we'll just update the password in db.json via API
      
      // Update password via API (assuming user id is available)
      const userId = currentUser.id || '1'; // Default to admin user id
      
      const response = await api.patch(`/users/${userId}`, {
        password: passwordData.newPassword
      });

      if (response.status === 200) {
        toast.success('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordModal(false);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password. Please try again.');
    }
  };

  const handleContactCancel = () => {
    setShowContactModal(false);
    setShowUserMenu(false);
  };

  const handlePasswordCancel = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordModal(false);
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 shadow-lg fixed top-0 right-0 left-0 lg:left-64 z-40 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Mobile Menu Button & Breadcrumb */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="hidden sm:flex items-center space-x-2 text-white/90">
            <Link to="/admin/dashboard" className="hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <span>›</span>
            <span className="text-white font-medium">Admin Dashboard</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Add Supervisor Button */}
          <Link 
            to="/admin/supervisors" 
            className="bg-white text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden md:inline">Add Supervisor</span>
          </Link>

          {/* Notifications */}
          <button className="relative p-2 text-white hover:bg-white/10 rounded-full hidden sm:block">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-emerald-600"></span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 lg:space-x-3 hover:bg-white/10 rounded-lg px-2 lg:px-3 py-2"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-600 font-semibold">
                SA
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-white">Admin</p>
                
              </div>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                <button 
                  onClick={() => {
                    setShowContactModal(true);
                    setShowUserMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Contact Details
                </button>
                <button 
                  onClick={() => {
                    setShowPasswordModal(true);
                    setShowUserMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Change Password
                </button>
                <hr className="my-2" />
                <Link to="/" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Details Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">CONTACT DETAILS</h2>
                <button
                  onClick={handleContactCancel}
                  className="text-white hover:text-gray-200 text-2xl font-bold transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="p-6">
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Level *
                  </label>
                  <select
                    name="contactLevel"
                    value={contactData.contactLevel}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  >
                    <option value="ULB">ULB</option>
                    <option value="State">State</option>
                    <option value="District">District</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={contactData.state}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    District *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={contactData.district}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City/ULB *
                  </label>
                  <input
                    type="text"
                    name="cityULB"
                    value={contactData.cityULB}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Designation *
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={contactData.designation}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={contactData.name}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Official Mobile *
                  </label>
                  <input
                    type="tel"
                    name="officialMobile"
                    value={contactData.officialMobile}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">It will be used for OTP</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    name="officialEmail"
                    value={contactData.officialEmail}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">It will be used for OTP</p>
                </div>
              </div>

              {/* Third Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Official Landline
                  </label>
                  <input
                    type="tel"
                    name="officialLandline"
                    value={contactData.officialLandline}
                    onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={contactData.whatsappNumber}
                    onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Personal Email
                  </label>
                  <input
                    type="email"
                    name="personalEmail"
                    value={contactData.personalEmail}
                    onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Not shown on public portal.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Personal Phone
                  </label>
                  <input
                    type="tel"
                    name="personalPhone"
                    value={contactData.personalPhone}
                    onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Not shown on public portal.</p>
                </div>
              </div>

              {/* Address Row */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={contactData.address}
                  onChange={handleContactChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                ></textarea>
              </div>

              {/* Social Media Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Twitter
                  </label>
                  <input
                    type="text"
                    name="twitter"
                    value={contactData.twitter}
                    onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Facebook
                  </label>
                  <input
                    type="text"
                    name="facebook"
                    value={contactData.facebook}
                    onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={contactData.instagram}
                    onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Linked In
                  </label>
                  <input
                    type="text"
                    name="linkedIn"
                    value={contactData.linkedIn}
                    onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-start">
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleContactCancel}
                  className="px-8 py-2.5 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">CHANGE PASSWORD</h2>
                <button
                  onClick={handlePasswordCancel}
                  className="text-white hover:text-gray-200 text-2xl font-bold transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6">
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Enter current password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password *
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-start mt-6">
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={handlePasswordCancel}
                  className="px-8 py-2.5 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
