// @ts-nocheck
const StaffPerformance = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-800">Staff Attendance & Performance</h3>
        <div className="p-2 bg-blue-50 rounded-lg">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100 text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-1">{data?.present || 0}</div>
          <div className="text-xs text-gray-600 font-medium">Present</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-1">{data?.absent || 0}</div>
          <div className="text-xs text-gray-600 font-medium">Absent</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">{data?.onLeave || 0}</div>
          <div className="text-xs text-gray-600 font-medium">On Leave</div>
        </div>
      </div>

      {/* Attendance Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Attendance Rate</span>
          <span className="text-lg font-bold text-emerald-600">{data?.attendanceRate || 0}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${data?.attendanceRate || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Task Completion */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tasks Assigned</span>
          <span className="font-semibold text-gray-800">{data?.tasksAssigned || 0}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tasks Completed</span>
          <span className="font-semibold text-emerald-600">{data?.tasksCompleted || 0}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tasks In Progress</span>
          <span className="font-semibold text-blue-600">{data?.tasksInProgress || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default StaffPerformance;
