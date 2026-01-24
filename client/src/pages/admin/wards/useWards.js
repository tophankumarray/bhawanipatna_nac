// @ts-nocheck
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  fetchAllWards,
  createWard
} from "../../../api/admin/ward.api";
import { buildWardPayload } from "./utils/ward.utils";

export const useWards = () => {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "" });
  const [selectedWard, setSelectedWard] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newWard, setNewWard] = useState({
    wardName: "",
    area: "",
    population: "",
    household: "",
    wasteGenerationPerDay: "",
    collectionFrequency: "daily",
    supervisorName: "",
    supervisorPhone: "",
  });

  useEffect(() => {
    loadWards();
  }, []);

  const loadWards = async () => {
    try {
      setLoading(true);
      const res = await fetchAllWards();
      setWards(res.data.data || []);
    } catch {
      toast.error("Failed to load wards");
      setWards([]);
    } finally {
      setLoading(false);
    }
  };

  const addWard = async (e) => {
    e.preventDefault();
    try {
      await createWard(buildWardPayload(newWard));
      toast.success("Ward added successfully");
      setShowAddModal(false);
      setNewWard({
        wardName: "",
        area: "",
        population: "",
        household: "",
        wasteGenerationPerDay: "",
        collectionFrequency: "daily",
        supervisorName: "",
        supervisorPhone: "",
      });
      loadWards();
    } catch (err) {
      toast.error("Failed to add ward");
    }
  };

  const filteredWards = wards.filter(w =>
    !filters.search ||
    w.wardName?.toLowerCase().includes(filters.search.toLowerCase()) ||
    w.supervisorName?.toLowerCase().includes(filters.search.toLowerCase())
  );

  return {
    wards,
    loading,
    filters,
    setFilters,
    filteredWards,
    selectedWard,
    setSelectedWard,
    showAddModal,
    setShowAddModal,
    newWard,
    setNewWard,
    addWard,
  };
};
