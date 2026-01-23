const WardPerformance = ({ wards }) => {
  return (
    <div className="bg-white rounded-3xl shadow p-6">
      <h3 className="font-semibold mb-4">
        Ward-wise Collection Performance
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wards.map((w) => (
          <div key={w.name}>
            <div className="flex justify-between text-sm mb-1">
              <span>{w.name}</span>
              <span className="font-medium">{w.percent}%</span>
            </div>

            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-green-600 rounded"
                style={{ width: `${w.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WardPerformance;
