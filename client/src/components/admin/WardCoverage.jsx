// @ts-nocheck
const WardCoverage = ({ data }) => {
  const wards = data?.wards || [];
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' };
      case 'in-progress': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' };
      case 'pending': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500' };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-800">Ward Coverage Status</h3>
        <div className="p-2 bg-emerald-50 rounded-lg">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {wards.map((ward, index) => {
          const colors = getStatusColor(ward.status);
          const completion = ward.completion || 0;
          
          return (
            <div key={index} className={`${colors.bg} border ${colors.border} rounded-xl p-4 hover:shadow-md transition-all`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${colors.dot}`}></span>
                  <span className="font-semibold text-gray-800">{ward.name}</span>
                </div>
                <span className={`text-xs font-semibold ${colors.text} px-2 py-1 rounded-md ${colors.bg} border ${colors.border}`}>
                  {completion}%
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-2 mb-2">
                <div 
                  className={`${colors.dot.replace('bg-', 'bg-gradient-to-r from-')} to-opacity-70 h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${completion}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{ward.collectedToday || 0} tons collected</span>
                <span className="capitalize">{ward.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WardCoverage;
