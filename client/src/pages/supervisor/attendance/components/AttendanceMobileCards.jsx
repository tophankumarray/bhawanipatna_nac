import MethodBadge from "./MethodBadge";
import StatusBadge from "./StatusBadge";

const AttendanceMobileCards = ({ staff }) => {
  return (
    <div className="md:hidden space-y-4">
      {staff.map((s) => (
        <div
          key={s.id}
          className="bg-white rounded-xl shadow p-4 space-y-2 border border-gray-200"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{s.name}</h3>
            <StatusBadge status={s.status} />
          </div>

          <p className="text-sm text-gray-600">
            {s.role} • {s.ward}
          </p>

          <div className="flex justify-between text-xs">
            <span>In: {s.checkIn}</span>
            <span>Out: {s.checkOut}</span>
          </div>

          <div className="flex justify-between items-center">
            <MethodBadge method={s.method} />
            <span className="text-xs text-gray-500">{s.remarks}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttendanceMobileCards;
