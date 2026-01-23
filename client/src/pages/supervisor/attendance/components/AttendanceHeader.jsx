const AttendanceHeader = ({ date }) => {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800">
        Attendance Register
      </h1>
      <p className="text-sm text-gray-500">Date: {date} | Morning Shift</p>
    </div>
  );
};

export default AttendanceHeader;
