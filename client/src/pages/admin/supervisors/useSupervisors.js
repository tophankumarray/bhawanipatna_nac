// @ts-nocheck
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getAllSupervisors,
  createSupervisor,
  updateSupervisor,
  deleteSupervisor,
} from '../../../api/admin/supervisor.api'

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = buildSupervisorPayload(formData);

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
    } catch {
      toast.error("Failed to save supervisor");
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
