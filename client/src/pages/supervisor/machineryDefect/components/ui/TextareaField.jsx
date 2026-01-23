import React from "react";

export default function TextareaField({ label, value, onChange, required = true }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows="4"
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200 font-medium resize-none"
        required={required}
      />
    </div>
  );
}
