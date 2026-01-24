// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { fetchAllWards } from "../../../api/admin/ward.api";
import {
  getWasteCollections,
  createWasteCollection,
  updateWasteCollection,
  deleteWasteCollection,
} from "../../../api/admin/wasteCollection.api";

export const useWasteCollection = () => {
  /* ================= STATE ================= */
  const [collections, setCollections] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    status: "all",
    ward: "all",
    date: "",
    search: "",
  });

  const [formData, setFormData] = useState({
    ward: "",
    vehicle: "",
    driver: "",
    route: "",
    wasteType: "",
    quantity: "",
    collectionDate: new Date().toISOString().split("T")[0],
    status: "pending",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);

  /* ================= FETCH ================= */
  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await getWasteCollections();

      const mapped = (res.data.data || []).map((w) => ({
        _id: w._id,
        ward: w.ward,
        vehicle: w.vehicleNumber,
        driver: w.driverName,
        route: w.route,
        wasteType: w.wasteType,
        quantity: w.targetQuantity,
        targetQuantity: w.targetQuantity,
        collectionDate: w.collectionDate?.split("T")[0],
        status: w.status,
        notes: w.notes || "",
      }));

      setCollections(mapped);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load waste collections");
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWards = async () => {
    try {
      const res = await fetchAllWards();
      setWards(res.data.data || []);
    } catch {
      toast.error("Failed to load wards");
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchWards();
  }, []);

  /* ================= FILTERED DATA ================= */
  const filteredCollections = useMemo(() => {
    return collections.filter((c) => {
      if (filters.status !== "all" && c.status !== filters.status) return false;
      if (filters.ward !== "all" && c.ward !== filters.ward) return false;
      if (filters.date && c.collectionDate !== filters.date) return false;

      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          c.vehicle?.toLowerCase().includes(q) ||
          c.driver?.toLowerCase().includes(q) ||
          c.route?.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [collections, filters]);

  /* ================= STATS ================= */
  const stats = useMemo(() => {
    const total = collections.length;
    const completed = collections.filter((c) => c.status === "completed").length;
    const inProgress = collections.filter((c) => c.status === "inprogress").length;
    const pending = collections.filter((c) => c.status === "pending").length;

    const totalWaste = collections.reduce(
      (sum, c) => sum + (parseFloat(c.quantity) || 0),
      0
    );

    const targetWaste = collections.reduce(
      (sum, c) => sum + (parseFloat(c.targetQuantity) || 0),
      0
    );

    return {
      total,
      completed,
      inProgress,
      pending,
      totalWaste: totalWaste.toFixed(1),
      targetWaste: targetWaste.toFixed(1),
    };
  }, [collections]);

  /* ================= HELPERS ================= */
  const getUniqueWards = () => {
    return [...new Set(collections.map((c) => c.ward))].sort();
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e, onSuccess) => {
  e.preventDefault();

  const payload = {
    ward: formData.ward,
    vehicleNumber: formData.vehicle,
    driverName: formData.driver,
    route: formData.route,
    wasteType: formData.wasteType,
    targetQuantity: Number(formData.quantity),
    collectionDate: formData.collectionDate,
    status: formData.status,
    notes: formData.notes,
  };

  try {
    if (editingId) {
      await updateWasteCollection(editingId, payload);
      toast.success("Waste collection updated");
    } else {
      await createWasteCollection(payload);
      toast.success("Waste collection added");
    }

    resetForm();
    fetchCollections();

    // ✅ CLOSE MODAL AFTER SUCCESS
    if (onSuccess) onSuccess();

  } catch (err) {
    console.error(err);
    toast.error("Failed to save waste collection");
  }
};


  const handleEdit = (row) => {
    setEditingId(row._id);
    setFormData({
      ward: row.ward,
      vehicle: row.vehicle,
      driver: row.driver,
      route: row.route,
      wasteType: row.wasteType,
      quantity: row.quantity,
      collectionDate: row.collectionDate,
      status: row.status,
      notes: row.notes || "",
    });
  };

  const resetForm = () => {
    setFormData({
      ward: "",
      vehicle: "",
      driver: "",
      route: "",
      wasteType: "",
      quantity: "",
      collectionDate: new Date().toISOString().split("T")[0],
      status: "pending",
      notes: "",
    });
    setEditingId(null);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this collection record?")) return;
    try {
      await deleteWasteCollection(id);
      toast.success("Waste collection deleted");
      fetchCollections();
    } catch {
      toast.error("Failed to delete waste collection");
    }
  };

  return {
    /* state */
    loading,
    collections,
    filteredCollections,
    filters,
    setFilters,
    stats,
    wards,

    /* helpers */
    getUniqueWards,

    /* form */
    formData,
    setFormData,
    setEditingId,

    /* actions */
    handleSubmit,
    handleEdit,
    handleDelete,
    fetchCollections,
    resetForm,
  };
};
