// @ts-nocheck
import api from "../../../../api/api";

export const fetchVehicles = () => api.get("/tracking/trackings");
export const fetchComplaints = () => api.get("/complaints/allcomplaints");
export const fetchWards = () => api.get("/wards/getallwards");
export const fetchWasteCollections = () =>
  api.get("/waste-collections/getwastecollection");
export const fetchFuelRecords = () =>
  api.get("/fuel-management/get-all-fuel-management");
