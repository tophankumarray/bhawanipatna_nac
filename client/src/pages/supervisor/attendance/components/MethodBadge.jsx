import { METHOD_STYLES } from "../attendanceConfig";

const MethodBadge = ({ method }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        METHOD_STYLES[method]
      }`}
    >
      {method}
    </span>
  );
};

export default MethodBadge;
