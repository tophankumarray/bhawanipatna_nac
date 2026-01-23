import { TABLE_HEADERS } from "../attendanceConfig";
import MethodBadge from "./MethodBadge";
import StatusBadge from "./StatusBadge";

const AttendanceTable = ({ staff }) => {
  return (
    <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto border border-gray-200">
      <table className="w-full text-sm border-collapse border border-gray-300">
        <thead className="bg-green-600 text-white">
          <tr>
            {TABLE_HEADERS.map((h) => (
              <th key={h} className="px-4 py-3 text-left border border-green-700">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {staff.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium border border-gray-300">
                {s.name}
              </td>
              <td className="px-4 py-3 border border-gray-300">{s.role}</td>
              <td className="px-4 py-3 border border-gray-300">{s.ward}</td>
              <td className="px-4 py-3 border border-gray-300">{s.checkIn}</td>
              <td className="px-4 py-3 border border-gray-300">{s.checkOut}</td>
              <td className="px-4 py-3 border border-gray-300">
                <MethodBadge method={s.method} />
              </td>
              <td className="px-4 py-3 border border-gray-300">
                <StatusBadge status={s.status} />
              </td>
              <td className="px-4 py-3 text-xs text-gray-600 border border-gray-300">
                {s.remarks}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
