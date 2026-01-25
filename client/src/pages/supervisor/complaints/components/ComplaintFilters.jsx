import { FILTERS } from "../complaintsConfig";

const ComplaintFilters = ({ activeFilter, onChange }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map((f) => {
        const active = activeFilter === f;

        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
              ${
                active
                  ? "bg-green-600 text-white border-green-600 shadow-sm scale-[1.02]"
                  : "bg-white text-gray-600 hover:bg-gray-100 border-gray-300"
              }`}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
};

export default ComplaintFilters;
