// @ts-nocheck
import api from "../../api/api";

export const getAllSupervisors = () =>
  api.get("/supervisors/getallsupervisors");

export const createSupervisor = (payload) =>
  api.post("/supervisors/createsupervisor", payload);

export const updateSupervisor = (id, payload) =>
  api.patch(`/supervisors/${id}`, payload);

export const deleteSupervisor = (id) =>
  api.delete(`/supervisors/${id}`);
