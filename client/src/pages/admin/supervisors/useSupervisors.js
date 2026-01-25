// @ts-nocheck
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  createSupervisor,
  deleteSupervisor,
  getAllSupervisors,
  updateSupervisor,
} from "../../../api/admin/supervisor.api";

import {
  buildSupervisorPayload,
  generateRandomPassword,
} from "./utils/supervisor.utils";

export const useSupervisors = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    status: "active",
  });

  useEffect(() => {
    loadSupervisors();
  }, []);

  const loadSupervisors = async () => {
    try {
      setLoading(true);
      const res = await getAllSupervisors();
      setSupervisors(res.data.data || []);
    } catch {
      toast.error("Failed to load supervisors");
      setSupervisors([]);
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const password = generateRandomPassword();
    setFormData({ ...formData, password });
    toast.success("Password generated!");
  };

  /* 🔥 UPDATED HERE */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ FRONTEND VALIDATION (VERY IMPORTANT)
    if (formData.mobile.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return;
    }

    const payload = buildSupervisorPayload(formData);

    console.log("CREATE supervisor payload:", payload); // 🔍 debug once

    try {
      if (selectedSupervisor) {
        await updateSupervisor(selectedSupervisor._id, payload);
        toast.success("Supervisor updated");
      } else {
        await createSupervisor(payload);
        toast.success("Supervisor created");
      }

      closeModal();
      loadSupervisors();
    } catch (error) {
      console.error("Error saving supervisor:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save supervisor";

      const errors = error.response?.data?.errors;

      if (errors && Array.isArray(errors)) {
        errors.forEach((err) => toast.error(err));
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleEdit = (s) => {
    setSelectedSupervisor(s);
    setFormData({
      name: s.supervisorName,
      username: s.username,
      email: s.email,
      mobile: s.phoneNumber,
      password: "",
      status: s.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this supervisor?")) return;
    try {
      await deleteSupervisor(id);
      toast.success("Supervisor deleted");
      loadSupervisors();
    } catch {
      toast.error("Failed to delete supervisor");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSupervisor(null);
    setFormData({
      name: "",
      username: "",
      email: "",
      mobile: "",
      password: "",
      status: "active",
    });
  };

  return {
    supervisors,
    loading,
    showModal,
    setShowModal,
    selectedSupervisor,
    formData,
    setFormData,
    generatePassword,
    handleSubmit,
    handleEdit,
    handleDelete,
    closeModal,
  };
};
