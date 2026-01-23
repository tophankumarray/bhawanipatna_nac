import { FILTERS } from "../complaintsConfig";

const ComplaintFilters = ({ activeFilter, onChange }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-4 py-2 rounded-full text-sm border transition ${
            activeFilter === f
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-600 hover:bg-gray-100 border-gray-300"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
};

export default ComplaintFilters;
