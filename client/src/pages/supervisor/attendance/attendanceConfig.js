import { Users, UserCheck, UserX, CalendarOff } from "lucide-react";

export const SUMMARY_CONFIG = [
  { title: "Total Staff", key: "total", color: "bg-blue-600", icon: Users },
  { title: "Present", key: "Present", color: "bg-green-600", icon: UserCheck },
  { title: "Absent", key: "Absent", color: "bg-red-600", icon: UserX },
  { title: "On Leave", key: "Leave", color: "bg-yellow-500", icon: CalendarOff },
];

export const TABLE_HEADERS = [
  "Name",
  "Role",
  "Ward",
  "Check-In",
  "Check-Out",
  "Method",
  "Status",
  "Remarks",
];

export const STATUS_STYLES = {
  Present: "bg-green-100 text-green-700 border border-green-300",
  Absent: "bg-red-100 text-red-700 border border-red-300",
  Leave: "bg-yellow-100 text-yellow-800 border border-yellow-300",
};

export const METHOD_STYLES = {
  GPS: "bg-blue-100 text-blue-700 border border-blue-300",
  Biometric: "bg-purple-100 text-purple-700 border border-purple-300",
  Leave: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  "-": "bg-gray-100 text-gray-500 border border-gray-300",
};
