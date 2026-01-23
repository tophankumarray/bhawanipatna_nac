const VehicleStatusList = ({ vehicles }) => {
  return (
    <div className="bg-white rounded-3xl shadow p-6">
      <h3 className="font-semibold mb-4">Vehicle Status</h3>

      <ul className="space-y-3 text-sm h-72 overflow-y-auto">
        {vehicles.map((v) => (
          <li key={v.id} className="flex justify-between items-center">
            <span>{v.number}</span>
            <span
              className={`px-3 py-1 rounded-full text-xs text-white ${
                v.status === "Active" ? "bg-green-600" : "bg-red-500"
              }`}
            >
              {v.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VehicleStatusList;
