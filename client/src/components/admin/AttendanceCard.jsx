// @ts-nocheck
const AttendanceCard = ({ member, onViewDetails, onEdit }) => {
  const getStatusColor = (status) => {
    const colors = {
      present: { bg: 'bg-emerald-500', text: 'text-emerald-600', badge: 'from-emerald-500 to-teal-500' },
      absent: { bg: 'bg-red-500', text: 'text-red-600', badge: 'from-red-500 to-rose-500' },
      'on-leave': { bg: 'bg-blue-500', text: 'text-blue-600', badge: 'from-blue-500 to-indigo-500' },
      late: { bg: 'bg-orange-500', text: 'text-orange-600', badge: 'from-orange-500 to-amber-500' },
      'half-day': { bg: 'bg-purple-500', text: 'text-purple-600', badge: 'from-purple-500 to-pink-500' }
    };
    return colors[status] || colors.present;
  };

  const getStatusIcon = (status) => {
    const icons = {
      present: '✅',
      absent: '❌',
      'on-leave': '🏖️',
      late: '⏰',
      'half-day': '⏱️'
    };
    return icons[status] || '✅';
  };

  const getRoleIcon = (role) => {
    const icons = {
      driver: '🚗',
      cleaner: '🧹',
      supervisor: '👔'
    };
    return icons[role] || '👤';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${getStatusColor(member.status).badge} rounded-xl flex items-center justify-center shadow-md`}>
              <span className="text-white text-2xl">{getRoleIcon(member.role)}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{member.role}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span className={`bg-gradient-to-r ${getStatusColor(member.status).badge} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md capitalize`}>
              {member.status.replace('-', ' ')}
            </span>
            <span className="text-xl">{getStatusIcon(member.status)}</span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">📍 Ward:</span>
            <span className="text-sm font-semibold text-gray-900">{member.assignedWard}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">📞 Phone:</span>
            <span className="text-sm font-semibold text-gray-900">{member.phone}</span>
          </div>
          {member.vehicleAssigned && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">🚛 Vehicle:</span>
              <span className="text-sm font-semibold text-gray-900">{member.vehicleAssigned}</span>
            </div>
          )}
        </div>

        {/* Time Info */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl mb-4">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="text-gray-600 mb-1">Check In</p>
              <p className="font-bold text-gray-900">{member.checkInTime || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Check Out</p>
              <p className="font-bold text-gray-900">{member.checkOutTime || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Working</p>
              <p className="font-bold text-emerald-600">{member.workingHours}</p>
            </div>
          </div>
        </div>

        {/* Leave Reason */}
        {member.leaveReason && (
          <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg mb-4">
            <p className="text-xs text-blue-800">
              <span className="font-semibold">Reason:</span> {member.leaveReason}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(member)}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 rounded-lg text-sm font-semibold shadow-md transition-all"
          >
            View Details
          </button>
          <button
            onClick={() => onEdit(member)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 rounded-lg text-sm font-semibold shadow-md transition-all"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;
