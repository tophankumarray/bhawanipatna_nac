// @ts-nocheck
// src/api/admin/fuelManagement.api.js
import api from "../api";

/* ================= GET ================= */
export const getAllFuelRecords = () =>
  api.get("/fuel-management/get-all-fuel-management");

/* ================= CREATE ================= */
export const createFuelRecord = (data) =>
  api.post("/fuel-management/fuel-management", data);

/* ================= UPDATE ================= */
export const updateFuelRecord = (id, data) =>
  api.patch(`/fuel-management/fuel-management/${id}`, data);

/* ================= DELETE ================= */
export const deleteFuelRecord = (id) =>
  api.delete(`/fuel-management/fuel-management/${id}`);
