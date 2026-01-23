const WardPerformance = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <h3 className="font-bold text-gray-800 mb-4 text-lg">
        Ward-wise Collection Performance
      </h3>

      {data.length === 0 ? (
        <p className="text-gray-500 text-sm">No ward data available.</p>
      ) : (
        <div className="space-y-4">
          {data.map((w) => (
            <div key={w.ward}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-700">{w.ward}</span>
                <span className="font-bold text-gray-900">{w.percent}%</span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                  style={{ width: `${w.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WardPerformance;
