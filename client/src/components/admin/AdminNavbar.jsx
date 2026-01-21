// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../api/mockAPI';

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
    confirmPassword: '',
    showCurrent: false,   
    showNew: false,        
    showConfirm: false 
  });

  // Notification states for BOTH complaints arrays
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [allComplaints, setAllComplaints] = useState([]);

  // Fetch BOTH complaints and machineryComplaints from db.json
  const fetchNotifications = useCallback(async () => {
    try {
      // Get regular complaints
      const complaintsResponse = await api.get('/complaints');
      const complaints = complaintsResponse.data || [];
      
      // Get machinery complaints
      const machineryResponse = await api.get('/machineryComplaints');
      const machineryComplaints = machineryResponse.data || [];

      // Combine all for total count
      setAllComplaints([...complaints, ...machineryComplaints]);

      // Filter unread notifications from BOTH arrays
      const unreadNotifications = [
        // Regular citizen complaints
        ...complaints
          .filter(complaint => 
            (!complaint.isRead || complaint.isRead === false) && 
            complaint.status !== 'resolved' && 
            complaint.status !== 'closed'
          )
          .map(complaint => ({
            id: complaint.id,
            type: 'citizen',
            subject: complaint.subject || complaint.complaintType || complaint.issue || `Complaint #${complaint.id}`,
            name: complaint.citizenName || complaint.name || complaint.applicantName || 'Citizen',
            cityULB: complaint.cityULB || complaint.ulb || complaint.location,
            district: complaint.district,
            priority: complaint.priority || complaint.severity || 'low',
            status: complaint.status || 'pending',
            createdAt: complaint.createdAt || complaint.date || new Date().toISOString(),
            isRead: complaint.isRead || false
          })),
        
        // Machinery complaints
        ...machineryComplaints
          .filter(machinery => 
            (!machinery.isRead || machinery.isRead === false) && 
            machinery.status !== 'Done' && 
            machinery.status !== 'Resolved' && 
            machinery.status !== 'Completed'
          )
          .map(machinery => ({
            id: machinery.id,
            type: 'machinery',
            subject: machinery.machineName ? `${machinery.machineName}: ${machinery.description}` : `Machinery #${machinery.id}`,
            name: machinery.supervisorName || 'Supervisor',
            phoneNo: machinery.phoneNo,
            cityULB: machinery.cityULB || machinery.location || 'N/A',
            priority: machinery.priority || 'medium',
            status: machinery.status || 'pending',
            createdAt: machinery.dateSubmitted || machinery.createdAt || new Date().toISOString(),
            isRead: machinery.isRead || false
          }))
      ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10); // Latest 10

      setNotifications(unreadNotifications);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);

  // Poll every 10 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Show toast for new notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      toast.info(
        `🔔 New ${latest.type === 'machinery' ? 'Machinery Issue' : 'Complaint'}: ${latest.subject.substring(0, 30)}...`, 
        { 
          position: "top-right", 
          autoClose: 5000,
          toastId: `notification-${latest.id}-${latest.type}`
        }
      );
    }
  }, [notifications.length]);

  // Smart mark as read for both endpoints
  const markAsRead = async (notificationId) => {
    try {
      // Try machinery first, then complaints
      try {
        await api.patch(`/machineryComplaints/${notificationId}`, { 
          isRead: true,
          readAt: new Date().toISOString()
        });
      } catch (machineryError) {
        // If machinery fails, try regular complaints
        await api.patch(`/complaints/${notificationId}`, { 
          isRead: true,
          readAt: new Date().toISOString()
        });
      }
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id == notificationId ? { ...notif, isRead: true } : notif
        ).filter(notif => notif.id != notificationId)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Mark all as read (both endpoints)
  const clearAllNotifications = async () => {
    try {
      const citizenIds = notifications.filter(n => n.type === 'citizen').map(n => n.id);
      const machineryIds = notifications.filter(n => n.type === 'machinery').map(n => n.id);

      // Update citizen complaints
      await Promise.all(
        citizenIds.map(id => 
          api.patch(`/complaints/${id}`, { 
            isRead: true, 
            readAt: new Date().toISOString()
          }).catch(() => {}) // Ignore errors for non-existent IDs
        )
      );

      // Update machinery complaints
      await Promise.all(
        machineryIds.map(id => 
          api.patch(`/machineryComplaints/${id}`, { 
            isRead: true, 
            readAt: new Date().toISOString()
          }).catch(() => {}) // Ignore errors for non-existent IDs
        )
      );

      setNotifications([]);
      setUnreadCount(0);
      toast.success('All notifications marked as read!');
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast.error('Failed to clear notifications');
    }
  };

  // Event handlers (unchanged)
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
    console.log('Contact Details:', contactData);
    toast.success('Contact details updated successfully!');
    setShowContactModal(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirm password do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = currentUser.id || '1';
      const response = await api.patch(`/users/${userId}`, {
        password: passwordData.newPassword
      });
      if (response.status === 200) {
        toast.success('Password changed successfully!');
        setPasswordData({ 
          currentPassword: '', 
          newPassword: '', 
          confirmPassword: '',
          showCurrent: false,
          showNew: false,
          showConfirm: false 
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
      confirmPassword: '',
      showCurrent: false,
      showNew: false,
      showConfirm: false 
    });
    setShowPasswordModal(false);
    setShowUserMenu(false);
  };

  // Rest of JSX remains IDENTICAL until notifications section...
  return (
    <nav className="bg-linear-to-r from-emerald-500 via-emerald-600 to-teal-600 shadow-lg fixed top-0 right-0 left-0 lg:left-64 z-40 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Mobile Menu & Breadcrumb - UNCHANGED */}
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
          {/* Add Supervisor - UNCHANGED */}
          <Link 
            to="/admin/supervisors" 
            className="bg-white text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden md:inline">Add Supervisor</span>
          </Link>

            <a href="https://admin.sbmurban.org/u/login" target="_blank" rel="noopener noreferrer" className="bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 whitespace-nowrap">
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
    <span className="hidden md:inline">Swachhtam Portal</span>
  </a>

          {/* UPDATED Notifications Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-white hover:bg-white/10 rounded-full transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* UPDATED Notifications Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                <div className="p-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-800">New Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium px-3 py-1 rounded-lg hover:bg-emerald-50 transition-all"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {unreadCount} unread • Citizen & Machinery • Updates every 10s • Total: {allComplaints.length}
                  </p>
                </div>

                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p className="text-sm font-medium text-gray-600">No new notifications</p>
                    <p className="text-xs">All complaints are up to date</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <Link
                      key={`${notification.type}-${notification.id}`}
                      to={notification.type === 'machinery' ? `/admin/machinery/${notification.id}` : `/admin/complaints/${notification.id}`}
                      className="p-4 border-b border-gray-100 hover:bg-emerald-50 transition-all group border-l-4 border-l-emerald-400 bg-emerald-50/50"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-2 shrink-0 flex items-center justify-center shadow-sm ${
                          notification.priority === 'high' ? 'bg-red-500' :
                          notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-emerald-500'
                        }`}>
                          {notification.type === 'machinery' ? (
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                            </svg>
                          ) : notification.priority === 'high' ? (
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          ) : null}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-emerald-700">
                              {notification.subject}
                            </p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              notification.type === 'machinery' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              {notification.type === 'machinery' ? 'MACHINERY' : 'CITIZEN'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">
                            {notification.name} {notification.phoneNo && `• ${notification.phoneNo}`} • {notification.cityULB || notification.district || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.createdAt).toLocaleString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
                
              </div>
            )}
          </div>

          {/* User Profile - UNCHANGED */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 lg:space-x-3 hover:bg-white/10 rounded-lg px-2 lg:px-3 py-2 transition-all"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-600 font-semibold shadow-md">
                SA
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-white">Admin</p>
              </div>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
                <button 
                  onClick={() => {
                    setShowContactModal(true);
                    setShowUserMenu(false);
                  }}
                  className=" w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.27 7.27c.883.883 2.317.883 3.2 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Details
                </button>
                <button 
                  onClick={() => {
                    setShowPasswordModal(true);
                    setShowUserMenu(false);
                  }}
                  className=" w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Change Password
                </button>
                <hr className="my-2 border-gray-200" />
                <Link to="/" className=" px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

       {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-linear-to-r from-emerald-500 to-teal-500 p-6 rounded-t-2xl">
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Level *</label>
                  <select name="contactLevel" value={contactData.contactLevel} onChange={handleContactChange} required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
                    <option value="ULB">ULB</option>
                    <option value="State">State</option>
                    <option value="District">District</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                  <input type="text" name="state" value={contactData.state} onChange={handleContactChange} required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">District *</label>
                  <input type="text" name="district" value={contactData.district} onChange={handleContactChange} required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City/ULB *</label>
                  <input type="text" name="cityULB" value={contactData.cityULB} onChange={handleContactChange} required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                </div>
              </div>


              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Designation *</label>
                  <input type="text" name="designation" value={contactData.designation} onChange={handleContactChange} required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                  <input type="text" name="name" value={contactData.name} onChange={handleContactChange} required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Official Mobile *</label>
                  <input type="tel" name="officialMobile" value={contactData.officialMobile} onChange={handleContactChange} required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                  <p className="text-xs text-gray-500 mt-1">It will be used for OTP</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Official Email *</label>
                  <input type="email" name="officialEmail" value={contactData.officialEmail} onChange={handleContactChange} required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                  <p className="text-xs text-gray-500 mt-1">It will be used for OTP</p>
                </div>
              </div>


              {/* Third Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Official Landline</label>
                  <input type="tel" name="officialLandline" value={contactData.officialLandline} onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Number</label>
                  <input type="tel" name="whatsappNumber" value={contactData.whatsappNumber} onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Personal Email</label>
                  <input type="email" name="personalEmail" value={contactData.personalEmail} onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                  <p className="text-xs text-gray-500 mt-1">Not shown on public portal.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Personal Phone</label>
                  <input type="tel" name="personalPhone" value={contactData.personalPhone} onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                  <p className="text-xs text-gray-500 mt-1">Not shown on public portal.</p>
                </div>
              </div>


              {/* Address */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <textarea name="address" value={contactData.address} onChange={handleContactChange} rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"></textarea>
              </div>


              {/* Social Media */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter</label>
                  <input type="text" name="twitter" value={contactData.twitter} onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook</label>
                  <input type="text" name="facebook" value={contactData.facebook} onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram</label>
                  <input type="text" name="instagram" value={contactData.instagram} onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn</label>
                  <input type="text" name="linkedIn" value={contactData.linkedIn} onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                </div>
              </div>


              {/* Buttons */}
              <div className="flex gap-3 justify-start">
                <button type="submit"
                  className="px-8 py-2.5 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Update
                </button>
                <button type="button" onClick={handleContactCancel}
                  className="px-8 py-2.5 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition-all shadow-lg">
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
      <div className="bg-linear-to-r from-emerald-500 to-teal-500 p-6 rounded-t-2xl">
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
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Password *
            </label>
            <input
              type={passwordData.showCurrent ? "text" : "password"}
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
              placeholder="Enter current password"
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 transition-all"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-emerald-600 transition-colors"
              onClick={() => setPasswordData(prev => ({ ...prev, showCurrent: !prev.showCurrent }))}
            >
              {passwordData.showCurrent ? (
                <FaEyeSlash className="w-5 h-5 text-gray-500" />
              ) : (
                <FaEye className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>


          {/* New Password */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password *
            </label>
            <input
              type={passwordData.showNew ? "text" : "password"}
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              placeholder="Enter new password (min 6 chars)"
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 transition-all"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-emerald-600 transition-colors"
              onClick={() => setPasswordData(prev => ({ ...prev, showNew: !prev.showNew }))}
            >
              {passwordData.showNew ? (
                <FaEyeSlash className="w-5 h-5 text-gray-500" />
              ) : (
                <FaEye className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
          </div>


          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm New Password *
            </label>
            <input
              type={passwordData.showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              placeholder="Confirm your new password"
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 transition-all"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-emerald-600 transition-colors"
              onClick={() => setPasswordData(prev => ({ ...prev, showConfirm: !prev.showConfirm }))}
            >
              {passwordData.showConfirm ? (
                <FaEyeSlash className="w-5 h-5 text-gray-500" />
              ) : (
                <FaEye className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex gap-3 justify-center mt-8">
          <button
            type="submit"
            className="px-8 py-3 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex-1 text-sm"
          >
            Update Password
          </button>
          <button
            type="button"
            onClick={handlePasswordCancel}
            className="px-8 py-3 bg-gray-400 text-white rounded-xl font-semibold hover:bg-gray-500 transition-all shadow-lg flex-1 text-sm"
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
