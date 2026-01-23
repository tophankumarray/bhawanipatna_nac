import { STATUS_STYLES } from "../attendanceConfig";

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        STATUS_STYLES[status]
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
