// @ts-nocheck
import { useEffect, useState } from "react";
import api from "../../api/api";

/* ================= CONFIG ================= */

const SUMMARY_CONFIG = [
  { title: "Total Staff", key: "total" },
  { title: "Present", key: "Present", color: "text-green-600" },
  { title: "Absent", key: "Absent", color: "text-red-600" },
  { title: "On Leave", key: "Leave", color: "text-yellow-600" },
];

const TABLE_HEADERS = [
  "Name",
  "Role",
  "Ward",
  "Check-In",
  "Check-Out",
  "Method",
  "Status",
  "Remarks",
];

const STATUS_STYLES = {
  Present: "bg-green-100 text-green-700",
  Absent: "bg-red-100 text-red-700",
  Leave: "bg-yellow-100 text-yellow-800",
};

const METHOD_STYLES = {
  GPS: "bg-blue-100 text-blue-700",
  Biometric: "bg-purple-100 text-purple-700",
  Leave: "bg-yellow-100 text-yellow-700",
  "-": "bg-gray-100 text-gray-500",
};

/* ================= MAIN COMPONENT ================= */

const Attendance = () => {
  const [date] = useState(new Date().toISOString().split("T")[0]);
  const [staff, setStaff] = useState([]);

  /* ================= LOAD ATTENDANCE ================= */

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const res = await api.get("/attendance");

        if (res.data?.length) {
          setStaff(
            res.data.map((s) => ({
              id: s.id,
              name: s.staff || "Unknown",
              role: s.role || "Staff",
              ward: s.ward || "Ward N/A",
              status: s.status || "Absent",
              checkIn: s.checkIn || "-",
              checkOut: s.checkOut || "-",
              method: s.method || "-",
              remarks:
                s.status === "Present"
                  ? "-"
                  : s.status === "Leave"
                  ? "Approved leave"
                  : "Not reported",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load attendance");
      }
    };

    loadAttendance();
  }, []);

  /* ================= SUMMARY VALUES ================= */

  const summaryValues = {
    total: staff.length,
    Present: staff.filter((s) => s.status === "Present").length,
    Absent: staff.filter((s) => s.status === "Absent").length,
    Leave: staff.filter((s) => s.status === "Leave").length,
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Attendance Register
        </h1>
        <p className="text-sm text-gray-500">
          Date: {date} | Morning Shift
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SUMMARY_CONFIG.map((card) => (
          <SummaryCard
            key={card.title}
            title={card.title}
            value={summaryValues[card.key]}
            color={card.color}
          />
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-green-600 text-white">
            <tr>
              {TABLE_HEADERS.map((h) => (
                <th key={h} className="px-4 py-3 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3">{s.role}</td>
                <td className="px-4 py-3">{s.ward}</td>
                <td className="px-4 py-3">{s.checkIn}</td>
                <td className="px-4 py-3">{s.checkOut}</td>
                <td className="px-4 py-3">
                  <MethodBadge method={s.method} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={s.status} />
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {s.remarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-4">
        {staff.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl shadow p-4 space-y-2"
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
              <span className="text-xs text-gray-500">
                {s.remarks}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* NOTE */}
      <p className="text-xs text-gray-500">
        Attendance is captured via GPS / Biometric systems.  
        Supervisors can verify records but cannot modify entries.
      </p>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const SummaryCard = ({ title, value, color }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <p className="text-xs text-gray-500">{title}</p>
    <h3 className={`text-2xl font-bold ${color || ""}`}>{value}</h3>
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      STATUS_STYLES[status]
    }`}
  >
    {status}
  </span>
);

const MethodBadge = ({ method }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs ${
      METHOD_STYLES[method]
    }`}
  >
    {method}
  </span>
);

export default Attendance;
