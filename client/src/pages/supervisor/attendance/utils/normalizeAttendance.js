export const normalizeAttendance = (data = []) => {
  return data.map((s) => ({
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
  }));
};
