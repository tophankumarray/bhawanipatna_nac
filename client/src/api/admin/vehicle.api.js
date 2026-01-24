import api from "../../api/api";

export const fetchVehicles = () =>
  api.get("/tracking/trackings");
