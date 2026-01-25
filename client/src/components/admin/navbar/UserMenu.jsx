// @ts-nocheck
import { Link } from "react-router-dom";

const UserMenu = ({
  showUserMenu,
  setShowUserMenu,
  setShowContactModal,
  setShowPasswordModal,
}) => {
  return (
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
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showUserMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
          <button
            onClick={() => {
              setShowContactModal(true);
              setShowUserMenu(false);
            }}
            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.27 7.27c.883.883 2.317.883 3.2 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Contact Details
          </button>

          <button
            onClick={() => {
              setShowPasswordModal(true);
              setShowUserMenu(false);
            }}
            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Change Password
          </button>

          <hr className="my-2 border-gray-200" />

          <Link
            to="/"
            className="px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
