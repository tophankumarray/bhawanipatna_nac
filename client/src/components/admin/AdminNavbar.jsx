// @ts-nocheck
import { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = ({ onMenuClick }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

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
                <p className="text-xs text-white/80">SuperAdmin</p>
              </div>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                <Link to="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <Link to="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </Link>
                <hr className="my-2" />
                <Link to="/" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
