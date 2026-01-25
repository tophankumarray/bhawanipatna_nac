// @ts-nocheck
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePasswordModal = ({
  show,
  passwordData,
  setPasswordData,
  handlePasswordChange,
  handlePasswordSubmit,
  handlePasswordCancel,
}) => {
  if (!show) return null;

  return (
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
                onClick={() =>
                  setPasswordData((prev) => ({
                    ...prev,
                    showCurrent: !prev.showCurrent,
                  }))
                }
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
                onClick={() =>
                  setPasswordData((prev) => ({
                    ...prev,
                    showNew: !prev.showNew,
                  }))
                }
              >
                {passwordData.showNew ? (
                  <FaEyeSlash className="w-5 h-5 text-gray-500" />
                ) : (
                  <FaEye className="w-5 h-5 text-gray-500" />
                )}
              </button>
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters long
              </p>
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
                onClick={() =>
                  setPasswordData((prev) => ({
                    ...prev,
                    showConfirm: !prev.showConfirm,
                  }))
                }
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
  );
};

export default ChangePasswordModal;
