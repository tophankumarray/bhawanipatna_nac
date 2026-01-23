const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  required = true,
  readOnly = false,
  error,
  ...props
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && !readOnly && <span className="text-red-500">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
          readOnly
            ? "bg-gray-100 border-gray-300 cursor-not-allowed"
            : error
            ? "bg-white border-red-500 focus:ring-2 focus:ring-red-500"
            : "bg-white border-gray-300 focus:ring-2 focus:ring-amber-500 hover:border-gray-400"
        }`}
        required={required && !readOnly}
        {...props}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
