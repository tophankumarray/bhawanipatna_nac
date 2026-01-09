// @ts-nocheck
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location, setIsOpen]);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '🏠' },
    { name: 'Complaints', path: '/admin/complaints', icon: '📋' },
    { name: 'Vehicles', path: '/admin/vehicles', icon: '🚛' },
    { name: 'Wards', path: '/admin/wards', icon: '🏘️' },
    { name: 'Supervisors', path: '/admin/supervisors', icon: '🔑' },
    { name: 'Track Vehicles', path: '/admin/track-vehicles', icon: '📍' },
    { name: 'Attendance', path: '/admin/attendance', icon: '✅' },
    { name: 'Waste Collection', path: '/admin/waste-collection', icon: '♻️' },
    { name: 'Fuel Management', path: '/admin/fuel-management', icon: '⛽' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 w-64 bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-500 shadow-2xl h-screen fixed left-0 top-0 transition-transform duration-300 z-50 overflow-y-auto`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-emerald-300/30">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              Admin
            </h1>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 hover:bg-white/10 rounded lg:hidden text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-white/80 mt-1">Admin Panel</p>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center justify-start px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-white text-emerald-600 font-semibold shadow-lg'
                        : 'text-white hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
