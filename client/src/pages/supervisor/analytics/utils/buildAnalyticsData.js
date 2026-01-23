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
    if (!wardMap[ward]) wardMap[ward] = 70 + Math.floor(Math.random() * 25);
  });

  return Object.keys(wardMap).map((w) => ({
    ward: `Ward ${w}`,
    percent: wardMap[w],
  }));
};
