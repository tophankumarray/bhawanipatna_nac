import {
  Activity,
  AlertCircle,
  ClipboardList,
  Truck,
  Wrench,
} from "lucide-react";

export const fallbackTrend = [
  { day: "Mon", value: 0 },
  { day: "Tue", value: 0 },
  { day: "Wed", value: 0 },
  { day: "Thu", value: 0 },
  { day: "Fri", value: 0 },
];

export const getKpiConfig = ({ vehiclesCount, activeComplaints, inProgress, resolved }) => [
  {
    title: "Total Vehicles",
    value: vehiclesCount,
    icon: Truck,
    color: "bg-gradient-to-br from-sky-500 to-sky-600",
  },
  {
    title: "Active Complaints",
    value: activeComplaints,
    icon: AlertCircle,
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
  },
  {
    title: "In Progress",
    value: inProgress,
    icon: Activity,
    color: "bg-gradient-to-br from-yellow-500 to-orange-500",
  },
  {
    title: "Resolved",
    value: resolved,
    icon: ClipboardList,
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
  },
];

export const QUICK_ACTIONS = [
  {
    label: "Report Defect",
    icon: Wrench,
    path: "/supervisor/defects",
    color: "from-emerald-600 to-green-700",
  },
  {
    label: "View Complaints",
    icon: AlertCircle,
    path: "/supervisor/complaints",
    color: "from-orange-500 to-orange-600",
  },
  {
    label: "Live Tracking",
    icon: Activity,
    path: "/supervisor/live-tracking",
    color: "from-green-500 to-emerald-600",
  },
];
