import { Truck, CheckCircle, AlertCircle, Percent } from "lucide-react";

export const VEHICLE_STATUSES = ["running", "standing", "stopped"];
export const COMPLAINT_STATUSES = ["pending", "in-progress", "resolved"];


export const COLORS = {
  running: "#22c55e",
  standing: "#facc15",
  stopped: "#ef4444",

  pending: "#ef4444",
  "in-progress": "#facc15",
  resolved: "#22c55e",
};

export const KPI_CONFIG = [
  { title: "Total Vehicles", key: "totalVehicles", icon: Truck, variant: "blue" },
  { title: "Running Vehicles", key: "runningVehicles", icon: CheckCircle, variant: "green" },
  { title: "Complaints Today", key: "totalComplaints", icon: AlertCircle, variant: "yellow" },
  { title: "Resolution Rate", key: "resolutionRate", icon: Percent, variant: "purple" },
];
