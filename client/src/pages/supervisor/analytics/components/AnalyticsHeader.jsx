const AnalyticsHeader = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h1 className="text-2xl font-black text-gray-900">Analytics Overview</h1>
      <p className="text-sm text-gray-500 mt-1">
        Data Period: Today ({new Date().toLocaleDateString()})
      </p>
    </div>
  );
};

export default AnalyticsHeader;
