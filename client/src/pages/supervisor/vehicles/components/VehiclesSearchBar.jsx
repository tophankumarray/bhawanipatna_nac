import { Search } from "lucide-react";

const VehiclesSearchBar = ({ value, onChange }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3 border border-gray-200">
      <Search size={18} className="text-gray-400" />
      <input
        type="text"
        placeholder="Search vehicle, driver, ward..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full outline-none text-sm"
      />
    </div>
  );
};

export default VehiclesSearchBar;
