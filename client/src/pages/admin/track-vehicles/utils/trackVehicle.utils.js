// @ts-nocheck
export const ALLOWED_VEHICLES = [
  "OD33AR9619",
  "OD33AR9647",
  "OD07AV6580",
  "OD07AB8906",
  "OD07AB8905",
];

export const getStatusColor = (status) => {
  const colors = {
    running: { bg: "bg-emerald-500", text: "text-emerald-600", dot: "bg-emerald-500" },
    standing: { bg: "bg-blue-500", text: "text-blue-600", dot: "bg-blue-500" },
    stopped: { bg: "bg-orange-500", text: "text-orange-600", dot: "bg-orange-500" },
    dataNotRetrieving: { bg: "bg-gray-500", text: "text-gray-600", dot: "bg-gray-500" },
  };
  return colors[status] || colors.stopped;
};

export const getTimeSinceUpdate = (timestamp) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
};
