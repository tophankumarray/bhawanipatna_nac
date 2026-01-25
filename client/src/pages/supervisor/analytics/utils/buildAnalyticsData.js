import { COMPLAINT_STATUSES, VEHICLE_STATUSES } from "../analyticsConfig";

export const buildVehicleStatusData = (vehicles = []) => {
  const vehicleStatusCount = VEHICLE_STATUSES.reduce((acc, s) => {
    acc[s] = 0;
    return acc;
  }, {});

  vehicles.forEach((v) => {
    const st = (v.status || "").toLowerCase().trim();
    vehicleStatusCount[st] = (vehicleStatusCount[st] || 0) + 1;
  });

  return VEHICLE_STATUSES.map((s) => ({
    name: s,
    value: vehicleStatusCount[s],
  }));
};

export const buildComplaintStatusData = (complaints = []) => {
  const complaintStatusCount = COMPLAINT_STATUSES.reduce((acc, s) => {
    acc[s] = 0;
    return acc;
  }, {});

  complaints.forEach((c) => {
    const st = (c.status || "").trim();
    complaintStatusCount[st] = (complaintStatusCount[st] || 0) + 1;
  });

  return COMPLAINT_STATUSES.map((s) => ({
    name: s,
    count: complaintStatusCount[s],
  }));
};

export const buildWardPerformance = (vehicles = []) => {
  const wardMap = {};

  vehicles.forEach((v) => {
    const ward = String(v.ward || v.assignedWard || "Unknown").trim();

    if (!wardMap[ward]) {
      wardMap[ward] = { total: 0, running: 0 };
    }

    wardMap[ward].total += 1;

    const status = (v.status || "").toLowerCase().trim();
    if (status === "running") {
      wardMap[ward].running += 1;
    }
  });

  return Object.keys(wardMap).map((ward) => {
    const total = wardMap[ward].total;
    const running = wardMap[ward].running;

    return {
      ward: ward,
      percent: total ? Math.round((running / total) * 100) : 0,
    };
  });
};
