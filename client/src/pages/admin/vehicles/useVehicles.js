// @ts-nocheck
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchVehicles } from "../../../api/admin/vehicle.api";
import {
  ALLOWED_VEHICLES,
  normalizeVehicles
} from "./utils/vehicle.utils";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    type: "all",
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const res = await fetchVehicles();
      const list = res.data?.data?.list || [];

      const normalized = normalizeVehicles(list);

      const allowed = normalized.filter(v =>
        ALLOWED_VEHICLES.includes(v.registrationNumber)
      );

      setVehicles(allowed);
    } catch {
      toast.error("Failed to load vehicles");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesStatus =
      filters.status === "all" || v.status === filters.status;

    const matchesSearch =
      !filters.search ||
      v.registrationNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
      v.assignedWard?.toLowerCase().includes(filters.search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return {
    loading,
    filters,
    setFilters,
    filteredVehicles,
    selectedVehicle,
    setSelectedVehicle,
  };
};
