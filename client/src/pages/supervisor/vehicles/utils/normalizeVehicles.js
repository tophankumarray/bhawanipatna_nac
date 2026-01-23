export const normalizeVehicles = (list = []) => {
  if (!Array.isArray(list)) return [];

  return list
    .map((item, index) => {
      const registrationNumber = item?.truck_no || item?.truck_number;
      if (!registrationNumber) return null;

      return {
        id: item?.truck_id || registrationNumber || index,
        registrationNumber: String(registrationNumber).trim(),
        status: item?.gps_status || "stopped",
        assignedWard: item?.location || item?.ward || "N/A",
        speed: item?.speed ?? 0,
        lat: item?.lat ?? null,
        lng: item?.lng ?? null,
        signalStrength: item?.signal_strength ?? null,
        ignitionOn: item?.ignition === true,
        lastUpdated: item?.last_location_time
          ? new Date(item.last_location_time)
          : null,
        driver: item?.driver_name || "N/A",
      };
    })
    .filter(Boolean);
};
