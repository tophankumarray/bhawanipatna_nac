// @ts-nocheck
const PendingActions = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-amber-500 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-800">Pending Actions</h3>
        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      
      <div className="space-y-5">
        {/* Pending Complaints */}
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Pending Complaints</span>
            <span className="text-3xl font-bold text-amber-600">{data?.pendingComplaints || 0}</span>
          </div>
        </div>
        
        {/* Avg Response Time */}
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Avg Response Time</span>
            <span className="text-3xl font-bold text-orange-600">{data?.avgResponseTime || '0h'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingActions;
