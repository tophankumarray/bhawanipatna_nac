// @ts-nocheck

import api from "../api";

export const fetchTrackingVehicles = () => api.get("/tracking/trackings");
export const fetchComplaints = () => api.get("/complaints/all-complaints");
