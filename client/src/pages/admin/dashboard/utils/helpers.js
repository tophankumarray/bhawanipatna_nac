// @ts-nocheck
export const normalizeComplaintStatus = (status) => {
  if (!status) return "pending";
  return status.toLowerCase().replace(" ", "-");
};

export const getVehicleStatus = (v) => {
  const lat = v.lat ?? v.latitude ?? v.lat_value;
  const lng = v.lng ?? v.longitude ?? v.lng_value;

  if (lat == null || lng == null) return "dataNotRetrieving";
  if (Number(v.speed) > 0) return "running";
  if (Number(v.speed) === 0) return "standing";
  return "stopped";
};

export const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
