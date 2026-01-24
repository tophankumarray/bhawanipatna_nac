import api from "../../api/api";

export const fetchTrackings = () =>
  api.get("/tracking/trackings");