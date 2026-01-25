// @ts-nocheck
import { Link } from "react-router-dom";
import NotificationsDropdown from "./NotificationsDropdown";
import UserMenu from "./UserMenu";

const AdminNavbarContent = ({
  onMenuClick,

  // Notifications
  showNotifications,
  setShowNotifications,
  unreadCount,
  notifications,
  allComplaints,
  markAsRead,
  clearAllNotifications,

  // User menu
  showUserMenu,
  setShowUserMenu,
  setShowContactModal,
  setShowPasswordModal,
}) => {
  return (
    <div className="flex items-center justify-between h-full px-4 lg:px-6">
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-white/90">
          <Link to="/admin/dashboard" className="hover:text-white">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </Link>
          <span>›</span>
          <span className="text-white font-medium">Admin Dashboard</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 lg:space-x-4">
        {/* Add Supervisor */}
        <Link
          to="/admin/supervisors"
          className="bg-white text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="hidden md:inline">Add Supervisor</span>
        </Link>

        {/* Swachhtam Portal */}
        <a
          href="https://admin.sbmurban.org/u/login"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          <span className="hidden md:inline">Swachhtam Portal</span>
        </a>

        {/* Notifications */}
        <NotificationsDropdown
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          unreadCount={unreadCount}
          notifications={notifications}
          allComplaints={allComplaints}
          markAsRead={markAsRead}
          clearAllNotifications={clearAllNotifications}
        />

        {/* User Menu */}
        <UserMenu
          showUserMenu={showUserMenu}
          setShowUserMenu={setShowUserMenu}
          setShowContactModal={setShowContactModal}
          setShowPasswordModal={setShowPasswordModal}
        />
      </div>
    </div>
  );
};

export default AdminNavbarContent;
