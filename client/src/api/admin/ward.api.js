// @ts-nocheck
import api from "../../api/api";

export const fetchAllWards = () =>
  api.get("/wards/getallwards");

export const createWard = (payload) =>
  api.post("/wards/createward", payload);
