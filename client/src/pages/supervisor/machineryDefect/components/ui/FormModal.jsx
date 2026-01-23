import React from "react";
import { X, Loader2 } from "lucide-react";

export default function FormModal({
  title,
  children,
  isOpen,
  onClose,
  onSubmit,
  loading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-gray-100">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-5 sm:p-8 flex justify-between items-center rounded-t-2xl sm:rounded-t-3xl shadow-lg">
          <h3 className="text-lg sm:text-2xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full transition-all duration-200"
            type="button"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 sm:p-8 space-y-5 sm:space-y-6">
          {children}

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 sm:pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Record"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
