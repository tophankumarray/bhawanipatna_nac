// @ts-nocheck
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  fetchAllComplaints,
  updateComplaintStatus
} from "../../../api/admin/complaint.api";
import { normalizeComplaints } from "./utils/complaint.utils";

export const useComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "all", search: "" });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [imageModal, setImageModal] = useState(null);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const res = await fetchAllComplaints();
      setComplaints(normalizeComplaints(res.data?.data));
    } catch {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, status) => {
    const map = {
      pending: "Pending",
      "in-progress": "In Progress",
      resolved: "Resolved",
    };

    try {
      await updateComplaintStatus(id, map[status]);
      setComplaints(prev =>
        prev.map(c => c.id === id ? { ...c, status } : c)
      );
      toast.success("Status updated");
    } catch {
      toast.error("Status update failed");
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const q = filters.search.toLowerCase();
    return (
      (filters.status === "all" || c.status === filters.status) &&
      (!q ||
        c.title?.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q) ||
        c.citizenName?.toLowerCase().includes(q))
    );
  });

  return {
    complaints,
    loading,
    filters,
    setFilters,
    filteredComplaints,
    selectedComplaint,
    setSelectedComplaint,
    imageModal,
    setImageModal,
    changeStatus,
  };
};
