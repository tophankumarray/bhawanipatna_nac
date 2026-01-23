import {
  Truck,
  LayoutDashboard,
  FileWarning,
  UserCheck,
  BarChart3,
  Navigation,
  Landmark,
  Wrench,
} from "lucide-react";

export const supervisorLinks = [
  { name: "Dashboard", path: "/supervisor/dashboard", icon: LayoutDashboard },
  { name: "Vehicles", path: "/supervisor/vehicles", icon: Truck },
  { name: "Complaints", path: "/supervisor/complaints", icon: FileWarning },
  { name: "Attendance", path: "/supervisor/attendance", icon: UserCheck },
  { name: "Analytics", path: "/supervisor/analytics", icon: BarChart3 },
  { name: "Wealth Center", path: "/supervisor/wealthcenter", icon: Landmark },
  { name: "Machinery Defect", path: "/supervisor/machinery-defect", icon: Wrench },
  { name: "Live Tracking", path: "/supervisor/live-tracking", icon: Navigation },
];
