export const FILTERS = ["All", "Pending", "In-Progress", "Resolved"];

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
  pending: "bg-red-50 text-red-700 border border-red-200",
  open: "bg-red-50 text-red-700 border border-red-200",

  "in-progress": "bg-yellow-50 text-yellow-700 border border-yellow-200",
  "in progress": "bg-yellow-50 text-yellow-700 border border-yellow-200",

  resolved: "bg-green-50 text-green-700 border border-green-200",
  closed: "bg-green-50 text-green-700 border border-green-200",
};

export const PRIORITY_COLOR = {
  high: "text-red-600 font-bold",
  medium: "text-orange-600 font-bold",
  low: "text-green-600 font-bold",
};

