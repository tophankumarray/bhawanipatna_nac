import { STATUS_STYLES } from "../vehiclesConfig";

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        STATUS_STYLES[status] ||
        "bg-gray-100 text-gray-700 border border-gray-300"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
