import React from "react";

export default function SelectField({
  label,
  value,
  onChange,
  options,
  required = true,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200 font-medium"
        required={required}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
