// Generic Navbar component for future use
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 right-0 left-0 z-40 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold text-indigo-600">SafaiMitra</h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 lg:space-x-3 hover:bg-gray-100 rounded-lg px-2 lg:px-3 py-2"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                U
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-gray-800">User</p>
              </div>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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

export default Navbar;
