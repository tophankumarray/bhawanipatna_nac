// @ts-nocheck
const HeaderSection = ({ onRefresh }) => {
  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl sm:text-4xl font-extrabold bg-linear-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-3 animate-gradient">
            Command & Control Center 🌿
          </h1>
          <p className="text-gray-600 text-lg flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Real-time monitoring of waste management operations across all wards
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="bg-white hover:bg-emerald-50 px-4 py-2 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-105"
            title="Refresh Dashboard"
          >
            <span className="text-xl">🔄</span>
          </button>

          <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-100">
            <p className="text-xs text-gray-500">Current Date</p>
            <p className="font-semibold text-gray-800">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
