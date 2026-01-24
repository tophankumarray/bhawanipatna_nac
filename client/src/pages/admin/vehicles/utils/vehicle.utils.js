// @ts-nocheck
export const ALLOWED_VEHICLES = [
  "OD33AR9619",
  "OD33AR9647",
  "OD07AV6580",
  "OD07AB8906",
  "OD07AB8905",
];

export const normalizeVehicles = (list = []) =>
  list.map(item => ({
    id: item.imei,
    registrationNumber: item.truck_number,
    status: item.status,
    assignedWard: item.address,
    speed: item.speed,
    lat: item.lat,
    lng: item.lng,
    signalStrength: item.signal_strength,
    ignitionOn: item.is_ignition_on?.value,
    lastUpdated: new Date(item.device_timestamp),
  }));

export const getStatusBadge = (status) => ({
  running: "bg-linear-to-r from-emerald-500 to-teal-500",
  standing: "bg-gradient-to-r from-blue-400 to-indigo-400",
  stopped: "bg-gradient-to-r from-orange-500 to-amber-500",
  dataNotRetrieving: "bg-gradient-to-r from-gray-400 to-gray-500",
}[status] || "bg-gradient-to-r from-gray-400 to-gray-500");
