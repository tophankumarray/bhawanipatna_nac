// @ts-nocheck

export const normalizeVehicles = (list = []) => {
  return (list || []).map((item) => ({
    id: item?.imei || item?._id || Date.now().toString(),
    registrationNumber: item?.truck_number || "-",
    status: (item?.status || "").toLowerCase(), // running/standing/stopped
    assignedWard: item?.address || "-",
    speed: item?.speed || 0,
    lat: item?.lat || null,
    lng: item?.lng || null,
    signalStrength: item?.signal_strength || "-",
    ignitionOn: item?.is_ignition_on?.value ?? false,
    lastUpdated: item?.device_timestamp
      ? new Date(item.device_timestamp)
      : null,
  }));
};
