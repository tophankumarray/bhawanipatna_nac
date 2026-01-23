import React from "react";
import { LOGO } from "../utils/loginHelpers";

export default function NoticePopup({ showNotice, onClose }) {
  if (!showNotice) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
          <img src={LOGO} alt="Buguda Logo" className="w-full h-full object-cover" />
        </div>

        <h2 className="text-2xl font-bold text-emerald-700 mb-3">
          Official Government Portal
        </h2>

        <p className="text-gray-600 mb-6">
          This is an official portal of BUGUDA N.A.C for Solid Waste Management.
          Please ensure you're on the correct website before entering any credentials.
        </p>

        <button
          onClick={onClose}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          I Understand
        </button>
      </div>
    </div>
  );
}
