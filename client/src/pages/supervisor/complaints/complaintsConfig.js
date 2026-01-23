export const FILTERS = ["All", "Pending", "In Progress", "Resolved"];

export const TABLE_HEADERS = [
  "ID",
  "Photo",
  "Ward",
  "Issue",
  "Priority",
  "Vehicle",
  "Status",
  "SLA",
  "Route",
];

export const STATUS_COLOR = {
  pending: "bg-red-100 text-red-700",
  open: "bg-red-100 text-red-700",
  "in progress": "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-green-100 text-green-700",
};

export const PRIORITY_COLOR = {
  high: "text-red-600 font-semibold",
  medium: "text-orange-600 font-semibold",
  low: "text-green-600 font-semibold",
};
