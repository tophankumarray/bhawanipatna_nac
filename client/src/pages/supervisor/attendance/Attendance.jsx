// @ts-nocheck
import { useEffect, useState } from "react";
import api from "../../../api/mockAPI";

import AttendanceHeader from "./components/AttendanceHeader";
import SummaryGrid from "./components/SummaryGrid";
import AttendanceTable from "./components/AttendanceTable";
import AttendanceMobileCards from "./components/AttendanceMobileCards";

import { normalizeAttendance } from "./utils/normalizeAttendance";

const Attendance = () => {
  const [date] = useState(new Date().toISOString().split("T")[0]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const res = await api.get("/attendance");

        if (res.data?.length) {
          setStaff(normalizeAttendance(res.data));
        }
      } catch (err) {
        console.error("Failed to load attendance");
      }
    };

    loadAttendance();
  }, []);

  const summaryValues = {
    total: staff.length,
    Present: staff.filter((s) => s.status === "Present").length,
    Absent: staff.filter((s) => s.status === "Absent").length,
    Leave: staff.filter((s) => s.status === "Leave").length,
  };

  return (
    <div className="space-y-8">
      <AttendanceHeader date={date} />

      <SummaryGrid summaryValues={summaryValues} />

      <AttendanceTable staff={staff} />

      <AttendanceMobileCards staff={staff} />

      <p className="text-xs text-gray-500">
        Attendance is captured via GPS / Biometric systems.
        Supervisors can verify records but cannot modify entries.
      </p>
    </div>
  );
};

export default Attendance;
