const ComplaintsHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Citizen Complaint Management
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Supervisor resolution & monitoring (ICT Compliant)
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="px-4 py-2 rounded-xl bg-green-50 border border-green-200">
          <p className="text-xs text-green-700 font-semibold">Live Monitoring</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-200">
          <p className="text-xs text-blue-700 font-semibold">Audit Ready</p>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsHeader;
