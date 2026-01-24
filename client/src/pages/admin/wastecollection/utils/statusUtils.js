// @ts-nocheck
export const getStatusColor = (status) => {
  const map = {
    completed: { badge: "bg-emerald-100 text-emerald-700" },
    inprogress: { badge: "bg-blue-100 text-blue-700" },
    pending: { badge: "bg-orange-100 text-orange-700" },
    cancel: { badge: "bg-red-100 text-red-700" },
  };
  return map[status] || map.pending;
};
