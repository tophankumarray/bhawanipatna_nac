// @ts-nocheck
import api from "../api";

/**
 * Admin Login
 * POST /api/admin/login
 */
export const adminLogin = async (username, password) => {
  try {
    const response = await api.post("/admin/login", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Admin Logout
 * POST /api/admin/logout
 */
export const adminLogout = async () => {
  try {
    const response = await api.post("/admin/logout");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Supervisor Login
 * POST /api/supervisors/loginsupervisor
 */
export const supervisorLogin = async (username, password) => {
  try {
    const response = await api.post("/supervisors/loginsupervisor", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
